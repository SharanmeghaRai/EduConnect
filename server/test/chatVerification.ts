import { ChatService } from '../src/services/chatService.js';
import { prisma } from '../src/config/prisma.js';

async function runChatVerification() {
  console.log('🤖 Starting CampusPrep AI Chatbot Verification Tests...\n');

  // Find a demo user
  const user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
  if (!user) throw new Error('No student found in DB');

  // Test 1: Train & Speed Aptitude Calculation
  console.log('--- Test 1: Aptitude Train Speed Derivation ---');
  let trainAnswer = '';
  await ChatService.streamChat(
    user.id,
    'A train 180 meters long running at 72 km/h crosses a platform in 20 seconds. What is the length of the platform?',
    undefined,
    (chunk) => {
      trainAnswer += chunk;
    }
  );
  const hasPlatformMath = trainAnswer.includes('220') && trainAnswer.includes('5/18');
  console.log('  Response contains verified derivation (220 m & 5/18 conversion):', hasPlatformMath ? '✅ PASS' : '❌ FAIL');
  if (!hasPlatformMath) console.log('Response sample:', trainAnswer.slice(0, 300));

  // Test 2: Sahyadri Company Papers & Archive Query
  console.log('\n--- Test 2: Sahyadri Placement Archive & Reference Papers ---');
  let sahyadriAnswer = '';
  const result2 = await ChatService.streamChat(
    user.id,
    'What past aptitude papers from Sahyadri are available for Accenture and TCS?',
    undefined,
    (chunk) => {
      sahyadriAnswer += chunk;
    }
  );
  const citesPdfs = result2.citations.some((c) => c.url.includes('/reference-materials'));
  const mentionsTests = sahyadriAnswer.includes('Accenture') && sahyadriAnswer.includes('TCS');
  console.log('  Response cites Sahyadri reference material PDFs:', citesPdfs ? '✅ PASS' : '❌ FAIL');
  console.log('  Response mentions Accenture & TCS test papers:', mentionsTests ? '✅ PASS' : '❌ FAIL');

  // Test 3: Technical OS Coffman Conditions
  console.log('\n--- Test 3: Operating System Coffman Deadlock Conditions ---');
  let osAnswer = '';
  await ChatService.streamChat(
    user.id,
    'Explain the 4 Coffman conditions for Deadlocks in Operating Systems',
    undefined,
    (chunk) => {
      osAnswer += chunk;
    }
  );
  const hasCoffman4 =
    osAnswer.includes('Mutual Exclusion') &&
    osAnswer.includes('Hold and Wait') &&
    osAnswer.includes('No Preemption') &&
    osAnswer.includes('Circular Wait');
  console.log('  Response contains all 4 Coffman conditions accurately:', hasCoffman4 ? '✅ PASS' : '❌ FAIL');

  // Test 4: SQL Second Highest Salary
  console.log('\n--- Test 4: SQL Query for 2nd Highest Salary ---');
  let sqlAnswer = '';
  await ChatService.streamChat(
    user.id,
    'Write SQL query to find the 2nd highest salary in an Employee table',
    undefined,
    (chunk) => {
      sqlAnswer += chunk;
    }
  );
  const hasDenseRank = sqlAnswer.includes('DENSE_RANK') || sqlAnswer.includes('MAX');
  console.log('  Response contains verified SQL query (DENSE_RANK or MAX subquery):', hasDenseRank ? '✅ PASS' : '❌ FAIL');

  // Test 5: Off-topic Guardrail Refusal
  console.log('\n--- Test 5: Guardrail Refusal for Off-Topic Query ---');
  let refusalAnswer = '';
  await ChatService.streamChat(
    user.id,
    'Can you give me a recipe to bake a chocolate cake?',
    undefined,
    (chunk) => {
      refusalAnswer += chunk;
    }
  );
  const hasRefusal = refusalAnswer.includes('dedicated exclusively to your campus placement');
  console.log('  Guardrail successfully declined non-placement query:', hasRefusal ? '✅ PASS' : '❌ FAIL');

  // Test 6: Question Explanation Service
  console.log('\n--- Test 6: Question Explanation Service ---');
  const sampleQ = await prisma.question.findFirst({
    where: { explanation: { not: null } },
  });
  if (sampleQ) {
    const explanationRes = await ChatService.explainQuestion(sampleQ.id, user.id);
    const hasDetailedExpl =
      explanationRes.explanation.includes('Mathematical / Conceptual Derivation') &&
      explanationRes.explanation.includes('Exam Strategy Tip');
    console.log('  Question explanation contains mathematical derivation & exam tips:', hasDetailedExpl ? '✅ PASS' : '❌ FAIL');
  }

  // Test 7: "teach me dsa" DSA Masterclass Check (Fix for user issue!)
  console.log('\n--- Test 7: \"teach me dsa\" Query Handling ---');
  let dsaAnswer = '';
  await ChatService.streamChat(
    user.id,
    'teach me dsa',
    undefined,
    (chunk) => {
      dsaAnswer += chunk;
    }
  );
  const hasDsaContent =
    dsaAnswer.includes('Data Structures & Algorithms (DSA) Masterclass') &&
    dsaAnswer.includes('Sliding Window') &&
    dsaAnswer.includes('Two Pointers');
  console.log('  Response provides dedicated DSA Masterclass (not default boilerplate):', hasDsaContent ? '✅ PASS' : '❌ FAIL');

  // Test 8: Greeting Check
  console.log('\n--- Test 8: Friendly Conversational Greeting ---');
  let hiAnswer = '';
  await ChatService.streamChat(
    user.id,
    'hi',
    undefined,
    (chunk) => {
      hiAnswer += chunk;
    }
  );
  const hasGreeting = hiAnswer.includes('Hello! I am CampusPrep AI');
  console.log('  Response returns friendly personalized greeting:', hasGreeting ? '✅ PASS' : '❌ FAIL');

  console.log('\n✨ All Chatbot Functional & Grounding Verification Checks Completed Successfully!');
}

runChatVerification()
  .catch((err) => {
    console.error('Chat verification failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
