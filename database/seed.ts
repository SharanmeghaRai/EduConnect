import { PrismaClient } from '@prisma/client';
import { allSeedExams } from './seed-data/index.js';
import { seedJobs } from './seed-data/jobs.js';
import { seedMaterials } from './seed-data/materials.js';
import { seedNewsletters } from './seed-data/newsletters.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting EduConnect comprehensive database seeding...');

  // 1. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@educonnect.ac.in' },
    update: {
      role: 'ADMIN',
      name: 'Dr. Ramesh Sharma (Placement Dean)',
    },
    create: {
      email: 'admin@educonnect.ac.in',
      name: 'Dr. Ramesh Sharma (Placement Dean)',
      role: 'ADMIN',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
      isActive: true,
    },
  });
  console.log(`✅ Admin user seeded: ${adminUser.email} (Role: ${adminUser.role})`);

  // 2. Seed Student User & Profile
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@educonnect.ac.in' },
    update: {
      role: 'STUDENT',
      name: 'Aarav Patel',
    },
    create: {
      email: 'student@educonnect.ac.in',
      name: 'Aarav Patel',
      role: 'STUDENT',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isActive: true,
      studentProfile: {
        create: {
          rollNumber: '1MS22CS104',
          department: 'Computer Science & Engineering',
          graduationYear: 2026,
          targetRoles: 'Software Development Engineer, Frontend Architect, Cloud Systems Engineer',
          cgpa: 8.84,
          prepStreakDays: 7,
          lastActiveDate: new Date(),
        },
      },
      newsletterSubscriptions: {
        create: {
          email: 'student@educonnect.ac.in',
          isSubscribed: true,
        },
      },
    },
    include: { studentProfile: true },
  });
  console.log(`✅ Student user seeded: ${studentUser.email} (Roll: 1MS22CS104)`);

  // 3. Seed 20 Full-Length Exams with MCQs
  console.log(`📚 Seeding ${allSeedExams.length} aptitude and technical exams...`);
  let totalQuestionsCount = 0;

  for (const rawExam of allSeedExams) {
    const exam = await prisma.exam.upsert({
      where: { slug: rawExam.slug },
      update: {
        title: rawExam.title,
        description: rawExam.description,
        category: rawExam.category,
        difficulty: rawExam.difficulty,
        durationMinutes: rawExam.durationMinutes,
        totalMarks: rawExam.totalMarks,
        passingMarks: rawExam.passingMarks,
        negativeMarkingRatio: rawExam.negativeMarkingRatio,
        maxAttempts: rawExam.maxAttempts,
        isPublished: true,
      },
      create: {
        title: rawExam.title,
        slug: rawExam.slug,
        description: rawExam.description,
        category: rawExam.category,
        difficulty: rawExam.difficulty,
        durationMinutes: rawExam.durationMinutes,
        totalMarks: rawExam.totalMarks,
        passingMarks: rawExam.passingMarks,
        negativeMarkingRatio: rawExam.negativeMarkingRatio,
        maxAttempts: rawExam.maxAttempts,
        isPublished: true,
      },
    });

    // Clear existing questions for clean seed re-run
    await prisma.question.deleteMany({ where: { examId: exam.id } });

    // Insert Questions and Options
    let qIndex = 1;
    for (const q of rawExam.questions) {
      await prisma.question.create({
        data: {
          examId: exam.id,
          prompt: q.prompt,
          topicTag: q.topicTag,
          explanation: q.explanation,
          marks: 1.0,
          orderIndex: qIndex++,
          options: {
            create: q.options.map((opt) => ({
              label: opt.label,
              text: opt.text,
              isCorrect: opt.isCorrect,
            })),
          },
        },
      });
      totalQuestionsCount++;
    }
  }
  console.log(`✅ Successfully seeded ${allSeedExams.length} Exams containing ${totalQuestionsCount} total MCQs with explanations!`);

  // 4. Seed Verified Jobs
  console.log('💼 Seeding verified campus job opportunities...');
  for (const job of seedJobs) {
    await prisma.jobListing.create({
      data: {
        ...job,
        verifiedByUserId: adminUser.id,
        verifiedAt: new Date(),
      },
    });
  }
  console.log(`✅ Seeded ${seedJobs.length} verified jobs and internships.`);

  // 5. Seed Study Materials
  console.log('📖 Seeding study repository materials...');
  for (const mat of seedMaterials) {
    const createdMat = await prisma.studyMaterial.create({
      data: mat,
    });
    // Mark first 3 as completed for student to populate progress radar
    if (mat.orderIndex <= 3) {
      await prisma.materialProgress.create({
        data: {
          userId: studentUser.id,
          materialId: createdMat.id,
          isCompleted: true,
          completedAt: new Date(),
        },
      });
    }
  }
  console.log(`✅ Seeded ${seedMaterials.length} study resources with progress.`);

  // 6. Seed Newsletters
  console.log('📰 Seeding placement newsletters...');
  for (const nl of seedNewsletters) {
    await prisma.newsletter.upsert({
      where: { editionNumber: nl.editionNumber },
      update: nl,
      create: nl,
    });
  }
  console.log(`✅ Seeded ${seedNewsletters.length} newsletter issues.`);

  // 7. Seed Sample Attempt for Student (Quant Percentages) to render realistic dashboard analytics
  const firstExam = await prisma.exam.findFirst({
    where: { slug: 'quant-percentages-profit-loss' },
    include: { questions: { include: { options: true } } },
  });

  if (firstExam && firstExam.questions.length > 0) {
    const attempt = await prisma.attempt.create({
      data: {
        examId: firstExam.id,
        userId: studentUser.id,
        attemptNumber: 1,
        startedAt: new Date(Date.now() - 45 * 60 * 1000),
        submittedAt: new Date(Date.now() - 25 * 60 * 1000),
        timeSpentSeconds: 1200,
        score: 13.75,
        maxScore: 15.0,
        accuracyPercentage: 91.67,
        peerPercentile: 94.5,
        status: 'COMPLETED',
      },
    });

    // Insert answers for first attempt
    for (const q of firstExam.questions) {
      const correctOpt = q.options.find((o) => o.isCorrect) || q.options[0];
      await prisma.attemptAnswer.create({
        data: {
          attemptId: attempt.id,
          questionId: q.id,
          selectedOptionId: correctOpt.id,
          isCorrect: true,
          marksAwarded: 1.0,
          timeSpentSeconds: 75,
        },
      });
    }
    console.log(`✅ Seeded sample completed attempt (Score: 13.75/15, 94.5th percentile) for initial charts.`);
  }

  console.log('🎉 Database seeding completed successfully! Ready for Tier 2 API execution.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
