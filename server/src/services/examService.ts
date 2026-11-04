import { ExamRepository, AttemptRepository } from '../repositories/examRepository.js';
import { prisma } from '../config/prisma.js';
import { AuditRepository } from '../repositories/auditRepository.js';

export class ExamService {
  static async listExams(filters?: { category?: string; difficulty?: string }) {
    return ExamRepository.findAll({ ...filters, isPublished: true });
  }

  static async getExamDetails(id: string) {
    const exam = await ExamRepository.findById(id, false);
    if (!exam || !exam.isPublished) {
      throw new Error('Exam not found or unavailable.');
    }
    return exam;
  }

  static async startExam(examId: string, userId: string) {
    const exam = await ExamRepository.findById(examId, false);
    if (!exam || !exam.isPublished) {
      throw new Error('Exam not found.');
    }

    const previousAttemptsCount = await AttemptRepository.countUserAttemptsForExam(userId, examId);
    if (previousAttemptsCount >= exam.maxAttempts) {
      throw new Error(`Maximum attempt limit (${exam.maxAttempts}) reached for this exam.`);
    }

    // Check for an existing in-progress attempt to resume
    const existingInProgress = await prisma.attempt.findFirst({
      where: {
        examId,
        userId,
        status: 'IN_PROGRESS',
      },
      include: {
        answers: true,
      },
    });

    if (existingInProgress) {
      const elapsedSeconds = Math.floor(
        (Date.now() - new Date(existingInProgress.startedAt).getTime()) / 1000
      );
      const totalSecondsAllowed = exam.durationMinutes * 60;
      const remainingSeconds = Math.max(0, totalSecondsAllowed - elapsedSeconds);

      if (remainingSeconds <= 0) {
        // Auto-close timed-out attempt
        await AttemptRepository.completeAttempt(existingInProgress.id, {
          score: 0,
          accuracyPercentage: 0,
          timeSpentSeconds: totalSecondsAllowed,
          peerPercentile: 50.0,
          status: 'TIMED_OUT',
        });
      } else {
        return {
          attempt: existingInProgress,
          exam,
          remainingSeconds,
          resumed: true,
        };
      }
    }

    // Create fresh attempt
    const attempt = await AttemptRepository.create({
      examId,
      userId,
      attemptNumber: previousAttemptsCount + 1,
      maxScore: exam.totalMarks,
    });

    let questions = [...exam.questions];
    if (exam.shuffleQuestions) {
      questions = questions.sort(() => Math.random() - 0.5);
    }

    return {
      attempt,
      exam: {
        ...exam,
        questions,
      },
      remainingSeconds: exam.durationMinutes * 60,
      resumed: false,
    };
  }

  static async syncAnswer(
    attemptId: string,
    userId: string,
    data: {
      questionId: string;
      selectedOptionId?: string | null;
      isMarkedForReview?: boolean;
      timeSpentSeconds?: number;
    }
  ) {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: { exam: true },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error('Attempt not found or access unauthorized.');
    }

    if (attempt.status !== 'IN_PROGRESS') {
      throw new Error('Exam attempt is already submitted or timed out.');
    }

    // Verify time limit
    const elapsedSeconds = Math.floor(
      (Date.now() - new Date(attempt.startedAt).getTime()) / 1000
    );
    if (elapsedSeconds > attempt.exam.durationMinutes * 60 + 30) {
      // 30s buffer for network latency
      throw new Error('Exam time limit expired.');
    }

