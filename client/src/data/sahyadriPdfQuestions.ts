export interface CompanyPdfDetail {
  filename: string;
  company: string;
  title: string;
  pattern: {
    duration: string;
    totalQuestions: number;
    negativeMarking: string;
    targetCutoff: string;
    sections: string[];
  };
  keyFormulas: string[];
  questions: {
    number: number;
    prompt: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
    topic: string;
  }[];
}

export const SAHYADRI_PDF_DETAILS: Record<string, CompanyPdfDetail> = {
  'Accenture_Test_1.pdf': {
    filename: 'Accenture_Test_1.pdf',
    company: 'Accenture',
    title: 'Accenture Placement Aptitude Paper 1',
    pattern: {
      duration: '45 Minutes',
      totalQuestions: 25,
      negativeMarking: 'No Negative Marking',
      targetCutoff: '70% (18+ Correct)',
      sections: ['Quantitative Aptitude (10)', 'Analytical Reasoning (10)', 'Abstract Reasoning (5)'],
    },
    keyFormulas: [
      'Alternating Series: Check difference of differences or square/cube offsets (n^2 ± n).',
      'Symmetric Boundary Pairs: In dual series, sum of i-th and (N - i + 1)-th terms often equals a constant.',
      'Speed Conversion: Multiply km/h by 5/18 to convert to m/s.',
      'Work Efficiency: Total Units = LCM(Individual Times). Daily work = Total Units / Days.',
    ],
    questions: [
      {
        number: 1,
        topic: 'Number Series',
        prompt: 'What is the next number of the sequence: 2, 2, 12, 12, 30, 30, ___?',
        options: ['56', '42', '64', '50'],
        correctAnswer: '56',
        explanation:
          'The sequence alternates: 1^2 + 1 = 2; 2^2 - 2 = 2; 3^2 + 3 = 12; 4^2 - 4 = 12; 5^2 + 5 = 30; 6^2 - 6 = 30. Following the pattern, the 7th term is 7^2 + 7 = 49 + 7 = 56.',
      },
      {
        number: 2,
        topic: 'Alternating Series',
        prompt: 'Find the missing number in the paired series: 8, 2, 14, 6, 11, ___, 14, 6, 18, 12?',
        options: ['7', '9', '10', '8'],
        correctAnswer: '9',
        explanation:
          'Symmetric boundary sums: 1st + 10th (8 + 12 = 20); 2nd + 9th (2 + 18 = 20); 3rd + 8th (14 + 6 = 20); 4th + 7th (6 + 14 = 20). Therefore the 5th and 6th terms must sum to 20: 11 + X = 20 => X = 9.',
      },
      {
        number: 3,
        topic: 'Geometric Series',
        prompt: 'Find the missing number: 15, 51, 216, 1100, ___, 46452.',
        options: ['5530', '6630', '6600', '7100'],
        correctAnswer: '6630',
        explanation:
          'Multiplication with arithmetic increment: 15*3 + 6 = 51; 51*4 + 12 = 216; 216*5 + 20 = 1100; 1100*6 + 30 = 6630; 6630*7 + 42 = 46452. Missing term = 6630.',
      },
      {
        number: 4,
        topic: 'Time and Work',
        prompt: 'A can do a piece of work in 12 days, and B can do it in 18 days. If they work together, how many days will it take?',
        options: ['6.5 days', '7.2 days', '8.0 days', '7.5 days'],
        correctAnswer: '7.2 days',
        explanation:
          'LCM of 12 and 18 = 36 Units. A does 36/12 = 3 units/day. B does 36/18 = 2 units/day. Combined = 5 units/day. Days = 36 / 5 = 7.2 days.',
      },
      {
        number: 5,
        topic: 'Speed & Distance',
        prompt: 'A train 150m long moving at 54 km/h passes a telegraph post. How long does it take?',
        options: ['8 sec', '10 sec', '12 sec', '15 sec'],
        correctAnswer: '10 sec',
        explanation:
          'Speed = 54 × (5/18) = 15 m/s. Distance = length of train = 150m. Time = 150 / 15 = 10 seconds.',
      },
    ],
  },

  'Accenture_Test_3.pdf': {
    filename: 'Accenture_Test_3.pdf',
    company: 'Accenture',
    title: 'Accenture Placement Aptitude Paper 3',
    pattern: {
      duration: '45 Minutes',
      totalQuestions: 25,
      negativeMarking: 'No Negative Marking',
      targetCutoff: '72% (18+ Correct)',
      sections: ['Logical Deduction', 'Cryptarithmetic & Syllogisms', 'Data Sufficiency'],
    },
    keyFormulas: [
      'Cryptarithmetic: The carry from the sum of two digits can only ever be 1.',
      'Syllogisms: All + All = All; All + No = No; Some + All = Some.',
      'Seating: Circular inward facing -> Clockwise is Left, Counter-Clockwise is Right.',
    ],
    questions: [
      {
        number: 1,
        topic: 'Cryptarithmetic',
        prompt: 'In SEND + MORE = MONEY, what is the value of digit M?',
        options: ['0', '1', '2', '9'],
        correctAnswer: '1',
        explanation:
          'In column addition of two 4-digit numbers yielding a 5-digit number, the maximum carry from the thousands column is 1. Thus M must be 1.',
      },
      {
        number: 2,
        topic: 'Syllogisms',
        prompt: 'Statements: All laptops are devices. Some devices are phones. Conclusions: I. Some devices are laptops. II. All laptops are phones.',
        options: ['Only I follows', 'Only II follows', 'Both follow', 'Neither follows'],
        correctAnswer: 'Only I follows',
        explanation:
          'Since All laptops are devices, the converse "Some devices are laptops" is definitively true. Conclusion II is not guaranteed.',
      },
    ],
  },

  'TCS_Test_1.pdf': {
    filename: 'TCS_Test_1.pdf',
    company: 'TCS',
    title: 'TCS NQT Placement Aptitude Paper 1',
    pattern: {
      duration: '40 Minutes',
      totalQuestions: 26,
      negativeMarking: 'Negative marking of 0.25 on MCQ',
      targetCutoff: '65% (17+ Correct)',
      sections: ['Numerical Ability (15)', 'Reasoning Ability (11)'],
    },
    keyFormulas: [
      'Divisibility by 11: (Sum of odd digits - Sum of even digits) is divisible by 11 or 0.',
      'Unit digit cyclicity of 2, 3, 7, 8 is 4. Divide power by 4 and check remainder.',
      'Successive discounts of d1% and d2%: Net discount = d1 + d2 - (d1 × d2)/100.',
    ],
    questions: [
      {
        number: 1,
        topic: 'Unit Digit Cycles',
        prompt: 'What is the unit digit of 7^105?',
        options: ['1', '3', '7', '9'],
        correctAnswer: '7',
        explanation:
          'Cyclicity of 7 is 4: 7^1 = 7, 7^2 = 9, 7^3 = 3, 7^4 = 1. Divide power 105 by 4: 105 = 4 × 26 + 1 (remainder 1). Hence unit digit is 7^1 = 7.',
      },
      {
        number: 2,
        topic: 'Number Properties',
        prompt: 'If the number 5432*7 is divisible by 9, what is the digit *?',
        options: ['6', '5', '4', '7'],
        correctAnswer: '6',
        explanation:
          'Sum of digits must be divisible by 9: 5 + 4 + 3 + 2 + * + 7 = 21 + *. Next multiple of 9 is 27. Therefore * = 27 - 21 = 6.',
      },
    ],
  },

  'TCS_Test_2.pdf': {
    filename: 'TCS_Test_2.pdf',
    company: 'TCS',
    title: 'TCS NQT Placement Aptitude Paper 2',
    pattern: {
      duration: '40 Minutes',
      totalQuestions: 25,
      negativeMarking: '0.25 Mark Penalty',
      targetCutoff: '68%',
      sections: ['Advanced Quantitative', 'Data Sufficiency'],
    },
    keyFormulas: [
      'Ratio & Mixtures: Quantity of pure liquid remaining after n removals of x from total V: Q = V(1 - x/V)^n.',
      'Pipes & Cisterns: Filling pipe is positive rate (+1/T), emptying pipe is negative rate (-1/T).',
    ],
    questions: [
      {
        number: 1,
        topic: 'Mixtures & Alligation',
        prompt: 'A vessel contains 60 liters of milk. 6 liters are withdrawn and replaced by water. This process is repeated once more. How much milk is left?',
        options: ['48.6 liters', '45.0 liters', '50.2 liters', '52.4 liters'],
        correctAnswer: '48.6 liters',
        explanation:
          'Formula: Remaining Milk = Total × (1 - x/Total)^2 = 60 × (1 - 6/60)^2 = 60 × (0.9)^2 = 60 × 0.81 = 48.6 liters.',
      },
    ],
  },

  'Infosys_Test_3.pdf': {
    filename: 'Infosys_Test_3.pdf',
    company: 'Infosys',
    title: 'Infosys Reasoning & Aptitude Paper 3',
    pattern: {
      duration: '40 Minutes',
      totalQuestions: 25,
      negativeMarking: 'No Negative Marking',
      targetCutoff: '70%',
      sections: ['Mathematical Thinking', 'Cryptarithmetic & Logic Puzzles'],
    },
    keyFormulas: [
      'Permutation & Combination: nPr = n! / (n - r)!; nCr = n! / [r!(n - r)!].',
      'Circular Permutations: Arrangements of n items around circle = (n - 1)!.',
    ],
    questions: [
      {
        number: 1,
        topic: 'Permutations',
        prompt: 'In how many ways can 5 people be seated around a circular table?',
        options: ['120', '24', '60', '720'],
        correctAnswer: '24',
        explanation:
          'Circular arrangement formula for n items is (n - 1)! = (5 - 1)! = 4! = 4 × 3 × 2 × 1 = 24 ways.',
      },
    ],
  },

  'Wipro_Test_1.pdf': {
    filename: 'Wipro_Test_1.pdf',
    company: 'Wipro',
    title: 'Wipro Elite NTH Aptitude Paper 1',
    pattern: {
      duration: '45 Minutes',
      totalQuestions: 25,
      negativeMarking: 'No Negative Marking',
      targetCutoff: '65%',
      sections: ['Quantitative Ability', 'Logical Reasoning', 'Verbal Ability'],
    },
    keyFormulas: [
      'Clocks: Angle between hour and minute hands: |30H - (11/2)M| degrees.',
      'Calendar: Ordinary year has 1 odd day; Leap year has 2 odd days.',
    ],
    questions: [
      {
        number: 1,
        topic: 'Clock Angles',
        prompt: 'What is the angle between the hour hand and minute hand of a clock at 3:30?',
        options: ['75 degrees', '85 degrees', '90 degrees', '70 degrees'],
        correctAnswer: '75 degrees',
        explanation:
          'Formula: Angle = |30H - (11/2)M| = |30(3) - (11/2)(30)| = |90 - 165| = 75 degrees.',
      },
    ],
  },

  'Wipro_Test_2.pdf': {
    filename: 'Wipro_Test_2.pdf',
    company: 'Wipro',
    title: 'Wipro Elite NTH Aptitude Paper 2',
    pattern: {
      duration: '45 Minutes',
      totalQuestions: 25,
      negativeMarking: 'No Negative Marking',
      targetCutoff: '68%',
      sections: ['Advanced Arithmetic', 'Mensuration', 'Logarithms'],
    },
    keyFormulas: [
      'Mensuration: Area of circle = π r^2; Cylinder volume = π r^2 h; Sphere volume = (4/3) π r^3.',
      'Logarithms: log(ab) = log a + log b; log(a/b) = log a - log b; log(a^k) = k log a.',
    ],
    questions: [
      {
        number: 1,
        topic: 'Mensuration',
        prompt: 'If the radius of a circle is increased by 20%, by what percentage does its area increase?',
        options: ['40%', '44%', '20%', '42%'],
        correctAnswer: '44%',
        explanation:
          'Area proportional to r^2. Successive increase = a + b + (ab)/100 = 20 + 20 + (20 × 20)/100 = 40 + 4 = 44%.',
      },
    ],
  },

  'CTS_Test_3.pdf': {
    filename: 'CTS_Test_3.pdf',
    company: 'Cognizant',
    title: 'Cognizant (CTS) Placement Aptitude Paper 3',
    pattern: {
      duration: '50 Minutes',
      totalQuestions: 25,
      negativeMarking: 'No Negative Marking',
      targetCutoff: '70%',
      sections: ['Analytical Reasoning', 'Quantitative Ability'],
    },
    keyFormulas: [
      'Ages: If ratio of present ages is a:b, and after n years becomes c:d, solve (ax + n)/(bx + n) = c/d.',
      'Partnership: Profit share ratio = (Capital 1 × Time 1) : (Capital 2 × Time 2).',
    ],
    questions: [
      {
        number: 1,
        topic: 'Problems on Ages',
        prompt: 'The ratio of present ages of father and son is 7:2. After 10 years, the ratio becomes 9:4. Find the father’s present age.',
        options: ['35 years', '42 years', '49 years', '28 years'],
        correctAnswer: '35 years',
        explanation:
          'Let ages be 7x and 2x. (7x + 10) / (2x + 10) = 9/4 => 4(7x + 10) = 9(2x + 10) => 28x + 40 = 18x + 90 => 10x = 50 => x = 5. Father’s age = 7 × 5 = 35 years.',
      },
    ],
  },
};
