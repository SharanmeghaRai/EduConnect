import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const sampleStudents = [
  {
    name: 'Aarav Patel',
    email: 'student@educonnect.ac.in',
    rollNumber: '4SF22CS001',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.84,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'Software Development Engineer, Full Stack Developer',
  },
  {
    name: 'Ananya Rao',
    email: 'ananya.rao@sahyadri.edu.in',
    rollNumber: '4SF22IS014',
    department: 'Information Science & Engineering',
    graduationYear: 2026,
    cgpa: 9.25,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'Cloud Architect, Backend Engineer',
  },
  {
    name: 'Rohan Shetty',
    email: 'rohan.shetty@sahyadri.edu.in',
    rollNumber: '4SF22EC039',
    department: 'Electronics & Communication Engineering',
    graduationYear: 2026,
    cgpa: 8.42,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'Embedded Systems Engineer, IoT Developer',
  },
  {
    name: 'Pooja Hegde',
    email: 'pooja.hegde@sahyadri.edu.in',
    rollNumber: '4SF22CS088',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.95,
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'AI/ML Engineer, Data Scientist',
  },
  {
    name: 'Vikram Naik',
    email: 'vikram.naik@sahyadri.edu.in',
    rollNumber: '4SF22ME022',
    department: 'Mechanical Engineering',
    graduationYear: 2026,
    cgpa: 7.85,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'Robotics Engineer, CAD Specialist',
  },
  {
    name: 'Sneha Bhat',
    email: 'sneha.bhat@sahyadri.edu.in',
    rollNumber: '4SF22IS045',
    department: 'Information Science & Engineering',
    graduationYear: 2026,
    cgpa: 8.68,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'Cybersecurity Analyst, DevOps Engineer',
  },
  {
    name: 'Kiran Kumar',
    email: 'kiran.kumar@sahyadri.edu.in',
    rollNumber: '4SF22EC018',
    department: 'Electronics & Communication Engineering',
    graduationYear: 2026,
    cgpa: 8.15,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'VLSI Engineer, Firmware Developer',
  },
  {
    name: 'Deepika Shenoy',
    email: 'deepika.shenoy@sahyadri.edu.in',
    rollNumber: '4SF22CS112',
    department: 'Computer Science & Engineering',
    graduationYear: 2026,
    cgpa: 9.40,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    targetRoles: 'Full Stack Engineer, Japanese Tech Specialist',
  },
];

