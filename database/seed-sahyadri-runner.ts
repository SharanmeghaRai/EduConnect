import { PrismaClient } from '@prisma/client';
import { sahyadriAndJapaneseExams } from './seed-data/sahyadri-japanese.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Seeding 3 Sahyadri Aptitude Tests + 2 Basic Japanese Tests...');

  for (const rawExam of sahyadriAndJapaneseExams) {
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

    // Clear existing questions for clean seed
    await prisma.question.deleteMany({ where: { examId: exam.id } });

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
    }
    console.log(`✅ Exam ready: ${exam.title} (${rawExam.questions.length} Questions)`);
  }

  const allExamsCount = await prisma.exam.count();
  const allQuestionsCount = await prisma.question.count();
  console.log(`🎉 Total Exams in DB: ${allExamsCount}, Total Questions: ${allQuestionsCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
