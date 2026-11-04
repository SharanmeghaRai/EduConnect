import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  Award,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Exam, Question, Attempt } from '../types/index.js';
import { DistractionFreeExamLayout } from '../components/layout/DistractionFreeExamLayout.js';
import { Button } from '../components/ui/Button.js';
import { Modal } from '../components/ui/Modal.js';
import { Card } from '../components/ui/Card.js';
import { PdfReferenceModal } from '../components/ui/PdfReferenceModal.js';

export const ExamRoomPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Engine state
  const [exam, setExam] = useState<Exam | null>(null);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  // User state map: questionId -> { selectedOptionId, isMarkedForReview, timeSpentSeconds }
  const [answersMap, setAnswersMap] = useState<
    Record<string, { selectedOptionId?: string; isMarkedForReview: boolean; timeSpentSeconds: number }>
  >({});

  const [remainingSeconds, setRemainingSeconds] = useState(1800);
  const [hasStarted, setHasStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showReferenceModal, setShowReferenceModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch exam metadata for instructions screen
  useEffect(() => {
    const fetchExam = async () => {
      try {
        const res = await api.exams.get(id!);
        setExam(res.exam);
        setRemainingSeconds(res.exam.durationMinutes * 60);
      } catch (err: any) {
        alert(err.message || 'Failed to load exam details.');
        navigate('/exams');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [id, navigate]);

  // Timer countdown hook
  useEffect(() => {
    if (!hasStarted || remainingSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinalSubmit(true); // auto-submit on 00:00
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [hasStarted, remainingSeconds]);

  // Start exam trigger
  const handleStartExam = async () => {
    setLoading(true);
    try {
      const res = await api.exams.start(id!);
      setAttempt(res.attempt);
      setQuestions(res.exam.questions || []);
      setRemainingSeconds(res.remainingSeconds);

      // Restore previously saved answers if resuming
      if (res.attempt.answers && res.attempt.answers.length > 0) {
        const restored: Record<string, any> = {};
        for (const a of res.attempt.answers) {
          restored[a.questionId] = {
            selectedOptionId: a.selectedOptionId,
            isMarkedForReview: a.isMarkedForReview,
            timeSpentSeconds: a.timeSpentSeconds,
          };
        }
        setAnswersMap(restored);
      }

      setHasStarted(true);
    } catch (err: any) {
      alert(err.message || 'Cannot start exam. Attempt limit may be reached.');
      navigate('/exams');
    } finally {
      setLoading(false);
    }
  };

  // Option selection with auto-save sync
  const handleSelectOption = async (optionId: string) => {
    const currentQ = questions[currentIdx];
    if (!currentQ || !attempt) return;

    const updated = {
      ...answersMap[currentQ.id],
      selectedOptionId: optionId,
      isMarkedForReview: answersMap[currentQ.id]?.isMarkedForReview || false,
      timeSpentSeconds: (answersMap[currentQ.id]?.timeSpentSeconds || 0) + 5,
    };

    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: updated,
    }));

    // Async sync with Tier 2 server (silent auto-save)
    try {
      await api.exams.syncAnswer(attempt.id, {
        questionId: currentQ.id,
        selectedOptionId: optionId,
        isMarkedForReview: updated.isMarkedForReview,
        timeSpentSeconds: updated.timeSpentSeconds,
      });
    } catch (err) {
      console.warn('Auto-save sync warning:', err);
    }
  };

  // Clear choice
  const handleClearChoice = async () => {
    const currentQ = questions[currentIdx];
    if (!currentQ || !attempt) return;

    const updated = {
      ...answersMap[currentQ.id],
      selectedOptionId: undefined,
      isMarkedForReview: answersMap[currentQ.id]?.isMarkedForReview || false,
      timeSpentSeconds: answersMap[currentQ.id]?.timeSpentSeconds || 0,
    };

    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: updated,
    }));

    try {
      await api.exams.syncAnswer(attempt.id, {
        questionId: currentQ.id,
        selectedOptionId: null,
        isMarkedForReview: updated.isMarkedForReview,
        timeSpentSeconds: updated.timeSpentSeconds,
      });
    } catch (err) {
      console.warn('Clear choice sync warning:', err);
    }
  };

  // Toggle Mark for Review
  const handleToggleReview = async () => {
    const currentQ = questions[currentIdx];
    if (!currentQ || !attempt) return;

    const currentReviewState = answersMap[currentQ.id]?.isMarkedForReview || false;
    const updated = {
      ...answersMap[currentQ.id],
      selectedOptionId: answersMap[currentQ.id]?.selectedOptionId,
      isMarkedForReview: !currentReviewState,
      timeSpentSeconds: answersMap[currentQ.id]?.timeSpentSeconds || 0,
    };

    setAnswersMap((prev) => ({
      ...prev,
      [currentQ.id]: updated,
    }));

    try {
      await api.exams.syncAnswer(attempt.id, {
        questionId: currentQ.id,
        selectedOptionId: updated.selectedOptionId || null,
        isMarkedForReview: updated.isMarkedForReview,
        timeSpentSeconds: updated.timeSpentSeconds,
      });
    } catch (err) {
      console.warn('Review toggle sync warning:', err);
    }
  };

  // Final Exam Submission
  const handleFinalSubmit = async (autoTimedOut = false) => {
    if (!attempt || isSubmitting) return;
    setIsSubmitting(true);
    setShowSubmitModal(false);

    try {
      await api.exams.submit(attempt.id);
      navigate(`/exams/attempts/${attempt.id}/review`);
    } catch (err: any) {
      alert(err.message || 'Error finalizing exam.');
      navigate(`/exams/attempts/${attempt.id}/review`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- SCREEN 1: PRE-EXAM INSTRUCTIONS SCREEN ---
  if (!hasStarted && exam) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl animate-slide-up">
          <Card className="p-6 sm:p-8 space-y-6 border-slate-200 dark:border-slate-800 shadow-soft-xl">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 border border-brand-200 dark:border-brand-800">
                  {exam.category.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-400">• Placement Screening Mode</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white">
                {exam.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {exam.description}
              </p>
            </div>

            {/* Exam Parameters Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Duration</span>
                <strong className="text-slate-900 dark:text-white font-mono">{exam.durationMinutes} Minutes</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Questions</span>
                <strong className="text-slate-900 dark:text-white font-mono">{exam._count?.questions || 15} MCQs</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Total Marks</span>
                <strong className="text-slate-900 dark:text-white font-mono">{exam.totalMarks}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Negative Marking</span>
                <strong className="text-rose-500 font-mono">-{exam.negativeMarkingRatio} / Wrong</strong>
              </div>
            </div>

            {/* Exam Instructions List */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Important Test Instructions:
              </h4>
              <ul className="space-y-2 list-disc list-inside text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                <li>This is an automated timed exam. The countdown begins as soon as you click <strong>"I am Ready — Begin Exam"</strong>.</li>
                <li>Each correct answer awards <strong>+1.0 marks</strong>. Incorrect answers penalize <strong>-{exam.negativeMarkingRatio} marks</strong>.</li>
                <li>You can use the <strong>Question Palette</strong> to jump directly between questions or mark tricky questions for review.</li>
                <li>Your selected choices are <strong>automatically saved in real-time</strong>. If your browser disconnects, you can resume within your remaining time.</li>
                <li>Once submitted or when the timer reaches <strong>00:00</strong>, the test auto-submits and locks your score.</li>
              </ul>
            </div>

            {/* Action Button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowReferenceModal(true)}
                  className="text-xs font-semibold"
                  leftIcon={<Award className="w-3.5 h-3.5 text-brand-600" />}
                >
                  Reference Materials (PDFs)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/exams')}
                  className="text-xs"
                >
                  Back to Catalog
                </Button>
              </div>

              <Button
                size="lg"
                onClick={handleStartExam}
                className="bg-brand-600 hover:bg-brand-700 font-bold text-xs shadow-soft-md"
              >
                I am Ready — Begin Exam
              </Button>
            </div>
          </Card>
        </div>

        <PdfReferenceModal
          isOpen={showReferenceModal}
          onClose={() => setShowReferenceModal(false)}
        />
      </div>
    );
  }

  // --- SCREEN 2: LIVE TIMED DISTRACTION-FREE EXAM ENGINE ---
  const currentQ = questions[currentIdx];
  const currentAnswerState = currentQ ? answersMap[currentQ.id] : undefined;

  // Compute live palette counts
  const answeredQuestionsCount = Object.values(answersMap).filter(
    (a) => a.selectedOptionId
  ).length;
  const markedForReviewCount = Object.values(answersMap).filter(
    (a) => a.isMarkedForReview
  ).length;

  return (
    <DistractionFreeExamLayout
      examTitle={exam?.title || 'Aptitude Test'}
      category={exam?.category || 'Aptitude'}
      remainingSeconds={remainingSeconds}
      totalQuestions={questions.length}
      currentQuestionIndex={currentIdx}
      answeredCount={answeredQuestionsCount}
      markedForReviewCount={markedForReviewCount}
      onReferenceClick={() => setShowReferenceModal(true)}
      onSubmitClick={() => setShowSubmitModal(true)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Live Question & Options Workspace (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 sm:p-8 space-y-6">
            {/* Question Header Strip */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">
                  Question {currentIdx + 1} of {questions.length}
                </span>
                {currentQ?.topicTag && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {currentQ.topicTag}
                  </span>
                )}
              </div>

              {/* Mark for Review Toggle Button */}
              <button
                onClick={handleToggleReview}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentAnswerState?.isMarkedForReview
                    ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    currentAnswerState?.isMarkedForReview ? 'fill-amber-500 text-amber-500' : ''
                  }`}
                />
                <span>
                  {currentAnswerState?.isMarkedForReview ? 'Marked for Review' : 'Mark for Review'}
                </span>
              </button>
            </div>

            {/* Question Prompt */}
            <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-white leading-relaxed">
              {currentQ?.prompt}
            </div>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ?.options.map((opt) => {
                const isSelected = currentAnswerState?.selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 select-none active:scale-[0.99] ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 text-brand-900 dark:text-brand-100 ring-2 ring-brand-500/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    {/* Option Label Circle (A, B, C, D) */}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {opt.label}
                    </div>
                    <span className="leading-snug pt-0.5">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Question Footer Bar (Navigation & Clear Choice) */}
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                {currentAnswerState?.selectedOptionId && (
                  <button
                    onClick={handleClearChoice}
                    className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1"
                  >
                    Clear Choice
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
                  disabled={currentIdx === 0}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Previous
                </Button>

                {currentIdx < questions.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCurrentIdx((prev) => Math.min(questions.length - 1, prev + 1))}
                    className="gap-1.5"
                  >
                    Next Question <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setShowSubmitModal(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-xs font-bold"
                  >
                    Review & Submit
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Question Navigator Palette (1 col) */}
        <div className="space-y-4">
          <Card className="p-4 sm:p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Question Navigator Palette
            </h4>

            {/* Status Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 dark:text-slate-400 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-emerald-500"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded bg-amber-500"></div>
                <span>For Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"></div>
                <span>Unanswered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded ring-2 ring-brand-500 bg-white dark:bg-slate-900"></div>
                <span>Current</span>
              </div>
            </div>

            {/* Question Numbers Grid (1 to 15/20) */}
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => {
                const ans = answersMap[q.id];
                const isCurrent = idx === currentIdx;
                const isAnswered = !!ans?.selectedOptionId;
                const isMarked = !!ans?.isMarkedForReview;

                let stateClasses = 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300';
                if (isAnswered && isMarked) {
                  stateClasses = 'bg-purple-600 text-white font-bold';
                } else if (isAnswered) {
                  stateClasses = 'bg-emerald-500 text-white font-bold';
                } else if (isMarked) {
                  stateClasses = 'bg-amber-500 text-white font-bold';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center transition-all select-none hover:scale-105 active:scale-95 ${stateClasses} ${
                      isCurrent ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900 font-black' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Quick Submit Trigger */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowSubmitModal(true)}
                className="w-full text-xs font-bold bg-emerald-600 hover:bg-emerald-700"
              >
                Submit Exam
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal before Submit */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Ready to submit your exam?"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Please verify your progress summary before final submission. Once submitted, your score will be computed instantly with negative marking.
          </p>

          <div className="grid grid-cols-3 gap-2 text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 font-semibold">
            <div>
              <span className="block text-slate-400 text-[10px]">Answered</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm">
                {answeredQuestionsCount}
              </strong>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px]">Marked Review</span>
              <strong className="text-amber-600 dark:text-amber-400 text-sm">
                {markedForReviewCount}
              </strong>
            </div>
            <div>
              <span className="block text-slate-400 text-[10px]">Unanswered</span>
              <strong className="text-rose-500 text-sm">
                {questions.length - answeredQuestionsCount}
              </strong>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSubmitModal(false)}
              disabled={isSubmitting}
            >
              Resume Answering
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={isSubmitting}
              onClick={() => handleFinalSubmit(false)}
              className="bg-emerald-600 hover:bg-emerald-700 font-bold"
            >
              Confirm & Submit
            </Button>
          </div>
        </div>
      </Modal>

      {/* Sahyadri Aptitude Reference Material PDF Viewer Modal */}
      <PdfReferenceModal
        isOpen={showReferenceModal}
        onClose={() => setShowReferenceModal(false)}
      />
    </DistractionFreeExamLayout>
  );
};