async function seedCohortPerformance() {
  console.log('🌟 Seeding Sahyadri Student Cohort & Test Performance Data...');

  // Find target exams
  const targetExamSlugs = [
    'sahyadri-aptitude-test-1',
    'sahyadri-aptitude-test-2',
    'sahyadri-aptitude-test-3',
    'basic-japanese-test-1',
    'basic-japanese-test-2',
    'tech-data-structures-algorithms',
    'quant-percentages-profit-loss',
  ];

  const exams = await prisma.exam.findMany({
    where: { slug: { in: targetExamSlugs } },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (exams.length === 0) {
    console.error('Target exams not found in database.');
    return;
  }

  console.log(`Found ${exams.length} target exams for test simulation.`);

  // Upsert each student
  for (let i = 0; i < sampleStudents.length; i++) {
    const s = sampleStudents[i];
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: {
        name: s.name,
        avatarUrl: s.avatarUrl,
        studentProfile: {
          upsert: {
            create: {
              rollNumber: s.rollNumber,
              department: s.department,
              graduationYear: s.graduationYear,
              cgpa: s.cgpa,
              targetRoles: s.targetRoles,
              prepStreakDays: (i * 3) + 4,
              lastActiveDate: new Date(),
            },
            update: {
              rollNumber: s.rollNumber,
              department: s.department,
              graduationYear: s.graduationYear,
              cgpa: s.cgpa,
              targetRoles: s.targetRoles,
            },
          },
        },
      },
      create: {
        email: s.email,
        name: s.name,
        role: 'STUDENT',
        avatarUrl: s.avatarUrl,
        isActive: true,
        studentProfile: {
          create: {
            rollNumber: s.rollNumber,
            department: s.department,
            graduationYear: s.graduationYear,
            cgpa: s.cgpa,
            targetRoles: s.targetRoles,
            prepStreakDays: (i * 3) + 4,
            lastActiveDate: new Date(),
          },
        },
      },
    });

    console.log(`👤 Student ready: ${user.name} (${s.rollNumber})`);

    // Give each student attempts across several exams
    // We vary their proficiency so faculty can see high scorers, moderate, and needs improvement
    const studentProficiency = 0.65 + (i % 4) * 0.1; // 0.65 to 0.95

    // Choose 3-5 exams for each student
    const assignedExams = exams.slice(0, 3 + (i % 3));

    for (const exam of assignedExams) {
      // Check if attempt already exists for this student and exam
      const existingAttempt = await prisma.attempt.findFirst({
        where: { userId: user.id, examId: exam.id },
      });

      if (existingAttempt) {
        continue;
      }

      const totalQ = exam.questions.length;
      if (totalQ === 0) continue;

      let correctCount = 0;
      let wrongCount = 0;
      let score = 0;
      const questionAnswersData: any[] = [];

      // Calculate how many they get right based on proficiency with slight jitter
      const passRate = Math.min(0.95, Math.max(0.4, studentProficiency + ((i * 7) % 5 - 2) * 0.05));

      for (let qIdx = 0; qIdx < totalQ; qIdx++) {
        const q = exam.questions[qIdx];
        const isRight = Math.random() < passRate || (qIdx % 3 !== 0 && passRate > 0.7);
        const correctOpt = q.options.find((o) => o.isCorrect) || q.options[0];
        const wrongOpts = q.options.filter((o) => !o.isCorrect);
        const selectedOpt = isRight
          ? correctOpt
          : (wrongOpts.length > 0 ? wrongOpts[qIdx % wrongOpts.length] : correctOpt);

        if (isRight) {
          correctCount++;
          score += q.marks;
        } else {
          wrongCount++;
          score = Math.max(0, score - (q.marks * exam.negativeMarkingRatio));
        }

        questionAnswersData.push({
          questionId: q.id,
          selectedOptionId: selectedOpt?.id || null,
          isCorrect: isRight,
          marksAwarded: isRight ? q.marks : -(q.marks * exam.negativeMarkingRatio),
          timeSpentSeconds: 45 + (qIdx * 13) % 60,
        });
      }

      const maxScore = exam.totalMarks || (totalQ * 1.0);
      const roundedScore = parseFloat(score.toFixed(2));
      const accuracy = parseFloat(((correctCount / totalQ) * 100).toFixed(1));
      const percentile = parseFloat(Math.min(99.5, Math.max(52.0, (accuracy * 0.98) + (i * 1.5))).toFixed(1));
      const timeSpent = Math.min(exam.durationMinutes * 60, totalQ * 75 + ((i * 50) % 300));
      const hoursAgo = (i * 6) + ((qIdx => qIdx % 12)(i));
      const submittedAt = new Date(Date.now() - hoursAgo * 3600 * 1000);
      const startedAt = new Date(submittedAt.getTime() - timeSpent * 1000);

      const attempt = await prisma.attempt.create({
        data: {
          examId: exam.id,
          userId: user.id,
          attemptNumber: 1,
          startedAt,
          submittedAt,
          timeSpentSeconds: timeSpent,
          score: roundedScore,
          maxScore,
          accuracyPercentage: accuracy,
          peerPercentile: percentile,
          status: 'COMPLETED',
        },
      });

      // Insert answers
      for (const ans of questionAnswersData) {
        await prisma.attemptAnswer.create({
          data: {
            attemptId: attempt.id,
            questionId: ans.questionId,
            selectedOptionId: ans.selectedOptionId,
            isCorrect: ans.isCorrect,
            marksAwarded: ans.marksAwarded,
            timeSpentSeconds: ans.timeSpentSeconds,
          },
        });
      }

      console.log(
        `  📝 Attempt recorded: ${user.name} -> ${exam.title.slice(0, 32)}... (Score: ${roundedScore}/${maxScore}, Acc: ${accuracy}%)`
      );
    }
  }

  console.log('✅ Cohort test performance seeded successfully!');
}

seedCohortPerformance()
  .catch((e) => {
    console.error('Error during cohort seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