    return AttemptRepository.upsertAnswer({
      attemptId,
      questionId: data.questionId,
      selectedOptionId: data.selectedOptionId,
      isMarkedForReview: data.isMarkedForReview,
      timeSpentSeconds: data.timeSpentSeconds,
    });
  }

  static async submitExam(attemptId: string, userId: string) {
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        exam: {
          include: {
            questions: {
              include: { options: true },
            },
          },
        },
        answers: true,
      },
    });

    if (!attempt || attempt.userId !== userId) {
      throw new Error('Attempt not found or unauthorized.');
    }

    if (attempt.status === 'COMPLETED') {
      return this.getAttemptReview(attemptId, userId);
    }

    const exam = attempt.exam;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;
    let totalScore = 0;

    const answersMap = new Map(attempt.answers.map((a) => [a.questionId, a]));

    for (const q of exam.questions) {
      const studentAns = answersMap.get(q.id);
      const correctOption = q.options.find((o) => o.isCorrect);

      if (!studentAns || !studentAns.selectedOptionId) {
        unattemptedCount++;
      } else if (studentAns.selectedOptionId === correctOption?.id) {
        correctCount++;
        const marks = q.marks || 1.0;
        totalScore += marks;
        await prisma.attemptAnswer.update({
          where: { id: studentAns.id },
          data: { isCorrect: true, marksAwarded: marks },
        });
      } else {
        incorrectCount++;
        const penalty = (q.marks || 1.0) * (exam.negativeMarkingRatio || 0.25);
        totalScore -= penalty;
        await prisma.attemptAnswer.update({
          where: { id: studentAns.id },
          data: { isCorrect: false, marksAwarded: -penalty },
        });
      }
    }

    // Final score cannot drop below zero
    const finalScore = Math.max(0, parseFloat(totalScore.toFixed(2)));
    const attemptedCount = correctCount + incorrectCount;
    const accuracy =
      attemptedCount > 0
        ? parseFloat(((correctCount / attemptedCount) * 100).toFixed(1))
        : 0;

    const elapsedSeconds = Math.min(
      exam.durationMinutes * 60,
      Math.floor((Date.now() - new Date(attempt.startedAt).getTime()) / 1000)
    );

    const peerPercentile = await AttemptRepository.calculatePercentile(exam.id, finalScore);

    const completed = await AttemptRepository.completeAttempt(attempt.id, {
      score: finalScore,
      accuracyPercentage: accuracy,
      timeSpentSeconds: elapsedSeconds,
      peerPercentile,
      status: 'COMPLETED',
    });

    // Increment student profile activity
    await prisma.studentProfile.updateMany({
      where: { userId },
      data: {
        lastActiveDate: new Date(),
      },
    });

    await AuditRepository.logAction({
      actorUserId: userId,
      action: 'SUBMIT_EXAM',
      entityType: 'EXAM',
      entityId: exam.id,
      metadataJson: JSON.stringify({
        score: finalScore,
        accuracy,
        percentile: peerPercentile,
      }),
    });

    return {
      attempt: completed,
      summary: {
        totalQuestions: exam.questions.length,
        correctCount,
        incorrectCount,
        unattemptedCount,
        finalScore,
        maxScore: exam.totalMarks,
        accuracyPercentage: accuracy,
        peerPercentile,
        passingMarks: exam.passingMarks,
        isPassed: finalScore >= exam.passingMarks,
        timeSpentSeconds: elapsedSeconds,
      },
    };
  }

  static async getAttemptReview(attemptId: string, userId: string) {
    const attempt = await AttemptRepository.findById(attemptId);
    if (!attempt || (attempt.userId !== userId && !['ADMIN', 'FACULTY'].includes(attempt.user.role || ''))) {
      throw new Error('Attempt review not found or unauthorized.');
    }

    // Aggregate topic-wise performance
    const topicBreakdown: Record<string, { total: number; correct: number; incorrect: number }> = {};

    for (const q of attempt.exam.questions) {
      const topic = q.topicTag || 'General';
      if (!topicBreakdown[topic]) {
        topicBreakdown[topic] = { total: 0, correct: 0, incorrect: 0 };
      }
      topicBreakdown[topic].total++;

      const ans = attempt.answers.find((a) => a.questionId === q.id);
      if (ans?.isCorrect) {
        topicBreakdown[topic].correct++;
      } else if (ans?.selectedOptionId) {
        topicBreakdown[topic].incorrect++;
      }
    }

    return {
      attempt,
      topicBreakdown,
    };
  }
}
