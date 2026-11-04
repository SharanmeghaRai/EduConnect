import { RawExam } from './exams-part1.js';

export const seedExamsPart4: RawExam[] = [
  // -------------------------------------------------------------
  // 9. LOGICAL: Blood Relations & Direction Sense
  // -------------------------------------------------------------
  {
    title: 'Logical Reasoning: Blood Relations & Directions',
    slug: 'logical-blood-relations-direction',
    description: 'Solve coded family trees, pointing puzzles, cardinal compass paths, Pythagoras displacements, and shadow angles at sunrise/sunset.',
    category: 'LOGICAL',
    difficulty: 'MEDIUM',
    durationMinutes: 25,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
        topicTag: 'Blood Relations',
        explanation: 'Only son of Suresh\'s mother is Suresh himself. Therefore, the boy in the photograph is Suresh\'s son. Suresh is his Father.',
        options: [
          { label: 'A', text: 'Brother', isCorrect: false },
          { label: 'B', text: 'Uncle', isCorrect: false },
          { label: 'C', text: 'Father', isCorrect: true },
          { label: 'D', text: 'Grandfather', isCorrect: false },
        ],
      },
      {
        prompt: 'A man walks 5 km toward South and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?',
        topicTag: 'Direction Sense',
        explanation: 'Initial movement: 5 km South. Turns right (West) and walks 3 km. Turns left (South) and walks 5 km. Net position is 10 km South and 3 km West => South-West.',
        options: [
          { label: 'A', text: 'West', isCorrect: false },
          { label: 'B', text: 'South', isCorrect: false },
          { label: 'C', text: 'North-East', isCorrect: false },
          { label: 'D', text: 'South-West', isCorrect: true },
        ],
      },
      {
        prompt: 'If A + B means A is the brother of B; A - B means A is the sister of B; and A * B means A is the father of B. Which of the following means that C is the son of M?',
        topicTag: 'Coded Blood Relations',
        explanation: 'M * N - C + F or M * C gives C as child of M. If C + F, C is male (brother of F). Hence M * C + F means M is father of C and C is male brother of F, making C the son of M.',
        options: [
          { label: 'A', text: 'M - N * C + F', isCorrect: false },
          { label: 'B', text: 'F - C + N * M', isCorrect: false },
          { label: 'C', text: 'M * C + F', isCorrect: true },
          { label: 'D', text: 'M * N - C', isCorrect: false },
        ],
      },
      {
        prompt: 'One morning after sunrise, Suresh was standing facing a pole. The shadow of the pole fell exactly to his right. Which direction was Suresh facing?',
        topicTag: 'Shadow Direction',
        explanation: 'After sunrise, the sun is in the East, so shadows fall toward the West. If the shadow falls to Suresh\'s right, West is to his right. When facing South, West is to one\'s right. Suresh was facing South.',
        options: [
          { label: 'A', text: 'East', isCorrect: false },
          { label: 'B', text: 'South', isCorrect: true },
          { label: 'C', text: 'West', isCorrect: false },
          { label: 'D', text: 'North', isCorrect: false },
        ],
      },
      {
        prompt: 'Introducing a woman, a man said, "Her husband is the only son of my father-in-law." How is the woman related to the man?',
        topicTag: 'Family Tree',
        explanation: 'The only son of the man\'s father-in-law is the man\'s wife\'s brother (his brother-in-law). The woman is the wife of this brother-in-law, or if the speaker is a woman speaking of her own husband: for a man, she is his sister-in-law (or wife if single daughter). For a man, the only son of his father-in-law is his brother-in-law, whose wife is his sister-in-law.',
        options: [
          { label: 'A', text: 'Mother', isCorrect: false },
          { label: 'B', text: 'Sister', isCorrect: false },
          { label: 'C', text: 'Sister-in-law', isCorrect: true },
          { label: 'D', text: 'Wife', isCorrect: false },
        ],
      },
      {
        prompt: 'Rohan walks 12 km North, then 5 km East. How far is he from his starting point?',
        topicTag: 'Pythagoras Displacement',
        explanation: 'By Pythagoras theorem: sqrt(12^2 + 5^2) = sqrt(144 + 25) = sqrt(169) = 13 km.',
        options: [
          { label: 'A', text: '13 km', isCorrect: true },
          { label: 'B', text: '14 km', isCorrect: false },
          { label: 'C', text: '15 km', isCorrect: false },
          { label: 'D', text: '17 km', isCorrect: false },
        ],
      },
      {
        prompt: 'A is B’s sister. C is B’s mother. D is C’s father. E is D’s mother. Then, how is A related to D?',
        topicTag: 'Multi-Generation Relation',
        explanation: 'A is sister of B => A and B are children of C. C is daughter of D. Therefore, A is the Granddaughter of D.',
        options: [
          { label: 'A', text: 'Grandmother', isCorrect: false },
          { label: 'B', text: 'Granddaughter', isCorrect: true },
          { label: 'C', text: 'Daughter', isCorrect: false },
          { label: 'D', text: 'Aunt', isCorrect: false },
        ],
      },
      {
        prompt: 'Starting from point X, Jayant walked 15 m towards west. He turned left and walked 20 m. He then turned left and walked 15 m. After this he turned to his right and walked 12 m. How far and in which direction is now Jayant from X?',
        topicTag: 'Multi-Leg Path',
        explanation: 'West 15 m, South 20 m, East 15 m (returns to the same vertical line as X), then South 12 m. Total distance = 20 + 12 = 32 m South.',
        options: [
          { label: 'A', text: '32 m, South', isCorrect: true },
          { label: 'B', text: '47 m, East', isCorrect: false },
          { label: 'C', text: '42 m, North', isCorrect: false },
          { label: 'D', text: '27 m, South', isCorrect: false },
        ],
      },
      {
        prompt: 'A and B are married couple. X and Y are brothers. X is the brother of A. How is Y related to B?',
        topicTag: 'In-Law Relation',
        explanation: 'X and Y are brothers. X is brother of A => Y is also brother of A. Since B is married to A, Y is the Brother-in-law of B.',
        options: [
          { label: 'A', text: 'Brother-in-law', isCorrect: true },
          { label: 'B', text: 'Brother', isCorrect: false },
          { label: 'C', text: 'Cousin', isCorrect: false },
          { label: 'D', text: 'Uncle', isCorrect: false },
        ],
      },
      {
        prompt: 'At 3:00 PM, the minute hand of a clock points towards North-East. In which direction will the hour hand point at 9:00 PM?',
        topicTag: 'Clock Direction',
        explanation: 'At 3:00, minute hand is at 12. If 12 corresponds to North-East (45 deg clockwise from North), at 9:00, the hour hand points at 9 (which is 270 deg or 90 deg counter-clockwise from 12). 45 deg - 90 deg = -45 deg = North-West.',
        options: [
          { label: 'A', text: 'South-East', isCorrect: false },
          { label: 'B', text: 'North-West', isCorrect: true },
          { label: 'C', text: 'South-West', isCorrect: false },
          { label: 'D', text: 'North', isCorrect: false },
        ],
      },
      {
        prompt: 'Pointing to Kapil, Shilpa said, "His mother’s brother is the father of my son Ashish." How is Kapil related to Shilpa?',
        topicTag: 'Indirect Pointing',
        explanation: 'Father of Shilpa’s son is Shilpa’s husband. So Kapil’s maternal uncle (mother’s brother) is Shilpa’s husband. Shilpa is Kapil’s maternal aunt (Mami), so Kapil is her Nephew.',
        options: [
          { label: 'A', text: 'Sister-in-law', isCorrect: false },
          { label: 'B', text: 'Nephew', isCorrect: true },
          { label: 'C', text: 'Niece', isCorrect: false },
          { label: 'D', text: 'Aunt', isCorrect: false },
        ],
      },
      {
        prompt: 'A river flows from west to east and on the way turns left and goes in a quarter circle round a hillock, then turns left again at right-angles. In what final direction is the river flowing?',
        topicTag: 'Flow Vectors',
        explanation: 'Initial direction: East. Turns left (North). Goes round quarter circle and turns left at right angles => from North turning left faces West. The river flows West.',
        options: [
          { label: 'A', text: 'North', isCorrect: false },
          { label: 'B', text: 'South', isCorrect: false },
          { label: 'C', text: 'East', isCorrect: false },
          { label: 'D', text: 'West', isCorrect: true },
        ],
      },
      {
        prompt: 'If P $ Q means P is mother of Q; P # Q means P is father of Q; P @ Q means P is husband of Q; P % Q means P is daughter of Q. What does K # L @ M % N mean?',
        topicTag: 'Complex Coded Tree',
        explanation: 'K is father of L. L is husband of M. M is daughter of N. Thus, L is son-in-law of N, and K is the father of N’s son-in-law.',
        options: [
          { label: 'A', text: 'K is father-in-law of M', isCorrect: true },
          { label: 'B', text: 'K is mother of L', isCorrect: false },
          { label: 'C', text: 'M is sister of L', isCorrect: false },
          { label: 'D', text: 'N is mother of K', isCorrect: false },
        ],
      },
      {
        prompt: 'Deepa moved a distance of 75 meters towards the north. She then turned to the left and walking for about 25 meters, turned left again and walked 80 meters. Finally, she turned to the right at an angle of 45°. In which direction is she moving now?',
        topicTag: 'Angular Turns',
        explanation: 'North 75m -> Turn left (West) 25m -> Turn left (South) 80m. Facing South, turning 45 degrees to the right points to South-West.',
        options: [
          { label: 'A', text: 'North-East', isCorrect: false },
          { label: 'B', text: 'North-West', isCorrect: false },
          { label: 'C', text: 'South-West', isCorrect: true },
          { label: 'D', text: 'South-East', isCorrect: false },
        ],
      },
      {
        prompt: 'Showing the man on the stage, Rita said, "He is the brother of the daughter of the wife of my husband." How is the man on the stage related to Rita?',
        topicTag: 'Paternal Chain',
        explanation: 'Wife of Rita’s husband is Rita herself. Daughter of Rita is Rita’s daughter. Brother of Rita’s daughter is Rita’s Son.',
        options: [
          { label: 'A', text: 'Son', isCorrect: true },
          { label: 'B', text: 'Husband', isCorrect: false },
          { label: 'C', text: 'Cousin', isCorrect: false },
          { label: 'D', text: 'Nephew', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 10. LOGICAL: Analytical Puzzles & Data Sufficiency
  // -------------------------------------------------------------
  {
    title: 'Logical Reasoning: Puzzles & Data Sufficiency',
    slug: 'logical-data-sufficiency',
    description: 'Determine whether given statements alone or together provide sufficient information to answer placement reasoning questions.',
    category: 'LOGICAL',
    difficulty: 'HARD',
    durationMinutes: 30,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Question: In which year was Rahul born? Statements: I. Rahul at present is 25 years younger to his mother. II. Rahul’s brother, who was born in 1994, is 35 years younger to a mother who is 60 years old today.',
        topicTag: 'Data Sufficiency',
        explanation: 'From II: Mother is 60 today, brother is 35 years younger => brother is 25. Born in 1994 + 25 = year 2019. From I: Rahul is 25 years younger than mother (age 35). Thus Rahul was born in 2019 - 35 = 1984. Both statements together are sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: true },
          { label: 'D', text: 'Statements I and II together are not sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: What is the code for "sky" in the code language? Statements: I. "sky is blue" is written as "de ra fa". II. "blue sea water" is written as "fa ta ga".',
        topicTag: 'Coding Sufficiency',
        explanation: 'From I and II, the common word is "blue" and common code is "fa". In statement I, "sky is" remains "de ra", so "sky" could be either "de" or "ra". The two statements together are not sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: false },
          { label: 'D', text: 'Statements I and II together are not sufficient', isCorrect: true },
        ],
      },
      {
        prompt: 'Question: How is T related to K? Statements: I. R’s sister J has married H, who is the only brother of T. II. K is the only daughter of H and J.',
        topicTag: 'Relation Sufficiency',
        explanation: 'From I: H is the only brother of T. From II: K is daughter of H and J. Thus H is K’s father, and T is the sibling of K’s father (Aunt or Uncle). Because T’s gender is not specified, we cannot determine if T is Aunt or Uncle. Not sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Statements I and II together are sufficient', isCorrect: false },
          { label: 'D', text: 'Statements I and II together are not sufficient', isCorrect: true },
        ],
      },
      {
        prompt: 'Question: Is x greater than y? Statements: I. 2x = 3y. II. x and y are positive integers.',
        topicTag: 'Algebraic Sufficiency',
        explanation: 'From I: x/y = 3/2. If x and y are positive (from II), then x = 1.5y > y. Both statements together are sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: true },
          { label: 'D', text: 'Neither is sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: What is the speed of the train? Statements: I. The train crosses a 200 m long platform in 20 seconds. II. The train crosses an electric pole in 10 seconds.',
        topicTag: 'Speed Sufficiency',
        explanation: 'From II: Length L = Speed S * 10. From I: (L + 200) = S * 20 => 10S + 200 = 20S => 10S = 200 => S = 20 m/s. Both statements together are sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: true },
          { label: 'D', text: 'Neither is sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'Four people A, B, C, and D wear shirts of 4 different colors: Red, Blue, Green, and Yellow. A does not wear Red or Blue. B does not wear Blue or Green. D wears Yellow. What color shirt does B wear?',
        topicTag: 'Matrix Puzzle',
        explanation: 'D wears Yellow. A cannot wear Red, Blue, or Yellow => A must wear Green. Leftover colors for B and C are Red and Blue. Since B does not wear Blue, B must wear Red.',
        options: [
          { label: 'A', text: 'Blue', isCorrect: false },
          { label: 'B', text: 'Green', isCorrect: false },
          { label: 'C', text: 'Red', isCorrect: true },
          { label: 'D', text: 'Yellow', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: Who among P, Q, R, S and T is the tallest? Statements: I. P is taller than Q but shorter than R. II. S is taller than T but shorter than Q.',
        topicTag: 'Ordering Sufficiency',
        explanation: 'From I: R > P > Q. From II: Q > S > T. Combining both gives: R > P > Q > S > T. Therefore R is the tallest. Both statements together are sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: true },
          { label: 'D', text: 'Statements I and II together are not sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'In a certain test, candidate M scores higher than N but lower than O. P scores higher than Q but lower than N. Who scored the lowest?',
        topicTag: 'Analytical Ranking',
        explanation: 'Order: O > M > N. And N > P > Q. Full order: O > M > N > P > Q. The lowest score is Q.',
        options: [
          { label: 'A', text: 'N', isCorrect: false },
          { label: 'B', text: 'P', isCorrect: false },
          { label: 'C', text: 'Q', isCorrect: true },
          { label: 'D', text: 'M', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: Is integer n even? Statements: I. n^2 + 1 is odd. II. 3n is an even integer.',
        topicTag: 'Parity Sufficiency',
        explanation: 'From I: n^2 + 1 is odd => n^2 is even => n is even. Statement I alone is sufficient. From II: 3n is even => n is even. Statement II alone is also sufficient. Each statement alone is sufficient.',
        options: [
          { label: 'A', text: 'Each statement alone is sufficient', isCorrect: true },
          { label: 'B', text: 'Only statement I is sufficient', isCorrect: false },
          { label: 'C', text: 'Only statement II is sufficient', isCorrect: false },
          { label: 'D', text: 'Both together are not sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'Five jobs J1, J2, J3, J4, J5 are processed sequentially. J1 is processed immediately before J3. J4 is processed before J2 but after J5. J5 is processed first. What is the processing order?',
        topicTag: 'Scheduling Puzzle',
        explanation: 'J5 is first: [J5, _, _, _, _]. J4 is before J2 but after J5: J5 - J4 - J2. Since J1 is immediately before J3, they must fit the remaining two consecutive slots. Order is J5, J4, J1, J3, J2.',
        options: [
          { label: 'A', text: 'J5, J1, J3, J4, J2', isCorrect: false },
          { label: 'B', text: 'J5, J4, J1, J3, J2', isCorrect: true },
          { label: 'C', text: 'J1, J3, J5, J4, J2', isCorrect: false },
          { label: 'D', text: 'J5, J2, J4, J1, J3', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: On which day of the week was birthday celebrated? Statements: I. It was celebrated on an even date after the 12th but before the 16th. II. The 1st day of that month was a Wednesday.',
        topicTag: 'Calendar Sufficiency',
        explanation: 'From I: Even date strictly between 12 and 16 is 14th. From II: 1st is Wednesday => 8th is Wed, 15th is Wed => 14th is Tuesday. Both statements together are sufficient.',
        options: [
          { label: 'A', text: 'Both statements together are sufficient', isCorrect: true },
          { label: 'B', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'D', text: 'Neither is sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'Among 5 boxes A, B, C, D, E of different weights, B is heavier than only E. A is heavier than C and D but lighter than no other box. Which is the third heaviest box?',
        topicTag: 'Box Weights',
        explanation: 'B is heavier than only E => E is lightest (5th), B is 4th. A is heaviest (1st). Remaining C and D are 2nd and 3rd, but which is heavier between C and D is not given. Cannot be determined.',
        options: [
          { label: 'A', text: 'C', isCorrect: false },
          { label: 'B', text: 'D', isCorrect: false },
          { label: 'C', text: 'Cannot be determined', isCorrect: true },
          { label: 'D', text: 'B', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: What is the perimeter of a rectangle? Statements: I. The diagonal is 10 cm. II. The area of the rectangle is 48 sq cm.',
        topicTag: 'Geometry Sufficiency',
        explanation: 'From I: l^2 + b^2 = 100. From II: 2*l*b = 96. (l + b)^2 = (l^2 + b^2) + 2lb = 100 + 96 = 196 => l + b = 14. Perimeter = 2(l + b) = 28 cm. Both together are sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: true },
          { label: 'D', text: 'Neither is sufficient', isCorrect: false },
        ],
      },
      {
        prompt: 'Three boxes contain colored tokens: Gold, Silver, Bronze. Box 1 has label "Gold or Bronze", Box 2 has "Silver", Box 3 has "Gold". Every box is mislabeled. If you pull a Gold token from Box 1, which box contains Silver?',
        topicTag: 'Logic Deduction',
        explanation: 'All labels are false. Box 1 has Gold token. Box 2 label is "Silver" which is false, so Box 2 cannot contain Silver. Box 3 must contain Silver.',
        options: [
          { label: 'A', text: 'Box 1', isCorrect: false },
          { label: 'B', text: 'Box 2', isCorrect: false },
          { label: 'C', text: 'Box 3', isCorrect: true },
          { label: 'D', text: 'Cannot be determined', isCorrect: false },
        ],
      },
      {
        prompt: 'Question: Is m divisible by 6? Statements: I. m is divisible by 2. II. m is divisible by 3.',
        topicTag: 'Divisibility Sufficiency',
        explanation: 'A number is divisible by 6 if and only if it is divisible by both 2 and 3 (coprime factors). Neither alone is sufficient, but both together are sufficient.',
        options: [
          { label: 'A', text: 'Statement I alone is sufficient', isCorrect: false },
          { label: 'B', text: 'Statement II alone is sufficient', isCorrect: false },
          { label: 'C', text: 'Both I and II together are sufficient', isCorrect: true },
          { label: 'D', text: 'Neither is sufficient', isCorrect: false },
        ],
      },
    ],
  },
];
