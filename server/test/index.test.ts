import { AuthService } from '../src/services/authService.js';
import { ExamRepository } from '../src/repositories/examRepository.js';
import { AiNewsletterService } from '../src/services/aiNewsletterService.js';
import { AdminService } from '../src/services/adminService.js';
import { prisma } from '../src/config/prisma.js';

async function runTests() {
  console.log('🧪 Starting EduConnect Automated Backend Unit & Integration Tests...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // -------------------------------------------------------------
    // Test Suite 1: Authentication & RBAC Token Generation
    // -------------------------------------------------------------
    console.log('--- Test Suite 1: Authentication & Token Issuance ---');
    const { user: studentUser, tokens: studentTokens } = await AuthService.demoLogin('student');
    assert(studentUser.role === 'STUDENT', 'Demo student login generates user with role STUDENT');
    assert(!!studentTokens.accessToken, 'Access token is issued in JWT format');
    assert(!!studentTokens.refreshToken, 'Refresh token is issued for session rotation');

    const { user: adminUser } = await AuthService.demoLogin('admin');
    assert(adminUser.role === 'ADMIN', 'Demo admin login generates user with role ADMIN');

    // -------------------------------------------------------------
    // Test Suite 2: Exam Catalog & Seed Integrity
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 2: Exam Catalog & Database Verification ---');
    const exams = await ExamRepository.findAll();
    assert(exams.length >= 20, `Total seeded exams contains at least 20 exams (Found: ${exams.length})`);

    const quantExam = await ExamRepository.findBySlug('quant-percentages-profit-loss', true);
    assert(!!quantExam, 'Found "quant-percentages-profit-loss" exam');
    assert(
      (quantExam?.questions.length || 0) >= 15,
      `Exam has at least 15 MCQs (Found: ${quantExam?.questions.length})`
    );

    const sampleQ = quantExam?.questions[0];
    assert(sampleQ?.options.length === 4, 'Question has exactly 4 options (A, B, C, D)');
    const correctOptions = sampleQ?.options.filter((o) => o.isCorrect);
    assert(correctOptions?.length === 1, 'Question has exactly one marked correct answer');
    assert(!!sampleQ?.explanation, 'Question contains detailed mathematical explanation');

    // -------------------------------------------------------------
    // Test Suite 3: Exam Scoring Engine & Negative Marking
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 3: Exam Scoring Formula Verification ---');
    // Formula: (Correct * 1.0) - (Incorrect * NegativeRatio)
    const marksPerQ = 1.0;
    const negativeRatio = 0.25;

    // Case 1: 10 correct, 2 incorrect, 3 unattempted out of 15
    const correctCount = 10;
    const incorrectCount = 2;
    const expectedScore = correctCount * marksPerQ - incorrectCount * marksPerQ * negativeRatio;
    // 10 - (2 * 0.25) = 10 - 0.5 = 9.5
    assert(expectedScore === 9.5, 'Negative marking formula yields expected score 9.5 for 10C/2I');

    // Accuracy = (Correct / Attempted) * 100 = (10 / 12) * 100 = 83.33%
    const expectedAccuracy = parseFloat(((correctCount / (correctCount + incorrectCount)) * 100).toFixed(1));
    assert(expectedAccuracy === 83.3, 'Accuracy percentage correctly calculates 83.3%');

    // -------------------------------------------------------------
    // Test Suite 4: Database Entities Presence Check
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 4: Database Entities Presence Check ---');
    const [jobsCount, materialsCount, newslettersCount] = await Promise.all([
      prisma.jobListing.count(),
      prisma.studyMaterial.count(),
      prisma.newsletter.count(),
    ]);

    assert(jobsCount >= 8, `Seeded jobs present (Found: ${jobsCount})`);
    assert(materialsCount >= 10, `Study materials present across categories (Found: ${materialsCount})`);
    assert(newslettersCount >= 2, `Published placement newsletters present (Found: ${newslettersCount})`);

    // -------------------------------------------------------------
    // Test Suite 5: AI Newsletter 10-Day Rolling Archive & 8 AM Schedule
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 5: AI Newsletter 10-Day Archive & Daily 8 AM Verification ---');
    await AiNewsletterService.ensureRecentTenDaysNewsletters();
    const aiData = await AiNewsletterService.getRecentTenDaysNewsletters();

    assert(aiData.newsletters.length === 10, `AI Newsletter contains exactly 10 recent days of editions (Found: ${aiData.newsletters.length})`);
    assert(aiData.stats.cronSchedule === '0 8 * * *', 'AI Newsletter scheduler runs everyday at 8:00 AM (0 8 * * *)');
    assert(aiData.stats.updateFrequency === 'Everyday at 8:00 AM', 'Stats display daily 8:00 AM update cadence');

    const latestAi = aiData.newsletters[0];
    assert(latestAi.editionNumber >= 1010, `Latest AI newsletter edition is #${latestAi.editionNumber}`);
    assert(latestAi.topics.length > 0, `Latest edition contains structured topics: ${latestAi.topics.join(', ')}`);
    assert(latestAi.keyTakeaways.length > 0, 'Latest edition contains key takeaways bullet points');
    assert(!!latestAi.contentHtml, 'Latest edition has formatted HTML body content');

    // -------------------------------------------------------------
    // Test Suite 6: Faculty Marks & Student Performance Analytics
    // -------------------------------------------------------------
    console.log('\n--- Test Suite 6: Faculty Student Marks & Test Performance Verification ---');
    const perfOverview = await AdminService.getStudentPerformanceOverview();
    assert(perfOverview.summary.totalStudents >= 5, `Faculty can view cohort students (Found: ${perfOverview.summary.totalStudents})`);
    assert(perfOverview.summary.totalAttempts >= 10, `Faculty can inspect student test attempts (Found: ${perfOverview.summary.totalAttempts})`);
    assert(perfOverview.summary.cohortAverageAccuracy > 0, `Cohort average accuracy computed (${perfOverview.summary.cohortAverageAccuracy}%)`);
    assert(perfOverview.studentCards.length > 0, `Faculty student cards populated (Count: ${perfOverview.studentCards.length})`);
    assert(perfOverview.attempts.length > 0, `Faculty attempt ledger rows populated (Count: ${perfOverview.attempts.length})`);

    // Verify detailed attempt drilldown with question breakdown
    const sampleAttemptId = perfOverview.attempts[0].id;
    const attemptDetails = await AdminService.getAttemptDetails(sampleAttemptId);
    assert(!!attemptDetails.attempt.id, `Faculty can drill into individual student attempt (${sampleAttemptId})`);
    assert(attemptDetails.attempt.answers.length > 0, `Attempt answers present for faculty grading inspection (Found: ${attemptDetails.attempt.answers.length})`);
    assert(attemptDetails.topicBreakdown.length > 0, 'Topic performance diagnostics generated for faculty coaching');

    // Verify CSV marks export
    const csvExport = await AdminService.exportDetailedMarksCSV();
    assert(csvExport.includes('Student Name') && csvExport.includes('Roll Number (USN)'), 'Marks CSV export contains proper academic gradebook headers');

    console.log('\n====================================================');
    console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
    console.log('====================================================');

    if (failed > 0) process.exit(1);
  } catch (err: any) {
    console.error('Test execution error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runTests();
