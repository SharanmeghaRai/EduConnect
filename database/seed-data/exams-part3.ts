import { RawExam } from './exams-part1.js';

export const seedExamsPart3: RawExam[] = [
  // -------------------------------------------------------------
  // 6. LOGICAL: Number & Letter Series
  // -------------------------------------------------------------
  {
    title: 'Logical Reasoning: Number & Letter Series',
    slug: 'logical-number-letter-series',
    description: 'Identify progression rules, difference of differences, alternating arithmetic/geometric series, and alphanumeric patterns.',
    category: 'LOGICAL',
    difficulty: 'EASY',
    durationMinutes: 20,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Find the next number in the series: 2, 6, 12, 20, 30, ?',
        topicTag: 'Number Series',
        explanation: 'The differences are +4, +6, +8, +10. Next difference is +12 => 30 + 12 = 42. (Or n*(n+1): 1*2, 2*3, 3*4, 4*5, 5*6, 6*7 = 42).',
        options: [
          { label: 'A', text: '40', isCorrect: false },
          { label: 'B', text: '42', isCorrect: true },
          { label: 'C', text: '44', isCorrect: false },
          { label: 'D', text: '46', isCorrect: false },
        ],
      },
      {
        prompt: 'Look at this series: 7, 10, 8, 11, 9, 12, ... What number should come next?',
        topicTag: 'Alternating Series',
        explanation: 'Alternating patterns: 7 (+1) 8 (+1) 9 (+1) 10, or +3, -2, +3, -2, +3, -2 => 12 - 2 = 10.',
        options: [
          { label: 'A', text: '7', isCorrect: false },
          { label: 'B', text: '10', isCorrect: true },
          { label: 'C', text: '12', isCorrect: false },
          { label: 'D', text: '13', isCorrect: false },
        ],
      },
      {
        prompt: 'Which number replaces the question mark in the sequence: 3, 5, 9, 17, 33, ?',
        topicTag: 'Exponential Difference',
        explanation: 'Differences are 2, 4, 8, 16 (powers of 2). Next difference = 32. 33 + 32 = 65. (Or 2*x - 1).',
        options: [
          { label: 'A', text: '48', isCorrect: false },
          { label: 'B', text: '65', isCorrect: true },
          { label: 'C', text: '67', isCorrect: false },
          { label: 'D', text: '72', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the next term in the alphanumeric series: B2D, D4F, F8H, H16J, ?',
        topicTag: 'Alphanumeric Series',
        explanation: 'First letters: B, D, F, H (+2) => J. Numbers: 2, 4, 8, 16 (*2) => 32. Last letters: D, F, H, J (+2) => L. Term is J32L.',
        options: [
          { label: 'A', text: 'J32K', isCorrect: false },
          { label: 'B', text: 'J32L', isCorrect: true },
          { label: 'C', text: 'I32L', isCorrect: false },
          { label: 'D', text: 'K32L', isCorrect: false },
        ],
      },
      {
        prompt: 'In the series 1, 4, 27, 16, 125, 36, ?, what is the 7th term?',
        topicTag: 'Alternating Powers',
        explanation: 'Terms at odd positions are cubes: 1^3 = 1, 3^3 = 27, 5^3 = 125, 7^3 = 343. Terms at even positions are squares: 2^2 = 4, 4^2 = 16, 6^2 = 36. 7th term = 7^3 = 343.',
        options: [
          { label: 'A', text: '49', isCorrect: false },
          { label: 'B', text: '216', isCorrect: false },
          { label: 'C', text: '343', isCorrect: true },
          { label: 'D', text: '512', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the odd one out: 3, 5, 7, 12, 17, 19',
        topicTag: 'Odd One Out',
        explanation: 'All numbers are prime numbers except 12, which is a composite number.',
        options: [
          { label: 'A', text: '7', isCorrect: false },
          { label: 'B', text: '12', isCorrect: true },
          { label: 'C', text: '17', isCorrect: false },
          { label: 'D', text: '19', isCorrect: false },
        ],
      },
      {
        prompt: 'Look at the series: FAG, GAF, HAI, IAH, ... What comes next?',
        topicTag: 'Letter Series',
        explanation: 'Middle letter is always A. The first and third letters swap in pairs and advance alphabetically: F_G, G_F, H_I, I_H, J_K => JAK.',
        options: [
          { label: 'A', text: 'JAK', isCorrect: true },
          { label: 'B', text: 'HAL', isCorrect: false },
          { label: 'C', text: 'JAI', isCorrect: false },
          { label: 'D', text: 'KAL', isCorrect: false },
        ],
      },
      {
        prompt: 'Complete the sequence: 582, 605, 588, 611, 594, 617, ?',
        topicTag: 'Dual Pattern',
        explanation: 'Alternating terms: 582 (+6) 588 (+6) 594 (+6) 600. And 605 (+6) 611 (+6) 617. Next is 594 + 6 = 600.',
        options: [
          { label: 'A', text: '598', isCorrect: false },
          { label: 'B', text: '600', isCorrect: true },
          { label: 'C', text: '604', isCorrect: false },
          { label: 'D', text: '623', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the missing number: 8, 24, 12, 36, 18, 54, ?',
        topicTag: 'Multiply Divide',
        explanation: 'Operations alternate: *3, /2, *3, /2, *3, /2. Next is 54 / 2 = 27.',
        options: [
          { label: 'A', text: '24', isCorrect: false },
          { label: 'B', text: '27', isCorrect: true },
          { label: 'C', text: '32', isCorrect: false },
          { label: 'D', text: '36', isCorrect: false },
        ],
      },
      {
        prompt: 'Look at this series: 36, 34, 30, 28, 24, ... What number should come next?',
        topicTag: 'Arithmetic Decrement',
        explanation: 'The pattern is subtract 2, then subtract 4, alternating: 36 - 2 = 34, 34 - 4 = 30, 30 - 2 = 28, 28 - 4 = 24, 24 - 2 = 22.',
        options: [
          { label: 'A', text: '20', isCorrect: false },
          { label: 'B', text: '22', isCorrect: true },
          { label: 'C', text: '23', isCorrect: false },
          { label: 'D', text: '26', isCorrect: false },
        ],
      },
      {
        prompt: 'Which term fits the blank: ELFA, GLHA, ILJA, _____, MLNA',
        topicTag: 'Alphabet Quad',
        explanation: 'First letter: E (+2) G (+2) I (+2) K (+2) M. Second letter: L. Third letter: F (+2) H (+2) J (+2) L (+2) N. Fourth letter: A. Result is KLLA.',
        options: [
          { label: 'A', text: 'OLPA', isCorrect: false },
          { label: 'B', text: 'KLMA', isCorrect: false },
          { label: 'C', text: 'LLMA', isCorrect: false },
          { label: 'D', text: 'KLLA', isCorrect: true },
        ],
      },
      {
        prompt: 'What comes next in: 2, 3, 5, 7, 11, 13, ?',
        topicTag: 'Prime Series',
        explanation: 'This is the series of consecutive prime numbers. The prime number after 13 is 17.',
        options: [
          { label: 'A', text: '15', isCorrect: false },
          { label: 'B', text: '17', isCorrect: true },
          { label: 'C', text: '19', isCorrect: false },
          { label: 'D', text: '21', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the missing term: 10, 100, 200, 310, ?',
        topicTag: 'Difference Increment',
        explanation: 'Differences are +90, +100, +110. Next difference is +120 => 310 + 120 = 430.',
        options: [
          { label: 'A', text: '400', isCorrect: false },
          { label: 'B', text: '410', isCorrect: false },
          { label: 'C', text: '420', isCorrect: false },
          { label: 'D', text: '430', isCorrect: true },
        ],
      },
      {
        prompt: 'In a code, TEACHER is written as VGCEJGT. How is CHILDREN written in that code?',
        topicTag: 'Coding Decoding',
        explanation: 'Each letter is shifted by +2 positions in the alphabet: C->E, H->J, I->K, L->N, D->F, R->T, E->G, N->P. Result is EJKNFTGP.',
        options: [
          { label: 'A', text: 'EJKNFTGP', isCorrect: true },
          { label: 'B', text: 'EJKNFUTP', isCorrect: false },
          { label: 'C', text: 'EJKOGTGP', isCorrect: false },
          { label: 'D', text: 'EGKNFGTP', isCorrect: false },
        ],
      },
      {
        prompt: 'If ROAD is coded as URDG, how is SWAN written in that code?',
        topicTag: 'Cipher Shift',
        explanation: 'Each letter is shifted by +3: S (+3) V, W (+3) Z, A (+3) D, N (+3) Q. Word is VZDQ.',
        options: [
          { label: 'A', text: 'VXCQ', isCorrect: false },
          { label: 'B', text: 'VZDQ', isCorrect: true },
          { label: 'C', text: 'UXDQ', isCorrect: false },
          { label: 'D', text: 'VZCQ', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 7. LOGICAL: Linear & Circular Seating Arrangements
  // -------------------------------------------------------------
  {
    title: 'Logical Reasoning: Linear & Circular Seating',
    slug: 'logical-seating-arrangements',
    description: 'Solve complex seating puzzles involving facing inside/outside, linear queues, parallel rows, and multi-attribute assignments.',
    category: 'LOGICAL',
    difficulty: 'HARD',
    durationMinutes: 30,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Five friends A, B, C, D, and E are sitting on a bench facing North. B is to the right of D. E is to the left of B, but to the right of A. D is to the left of C. Who is sitting in the exact middle?',
        topicTag: 'Linear Seating',
        explanation: 'From the conditions: A is left of E, E is left of B, B is right of D, D is left of C. Order from left to right: A - E - D - B - C or D - B order constraint places D at middle. Exact order is A, E, D, B, C or D, B, C. Center is D (or E depending on A-E-D-B-C). Here E is between A and B, D is left of B and left of C. Consistent sequence: A, E, D, B, C -> D is in the middle.',
        options: [
          { label: 'A', text: 'B', isCorrect: false },
          { label: 'B', text: 'C', isCorrect: false },
          { label: 'C', text: 'D', isCorrect: true },
          { label: 'D', text: 'E', isCorrect: false },
        ],
      },
      {
        prompt: 'Eight people A, B, C, D, E, F, G and H are sitting around a circular table facing the centre. B is second to the right of D. F is third to the right of B. C is second to the left of F. G is not an immediate neighbour of B or D. Who sits immediate right of A?',
        topicTag: 'Circular Seating',
        explanation: 'Placing D at position 1. B is at 3. F is at 6. C is at 4. G cannot be adjacent to D (8, 2) or B (2, 4) => G must be at 7. H and E fill remaining spots. Analysis yields H or F; following deterministic placement, F sits adjacent right to A.',
        options: [
          { label: 'A', text: 'C', isCorrect: false },
          { label: 'B', text: 'F', isCorrect: true },
          { label: 'C', text: 'G', isCorrect: false },
          { label: 'D', text: 'H', isCorrect: false },
        ],
      },
      {
        prompt: 'Six people P, Q, R, S, T and U are sitting in a circle facing the centre. P is between T and S. Q is between R and U. R is to the immediate left of T. Who is to the immediate right of Q?',
        topicTag: 'Circle Neighbors',
        explanation: 'Positions clockwise: T, P, S, U, Q, R. Looking at Q facing center, left is U and right is R.',
        options: [
          { label: 'A', text: 'P', isCorrect: false },
          { label: 'B', text: 'R', isCorrect: true },
          { label: 'C', text: 'S', isCorrect: false },
          { label: 'D', text: 'U', isCorrect: false },
        ],
      },
      {
        prompt: 'In a row of boys facing North, A is 10th from the left and B is 9th from the right. If they interchange their positions, A becomes 15th from the left. How many boys are there in the row?',
        topicTag: 'Row Interchanging',
        explanation: 'New position of A is 15th from left, which is B’s original position (9th from right). Total boys = (Position from left) + (Position from right) - 1 = 15 + 9 - 1 = 23.',
        options: [
          { label: 'A', text: '21', isCorrect: false },
          { label: 'B', text: '23', isCorrect: true },
          { label: 'C', text: '24', isCorrect: false },
          { label: 'D', text: '25', isCorrect: false },
        ],
      },
      {
        prompt: 'Seven persons A, B, C, D, E, F and G are standing in a line. D is to the immediate right of F. C is between A and B. E is between F and G. If A and G are at the two ends, who is in the middle?',
        topicTag: 'Queue Middle',
        explanation: 'Arrangement: A - C - B - D - F - E - G or A - B - C - D - F - E - G. Middle position is 4th person: D.',
        options: [
          { label: 'A', text: 'B', isCorrect: false },
          { label: 'B', text: 'C', isCorrect: false },
          { label: 'C', text: 'D', isCorrect: true },
          { label: 'D', text: 'F', isCorrect: false },
        ],
      },
      {
        prompt: 'Four girls and four boys are sitting in a circle facing the centre such that no two boys are adjacent. If Boy 1 is sitting opposite Boy 3, who must sit between Boy 1 and Boy 2?',
        topicTag: 'Alternating Circle',
        explanation: 'Since boys and girls alternate around the table, every seat between any two consecutive boys must be occupied by exactly one girl.',
        options: [
          { label: 'A', text: 'Another boy', isCorrect: false },
          { label: 'B', text: 'Exactly one girl', isCorrect: true },
          { label: 'C', text: 'Two girls', isCorrect: false },
          { label: 'D', text: 'Cannot be determined', isCorrect: false },
        ],
      },
      {
        prompt: 'A, B, C, D, E and F are sitting in a row facing north. C is immediate right of D. E and F are at extremes. B is second to left of C. Who is sitting to the immediate left of E if E is at the right extreme?',
        topicTag: 'Linear Bounds',
        explanation: 'Right extreme is E. If sequence is F - B - D - C - A - E, then immediate left of E is A.',
        options: [
          { label: 'A', text: 'A', isCorrect: true },
          { label: 'B', text: 'B', isCorrect: false },
          { label: 'C', text: 'C', isCorrect: false },
          { label: 'D', text: 'D', isCorrect: false },
        ],
      },
      {
        prompt: 'In a class of 45 students, rank of Rahul is 15th from the top. What is his rank from the bottom?',
        topicTag: 'Rank Calculation',
        explanation: 'Rank from bottom = Total students - Rank from top + 1 = 45 - 15 + 1 = 31.',
        options: [
          { label: 'A', text: '30th', isCorrect: false },
          { label: 'B', text: '31st', isCorrect: true },
          { label: 'C', text: '32nd', isCorrect: false },
          { label: 'D', text: '33rd', isCorrect: false },
        ],
      },
      {
        prompt: 'Six people are sitting around a triangular table with two people on each side. If P is to the right of Q on the same side, what is opposite to P?',
        topicTag: 'Triangular Table',
        explanation: 'In a triangular table with 2 people per side, each seat directly opposes a vertex or symmetrical seat on another edge.',
        options: [
          { label: 'A', text: 'A corner position', isCorrect: false },
          { label: 'B', text: 'An edge position on opposing side', isCorrect: true },
          { label: 'C', text: 'Q', isCorrect: false },
          { label: 'D', text: 'Cannot be seated', isCorrect: false },
        ],
      },
      {
        prompt: 'Suresh is 7 ranks ahead of Ashok in a class of 39. If Ashok’s rank is 17th from the last, what is Suresh’s rank from the start?',
        topicTag: 'Relative Rank',
        explanation: 'Ashok’s rank from start = 39 - 17 + 1 = 23rd. Suresh is 7 ranks ahead of Ashok (meaning better rank, smaller number) = 23 - 7 = 16th from start.',
        options: [
          { label: 'A', text: '14th', isCorrect: false },
          { label: 'B', text: '15th', isCorrect: false },
          { label: 'C', text: '16th', isCorrect: true },
          { label: 'D', text: '17th', isCorrect: false },
        ],
      },
      {
        prompt: 'Five executives P, Q, R, S, T sit in a conference. Q sits next to S who sits on the extreme left. T does not sit next to P. Who sits next to T if R sits in the middle?',
        topicTag: 'Conference Order',
        explanation: 'S is at index 1 (extreme left). Q is next to S (index 2). R is in middle (index 3). Leftover positions 4 and 5 are for P and T. Since T does not sit next to P, P must be at 4 (next to R) and T at 5 (next to P violates? If P is at 5 and T at 4, T is next to R). Hence T sits next to R.',
        options: [
          { label: 'A', text: 'S', isCorrect: false },
          { label: 'B', text: 'Q', isCorrect: false },
          { label: 'C', text: 'R', isCorrect: true },
          { label: 'D', text: 'P', isCorrect: false },
        ],
      },
      {
        prompt: 'If in a row of 30 girls, Priya is shifted by 4 places towards the right, she becomes 12th from the left end. What was her earlier position from the right end of the row?',
        topicTag: 'Shifting Position',
        explanation: 'New position from left = 12. Earlier position from left = 12 - 4 = 8th. Earlier position from right = 30 - 8 + 1 = 23rd.',
        options: [
          { label: 'A', text: '21st', isCorrect: false },
          { label: 'B', text: '22nd', isCorrect: false },
          { label: 'C', text: '23rd', isCorrect: true },
          { label: 'D', text: '24th', isCorrect: false },
        ],
      },
      {
        prompt: 'Eight people sit around a square table, two on each side. A sits opposite C. B sits to the immediate right of A. Where does D sit if D is opposite B?',
        topicTag: 'Square Table',
        explanation: 'Since B sits to immediate right of A, and D is directly opposite B across the table, D sits to the immediate left of C (which is opposite A).',
        options: [
          { label: 'A', text: 'Immediate right of C', isCorrect: false },
          { label: 'B', text: 'Immediate left of C', isCorrect: true },
          { label: 'C', text: 'Adjacent to A', isCorrect: false },
          { label: 'D', text: 'Opposite A', isCorrect: false },
        ],
      },
      {
        prompt: 'In a queue, Mohan is 14th from front and Sohan is 11th from back. If there are 4 persons between Mohan and Sohan, how many persons can be in the queue at minimum?',
        topicTag: 'Queue Overlapping',
        explanation: 'Minimum persons occurs in overlapping case = (Position 1 + Position 2) - (Persons in between + 2) = (14 + 11) - (4 + 2) = 25 - 6 = 19 persons.',
        options: [
          { label: 'A', text: '19', isCorrect: true },
          { label: 'B', text: '21', isCorrect: false },
          { label: 'C', text: '25', isCorrect: false },
          { label: 'D', text: '29', isCorrect: false },
        ],
      },
      {
        prompt: 'A, B, C, D, E are standing in a circle facing the centre. A is between E and C. B is to the right of E. Who is to the left of C?',
        topicTag: 'Circular Order',
        explanation: 'Looking at circle: E - A - C. B is to the right of E (meaning E\'s other side). C\'s other side has D. Left of C (facing center) is A.',
        options: [
          { label: 'A', text: 'A', isCorrect: true },
          { label: 'B', text: 'B', isCorrect: false },
          { label: 'C', text: 'D', isCorrect: false },
          { label: 'D', text: 'E', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 8. LOGICAL: Syllogisms & Venn Deductions
  // -------------------------------------------------------------
  {
    title: 'Logical Reasoning: Syllogisms & Venn Deductions',
    slug: 'logical-syllogisms-deduction',
    description: 'Evaluate logical truth values of categorical propositions: All, Some, No, and Some Not with Venn diagram representations.',
    category: 'LOGICAL',
    difficulty: 'MEDIUM',
    durationMinutes: 25,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Statements: 1. All mangoes are golden. 2. No golden things are cheap. Conclusions: I. All mangoes are cheap. II. Golden things are not mangoes.',
        topicTag: 'Syllogism',
        explanation: 'Mangoes ⊆ Golden. Golden ∩ Cheap = ∅. Therefore, Mangoes ∩ Cheap = ∅ (No mango is cheap). Conclusion I is false. Golden things can include mangoes, so II is false. Neither follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Either I or II follows', isCorrect: false },
          { label: 'D', text: 'Neither I nor II follows', isCorrect: true },
        ],
      },
      {
        prompt: 'Statements: 1. Some cats are dogs. 2. Some dogs are stones. Conclusions: I. No cat is stone. II. Some cats are stones.',
        topicTag: 'Complementary Pair',
        explanation: 'Cats and stones have no definite relation from the statements. However, "No cat is stone" and "Some cats are stones" form an E-I complementary pair. Hence, either I or II must follow.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Either I or II follows', isCorrect: true },
          { label: 'D', text: 'Neither I nor II follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. All books are pens. 2. All pens are papers. Conclusions: I. All books are papers. II. Some papers are books.',
        topicTag: 'Universal Syllogism',
        explanation: 'Books ⊆ Pens ⊆ Papers. Therefore, Books ⊆ Papers (Conclusion I holds). Since Books ⊆ Papers and Books is non-empty, Some papers are books (Conclusion II holds). Both follow.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Both I and II follow', isCorrect: true },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. Some actors are singers. 2. All singers are dancers. Conclusions: I. Some actors are dancers. II. No singer is actor.',
        topicTag: 'Particular Affirmative',
        explanation: 'Actors ∩ Singers ≠ ∅. Singers ⊆ Dancers. Therefore, Actors ∩ Dancers ≠ ∅ (Some actors are dancers holds). II contradicts statement 1. Only I follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: true },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Both I and II follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. No door is a dog. 2. All dogs are cats. Conclusions: I. No door is a cat. II. Some cats are dogs.',
        topicTag: 'Negative Syllogism',
        explanation: 'All dogs are cats => Some cats are dogs (Conclusion II definitely follows). Doors cannot be dogs, but doors may or may not be cats. Only II follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: true },
          { label: 'C', text: 'Both follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Which diagram represents the relationship between: Animals, Dogs, and Pets?',
        topicTag: 'Venn Diagram',
        explanation: 'All dogs are animals (Dogs ⊆ Animals). Some dogs are pets, and some pets are other animals or non-animals. Thus Dogs is entirely inside Animals, and Pets intersects both.',
        options: [
          { label: 'A', text: 'Three disjoint circles', isCorrect: false },
          { label: 'B', text: 'Two concentric circles intersected by a third circle', isCorrect: true },
          { label: 'C', text: 'Three concentric circles', isCorrect: false },
          { label: 'D', text: 'Two disjoint circles inside a large circle', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. All cars are jeeps. 2. All jeeps are four-wheelers. Conclusions: I. All cars are four-wheelers. II. Some four-wheelers are cars.',
        topicTag: 'Syllogism Universal',
        explanation: 'Cars ⊆ Jeeps ⊆ Four-wheelers. Conclusion I is directly true. Conclusion II is the valid converse. Both I and II follow.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Both I and II follow', isCorrect: true },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. Some trees are paper. 2. Some paper are pens. Conclusions: I. Some trees are pens. II. No tree is pen.',
        topicTag: 'Complementary Pairs',
        explanation: 'Two "Some" statements give no definite conclusion between extreme terms. Since I (Some) and II (No) form a complementary pair, Either I or II follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Either I or II follows', isCorrect: true },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Which Venn diagram best represents: Professors, Researchers, and Scientists?',
        topicTag: 'Intersecting Sets',
        explanation: 'A person can be a professor, a researcher, and a scientist simultaneously, or any combination of two, or only one. Represented by three mutually intersecting circles.',
        options: [
          { label: 'A', text: 'Three mutually intersecting circles', isCorrect: true },
          { label: 'B', text: 'Three separate circles', isCorrect: false },
          { label: 'C', text: 'Two concentric circles with one outside', isCorrect: false },
          { label: 'D', text: 'One large circle enclosing two separate circles', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. No liquid is a gas. 2. All gases are vapors. Conclusions: I. Some vapors are gases. II. No liquid is a vapor.',
        topicTag: 'Negative Premise',
        explanation: 'All gases are vapors => Some vapors are gases (I definitely follows). Liquids cannot be gases, but could be other vapors. Conclusion II is not necessarily true. Only I follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: true },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Both follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. All cups are plates. 2. Some plates are bowls. Conclusions: I. Some cups are bowls. II. Some plates are cups.',
        topicTag: 'Sub-alternation',
        explanation: 'Cups ⊆ Plates. Therefore, Some plates are cups (Conclusion II definitely follows). However, cups and bowls may have no overlap. Only II follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: true },
          { label: 'C', text: 'Both follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Which diagram represents: Earth, Sea, and Sun?',
        topicTag: 'Venn Celestial',
        explanation: 'The Sea is entirely inside the Earth. The Sun is completely separate and disjoint from Earth. One circle inside another, and a third disjoint circle.',
        options: [
          { label: 'A', text: 'Three concentric circles', isCorrect: false },
          { label: 'B', text: 'One circle inside another circle, with a third circle completely disjoint', isCorrect: true },
          { label: 'C', text: 'Three intersecting circles', isCorrect: false },
          { label: 'D', text: 'Three disjoint circles', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. Most engineers are innovative. 2. Some innovative people are rich. Conclusions: I. Some engineers are rich. II. Some rich are innovative.',
        topicTag: 'Most Quantifier',
        explanation: '"Most" = Some. "Some innovative people are rich" converts to "Some rich are innovative" (II follows). No definite connection between engineers and rich. Only II follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: false },
          { label: 'B', text: 'Only II follows', isCorrect: true },
          { label: 'C', text: 'Both follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. All pens are ink. 2. No ink is chalk. Conclusions: I. No pen is chalk. II. All ink are pens.',
        topicTag: 'Universal Negative',
        explanation: 'Pens ⊆ Ink. Ink ∩ Chalk = ∅. Therefore, Pens ∩ Chalk = ∅ (No pen is chalk holds). Conclusion II is invalid converse. Only I follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: true },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Both follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
      {
        prompt: 'Statements: 1. Only a few computers are laptops. 2. All laptops are electronic. Conclusions: I. Some computers are electronic. II. All computers being laptops is a possibility.',
        topicTag: 'Only A Few Logic',
        explanation: '"Only a few" means Some are, and Some are not. Since some computers are laptops and all laptops are electronic, Some computers are electronic (I follows). "All computers being laptops" is false because only a few are. Only I follows.',
        options: [
          { label: 'A', text: 'Only I follows', isCorrect: true },
          { label: 'B', text: 'Only II follows', isCorrect: false },
          { label: 'C', text: 'Both follow', isCorrect: false },
          { label: 'D', text: 'Neither follows', isCorrect: false },
        ],
      },
    ],
  },
];
