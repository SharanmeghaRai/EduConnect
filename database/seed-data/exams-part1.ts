export interface RawExam {
  title: string;
  slug: string;
  description: string;
  category: 'QUANT' | 'LOGICAL' | 'VERBAL' | 'DATA_INT' | 'TECH_CS' | 'TECH_CORE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarkingRatio: number;
  maxAttempts: number;
  questions: {
    prompt: string;
    topicTag: string;
    explanation: string;
    options: { label: string; text: string; isCorrect: boolean }[];
  }[];
}

export const seedExams: RawExam[] = [
  // -------------------------------------------------------------
  // 1. QUANT: Percentages, Profit & Loss
  // -------------------------------------------------------------
  {
    title: 'Quant Mastery: Percentages, Profit & Loss',
    slug: 'quant-percentages-profit-loss',
    description: 'Master foundational percentage calculations, successive discounts, marked price, markup percentage, and profit-loss accounting.',
    category: 'QUANT',
    difficulty: 'EASY',
    durationMinutes: 25,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'If the price of petrol increases by 25%, by what percentage must a driver reduce fuel consumption so that the overall expenditure remains unchanged?',
        topicTag: 'Percentages',
        explanation: 'Let initial expenditure = 100. New price = 125. To bring it back to 100, reduction required = (25 / 125) * 100 = 20%.',
        options: [
          { label: 'A', text: '20%', isCorrect: true },
          { label: 'B', text: '25%', isCorrect: false },
          { label: 'C', text: '16.67%', isCorrect: false },
          { label: 'D', text: '30%', isCorrect: false },
        ],
      },
      {
        prompt: 'A merchant marks up his goods by 40% above cost price and allows a discount of 20% on the marked price. What is his net profit percentage?',
        topicTag: 'Profit & Loss',
        explanation: 'Let CP = 100. MP = 140. SP = 140 * (1 - 0.20) = 112. Profit = SP - CP = 112 - 100 = 12%.',
        options: [
          { label: 'A', text: '10%', isCorrect: false },
          { label: 'B', text: '12%', isCorrect: true },
          { label: 'C', text: '15%', isCorrect: false },
          { label: 'D', text: '20%', isCorrect: false },
        ],
      },
      {
        prompt: 'By selling an article for ₹720, a shopkeeper loses 10%. At what price should he sell it to gain 15%?',
        topicTag: 'Profit & Loss',
        explanation: 'SP1 = 0.90 * CP = 720 => CP = 800. For 15% gain, SP2 = 1.15 * 800 = ₹920.',
        options: [
          { label: 'A', text: '₹880', isCorrect: false },
          { label: 'B', text: '₹900', isCorrect: false },
          { label: 'C', text: '₹920', isCorrect: true },
          { label: 'D', text: '₹950', isCorrect: false },
        ],
      },
      {
        prompt: 'Successive discounts of 20% and 10% are equivalent to a single discount of what percentage?',
        topicTag: 'Discounts',
        explanation: 'Equivalent discount = (D1 + D2 - (D1 * D2) / 100) = (20 + 10 - (20 * 10) / 100) = 30 - 2 = 28%.',
        options: [
          { label: 'A', text: '30%', isCorrect: false },
          { label: 'B', text: '28%', isCorrect: true },
          { label: 'C', text: '27.5%', isCorrect: false },
          { label: 'D', text: '26%', isCorrect: false },
        ],
      },
      {
        prompt: 'In an examination, 35% of candidates fail in Mathematics and 25% fail in English. If 10% fail in both, what percentage of candidates pass in both subjects?',
        topicTag: 'Percentages & Sets',
        explanation: 'Total failed in at least one = 35 + 25 - 10 = 50%. Therefore, passed in both = 100% - 50% = 50%.',
        options: [
          { label: 'A', text: '40%', isCorrect: false },
          { label: 'B', text: '45%', isCorrect: false },
          { label: 'C', text: '50%', isCorrect: true },
          { label: 'D', text: '55%', isCorrect: false },
        ],
      },
      {
        prompt: 'A dishonest dealer professes to sell his goods at cost price but uses a weight of 900 grams for a 1 kg weight. Find his gain percentage.',
        topicTag: 'Dishonest Dealer',
        explanation: 'Gain % = [Error / (True Value - Error)] * 100 = [100 / 900] * 100 = 11.11% (or 11 1/9%).',
        options: [
          { label: 'A', text: '10%', isCorrect: false },
          { label: 'B', text: '11.11%', isCorrect: true },
          { label: 'C', text: '12.5%', isCorrect: false },
          { label: 'D', text: '9.09%', isCorrect: false },
        ],
      },
      {
        prompt: 'A sum of money doubles itself at simple interest in 8 years. In how many years will it become 4 times itself at the same rate?',
        topicTag: 'Simple Interest',
        explanation: 'SI in 8 years = P => Rate R = 100 / 8 = 12.5%. For amount to become 4P, total SI = 3P. Time = (3P * 100) / (P * 12.5) = 24 years.',
        options: [
          { label: 'A', text: '16 years', isCorrect: false },
          { label: 'B', text: '20 years', isCorrect: false },
          { label: 'C', text: '24 years', isCorrect: true },
          { label: 'D', text: '32 years', isCorrect: false },
        ],
      },
      {
        prompt: 'If the cost price of 12 pens is equal to the selling price of 8 pens, what is the profit percentage?',
        topicTag: 'Profit & Loss',
        explanation: '12 * CP = 8 * SP => SP / CP = 12 / 8 = 3 / 2. Profit % = ((3 - 2) / 2) * 100 = 50%.',
        options: [
          { label: 'A', text: '33.33%', isCorrect: false },
          { label: 'B', text: '40%', isCorrect: false },
          { label: 'C', text: '50%', isCorrect: true },
          { label: 'D', text: '60%', isCorrect: false },
        ],
      },
      {
        prompt: 'The population of a town increases by 10% annually. If the current population is 121,000, what was the population 2 years ago?',
        topicTag: 'Compound Percentage',
        explanation: 'P * (1.1)^2 = 121,000 => P * 1.21 = 121,000 => P = 100,000.',
        options: [
          { label: 'A', text: '95,000', isCorrect: false },
          { label: 'B', text: '100,000', isCorrect: true },
          { label: 'C', text: '105,000', isCorrect: false },
          { label: 'D', text: '110,000', isCorrect: false },
        ],
      },
      {
        prompt: 'A vendor sells two watches at ₹1920 each. On one he gains 20% and on the other he loses 20%. What is his overall gain or loss percentage?',
        topicTag: 'Common Gain Loss',
        explanation: 'When two articles are sold at the same SP with equal gain % and loss % of x%, there is always a loss of (x / 10)^2 % = (20 / 10)^2 = 4% loss.',
        options: [
          { label: 'A', text: 'No profit no loss', isCorrect: false },
          { label: 'B', text: '4% gain', isCorrect: false },
          { label: 'C', text: '4% loss', isCorrect: true },
          { label: 'D', text: '2% loss', isCorrect: false },
        ],
      },
      {
        prompt: 'A student multiplied a number by 3/5 instead of 5/3. What is the percentage error in the calculation?',
        topicTag: 'Percentage Error',
        explanation: 'Let number = 15. Expected = 15 * (5/3) = 25. Actual = 15 * (3/5) = 9. Error = 25 - 9 = 16. % error = (16 / 25) * 100 = 64%.',
        options: [
          { label: 'A', text: '54%', isCorrect: false },
          { label: 'B', text: '64%', isCorrect: true },
          { label: 'C', text: '44%', isCorrect: false },
          { label: 'D', text: '34%', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the compound interest on ₹10,000 for 2 years at 10% per annum compounded annually.',
        topicTag: 'Compound Interest',
        explanation: 'Amount = 10,000 * (1 + 0.10)^2 = 10,000 * 1.21 = ₹12,100. CI = 12,100 - 10,000 = ₹2,100.',
        options: [
          { label: 'A', text: '₹2,000', isCorrect: false },
          { label: 'B', text: '₹2,100', isCorrect: true },
          { label: 'C', text: '₹2,200', isCorrect: false },
          { label: 'D', text: '₹2,500', isCorrect: false },
        ],
      },
      {
        prompt: 'A trader buys sugar at ₹40/kg and marks it up by 25%. If he sells it at a 10% discount, what is his selling price per kg?',
        topicTag: 'Markup & Discount',
        explanation: 'MP = 40 * 1.25 = ₹50/kg. SP = 50 * (1 - 0.10) = ₹45/kg.',
        options: [
          { label: 'A', text: '₹44', isCorrect: false },
          { label: 'B', text: '₹45', isCorrect: true },
          { label: 'C', text: '₹46', isCorrect: false },
          { label: 'D', text: '₹48', isCorrect: false },
        ],
      },
      {
        prompt: 'If A earns 25% more than B, then B earns what percent less than A?',
        topicTag: 'Percentages Comparison',
        explanation: 'Let B = 100, A = 125. Difference = 25. % less = (25 / 125) * 100 = 20%.',
        options: [
          { label: 'A', text: '20%', isCorrect: true },
          { label: 'B', text: '25%', isCorrect: false },
          { label: 'C', text: '16.67%', isCorrect: false },
          { label: 'D', text: '33.33%', isCorrect: false },
        ],
      },
      {
        prompt: 'A reduction of 20% in the price of apples enables a customer to purchase 2 kg more apples for ₹240. What was the original price per kg?',
        topicTag: 'Price & Consumption',
        explanation: 'Money saved = 20% of 240 = ₹48. This buys 2 kg apples at reduced price => Reduced price = 48 / 2 = ₹24/kg. Original price = 24 / 0.80 = ₹30/kg.',
        options: [
          { label: 'A', text: '₹24', isCorrect: false },
          { label: 'B', text: '₹28', isCorrect: false },
          { label: 'C', text: '₹30', isCorrect: true },
          { label: 'D', text: '₹32', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 2. QUANT: Time, Work & Cisterns
  // -------------------------------------------------------------
  {
    title: 'Quant Mastery: Time, Work & Cisterns',
    slug: 'quant-time-work-pipes',
    description: 'Solve questions on worker efficiency, individual vs group productivity, alternating workdays, and inlet/outlet tank filling rates.',
    category: 'QUANT',
    difficulty: 'MEDIUM',
    durationMinutes: 30,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'A can complete a piece of work in 12 days, while B can complete the same work in 18 days. If they work together, how many days will they take?',
        topicTag: 'Time & Work',
        explanation: '1/A + 1/B = 1/12 + 1/18 = (3 + 2)/36 = 5/36. Total days = 36 / 5 = 7.2 days.',
        options: [
          { label: 'A', text: '6.5 days', isCorrect: false },
          { label: 'B', text: '7.2 days', isCorrect: true },
          { label: 'C', text: '7.5 days', isCorrect: false },
          { label: 'D', text: '8 days', isCorrect: false },
        ],
      },
      {
        prompt: 'A is twice as efficient as B. If together they finish a task in 14 days, in how many days can A alone finish the task?',
        topicTag: 'Efficiency',
        explanation: 'Ratio of efficiency A:B = 2:1. Total efficiency = 3 units/day. Total work = 3 * 14 = 42 units. Time for A = 42 / 2 = 21 days.',
        options: [
          { label: 'A', text: '21 days', isCorrect: true },
          { label: 'B', text: '28 days', isCorrect: false },
          { label: 'C', text: '35 days', isCorrect: false },
          { label: 'D', text: '42 days', isCorrect: false },
        ],
      },
      {
        prompt: 'Pipe A can fill a tank in 20 hours and Pipe B can fill it in 30 hours. If both pipes are opened simultaneously, how long does it take to fill the tank?',
        topicTag: 'Pipes & Cisterns',
        explanation: 'Rate = 1/20 + 1/30 = (3 + 2)/60 = 5/60 = 1/12. Time = 12 hours.',
        options: [
          { label: 'A', text: '10 hours', isCorrect: false },
          { label: 'B', text: '12 hours', isCorrect: true },
          { label: 'C', text: '15 hours', isCorrect: false },
          { label: 'D', text: '25 hours', isCorrect: false },
        ],
      },
      {
        prompt: 'Pipe A fills a cistern in 8 hours, but due to a leak at the bottom, it takes 10 hours. In how many hours will the leak empty the full cistern?',
        topicTag: 'Leakage',
        explanation: 'Leak rate = 1/8 - 1/10 = (5 - 4)/40 = 1/40. Time to empty = 40 hours.',
        options: [
          { label: 'A', text: '32 hours', isCorrect: false },
          { label: 'B', text: '36 hours', isCorrect: false },
          { label: 'C', text: '40 hours', isCorrect: true },
          { label: 'D', text: '48 hours', isCorrect: false },
        ],
      },
      {
        prompt: '12 men can complete a project in 16 days. How many men are required to complete the same project in 8 days?',
        topicTag: 'Men & Days',
        explanation: 'M1 * D1 = M2 * D2 => 12 * 16 = M2 * 8 => M2 = (12 * 16) / 8 = 24 men.',
        options: [
          { label: 'A', text: '18 men', isCorrect: false },
          { label: 'B', text: '20 men', isCorrect: false },
          { label: 'C', text: '24 men', isCorrect: true },
          { label: 'D', text: '32 men', isCorrect: false },
        ],
      },
      {
        prompt: 'A and B can do a work in 10 days and 15 days respectively. They started together, but after 3 days B left. In how many more days will A complete the remaining work?',
        topicTag: 'Leaving Work',
        explanation: 'Work done in 3 days = 3 * (1/10 + 1/15) = 3 * (5/30) = 1/2. Remaining work = 1/2. Time for A = (1/2) / (1/10) = 5 days.',
        options: [
          { label: 'A', text: '4 days', isCorrect: false },
          { label: 'B', text: '5 days', isCorrect: true },
          { label: 'C', text: '6 days', isCorrect: false },
          { label: 'D', text: '7 days', isCorrect: false },
        ],
      },
      {
        prompt: 'A can do a work in 16 days and B in 12 days. With the help of C, they did the work in 4 days. If the total payment is ₹1200, what is C’s share?',
        topicTag: 'Wages Sharing',
        explanation: 'C’s 1 day work = 1/4 - (1/16 + 1/12) = 1/4 - 7/48 = 5/48. Ratio of work done in 4 days by A, B, C = (4/16) : (4/12) : (4 * 5/48) = 1/4 : 1/3 : 5/12 = 3 : 4 : 5. Total parts = 12. C’s share = (5/12) * 1200 = ₹500.',
        options: [
          { label: 'A', text: '₹300', isCorrect: false },
          { label: 'B', text: '₹400', isCorrect: false },
          { label: 'C', text: '₹500', isCorrect: true },
          { label: 'D', text: '₹600', isCorrect: false },
        ],
      },
      {
        prompt: 'Pipe A can fill a tank in 15 minutes, Pipe B in 20 minutes, and Pipe C can empty it in 30 minutes. If all three are opened together, the tank is filled in:',
        topicTag: 'Inlet Outlet',
        explanation: 'Combined rate = 1/15 + 1/20 - 1/30 = (4 + 3 - 2)/60 = 5/60 = 1/12. Time = 12 minutes.',
        options: [
          { label: 'A', text: '10 min', isCorrect: false },
          { label: 'B', text: '12 min', isCorrect: true },
          { label: 'C', text: '14 min', isCorrect: false },
          { label: 'D', text: '16 min', isCorrect: false },
        ],
      },
      {
        prompt: 'A works thrice as fast as B and is therefore able to finish a job in 60 days less than B. Find the time in which they can do it together.',
        topicTag: 'Efficiency Differential',
        explanation: 'Time ratio A:B = 1:3. Difference = 2 units = 60 days => 1 unit = 30 days (A = 30, B = 90). Together = (30 * 90) / 120 = 22.5 days.',
        options: [
          { label: 'A', text: '20 days', isCorrect: false },
          { label: 'B', text: '22.5 days', isCorrect: true },
          { label: 'C', text: '25 days', isCorrect: false },
          { label: 'D', text: '30 days', isCorrect: false },
        ],
      },
      {
        prompt: 'If 6 men and 8 boys can do a piece of work in 10 days, while 26 men and 48 boys can do the same in 2 days, then the time taken by 15 men and 20 boys in doing the same work is:',
        topicTag: 'Men and Boys',
        explanation: '10 * (6M + 8B) = 2 * (26M + 48B) => 60M + 80B = 52M + 96B => 8M = 16B => 1M = 2B. Total work = 10 * (12B + 8B) = 200B days. 15M + 20B = 30B + 20B = 50B. Days = 200 / 50 = 4 days.',
        options: [
          { label: 'A', text: '4 days', isCorrect: true },
          { label: 'B', text: '5 days', isCorrect: false },
          { label: 'C', text: '6 days', isCorrect: false },
          { label: 'D', text: '7 days', isCorrect: false },
        ],
      },
      {
        prompt: 'A can do a job in 20 days and B in 30 days. They work on alternate days starting with A. In how many days will the work be completed?',
        topicTag: 'Alternate Days',
        explanation: 'LCM(20, 30) = 60 units. A = 3 units/day, B = 2 units/day. In 2 days = 5 units. 12 cycles (24 days) = 12 * 5 = 60 units. Total days = 24 days.',
        options: [
          { label: 'A', text: '22 days', isCorrect: false },
          { label: 'B', text: '24 days', isCorrect: true },
          { label: 'C', text: '25 days', isCorrect: false },
          { label: 'D', text: '26 days', isCorrect: false },
        ],
      },
      {
        prompt: 'Two pipes can fill a cistern in 14 hours and 16 hours respectively. The pipes are opened simultaneously and it is found that due to leakage in the bottom, it took 32 minutes more to fill the cistern. When the cistern is full, in what time will the leak empty it?',
        topicTag: 'Cistern & Leak',
        explanation: 'Normal time = (14 * 16) / 30 = 224/30 = 7 hours 28 min. With leak = 7 hr 28 min + 32 min = 8 hours. Leak rate = 15/112 - 1/8 = (15 - 14)/112 = 1/112. Time = 112 hours.',
        options: [
          { label: 'A', text: '96 hours', isCorrect: false },
          { label: 'B', text: '112 hours', isCorrect: true },
          { label: 'C', text: '120 hours', isCorrect: false },
          { label: 'D', text: '128 hours', isCorrect: false },
        ],
      },
      {
        prompt: 'A, B and C can do a piece of work in 20, 30 and 60 days respectively. In how many days can A do the work if he is assisted by B and C on every third day?',
        topicTag: 'Periodic Assistance',
        explanation: 'Work = 60 units. A = 3, B = 2, C = 1. Day 1: A (3), Day 2: A (3), Day 3: A+B+C (6). 3 days = 12 units. 60 / 12 = 5 cycles => 5 * 3 = 15 days.',
        options: [
          { label: 'A', text: '12 days', isCorrect: false },
          { label: 'B', text: '15 days', isCorrect: true },
          { label: 'C', text: '16 days', isCorrect: false },
          { label: 'D', text: '18 days', isCorrect: false },
        ],
      },
      {
        prompt: 'A contractor undertakes to build a road in 40 days and employs 25 men. After 24 days, he finds that only 1/3 of the road is made. How many extra men must he employ so that the work is completed on time?',
        topicTag: 'Contractor Work',
        explanation: 'Work remaining = 2/3. Days remaining = 40 - 24 = 16. (25 * 24) / (1/3) = (M * 16) / (2/3) => 600 * 3 = (16M * 3) / 2 => 1800 = 24M => M = 75. Extra men = 75 - 25 = 50 men.',
        options: [
          { label: 'A', text: '40 men', isCorrect: false },
          { label: 'B', text: '45 men', isCorrect: false },
          { label: 'C', text: '50 men', isCorrect: true },
          { label: 'D', text: '60 men', isCorrect: false },
        ],
      },
      {
        prompt: 'Three taps A, B, and C can fill a tank in 12, 15 and 20 hours respectively. If tap A is open all the time and B and C are open for one hour each alternately, the tank will be full in:',
        topicTag: 'Alternate Taps',
        explanation: 'Tank = 60 units. A = 5, B = 4, C = 3. Hour 1 (A+B) = 9 units. Hour 2 (A+C) = 8 units. 2 hours = 17 units. 3 cycles (6 hours) = 51 units. Remaining = 9 units. Hour 7 (A+B) does 9 units. Total = 7 hours.',
        options: [
          { label: 'A', text: '6.5 hours', isCorrect: false },
          { label: 'B', text: '7 hours', isCorrect: true },
          { label: 'C', text: '7.5 hours', isCorrect: false },
          { label: 'D', text: '8 hours', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 3. QUANT: Time, Speed, Distance & Trains
  // -------------------------------------------------------------
  {
    title: 'Quant Mastery: Time, Speed, Distance & Trains',
    slug: 'quant-time-speed-distance',
    description: 'Relative speed calculations, train crossing platforms/poles, upstream & downstream river currents, and circular racetracks.',
    category: 'QUANT',
    difficulty: 'MEDIUM',
    durationMinutes: 30,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'A train 150 meters long is travelling at a speed of 54 km/h. How many seconds will it take to cross an electric pole?',
        topicTag: 'Trains',
        explanation: 'Speed in m/s = 54 * (5/18) = 15 m/s. Time = Distance / Speed = 150 / 15 = 10 seconds.',
        options: [
          { label: 'A', text: '8 seconds', isCorrect: false },
          { label: 'B', text: '10 seconds', isCorrect: true },
          { label: 'C', text: '12 seconds', isCorrect: false },
          { label: 'D', text: '15 seconds', isCorrect: false },
        ],
      },
      {
        prompt: 'A car covers a distance of 120 km at 60 km/h and returns at 40 km/h. What is the average speed of the car for the entire journey?',
        topicTag: 'Average Speed',
        explanation: 'Average speed = (2 * S1 * S2) / (S1 + S2) = (2 * 60 * 40) / (60 + 40) = 4800 / 100 = 48 km/h.',
        options: [
          { label: 'A', text: '48 km/h', isCorrect: true },
          { label: 'B', text: '50 km/h', isCorrect: false },
          { label: 'C', text: '52 km/h', isCorrect: false },
          { label: 'D', text: '54 km/h', isCorrect: false },
        ],
      },
      {
        prompt: 'A boat can travel with a speed of 13 km/h in still water. If the speed of the stream is 4 km/h, find the time taken by the boat to go 68 km downstream.',
        topicTag: 'Boats & Streams',
        explanation: 'Downstream speed = 13 + 4 = 17 km/h. Time = 68 / 17 = 4 hours.',
        options: [
          { label: 'A', text: '3 hours', isCorrect: false },
          { label: 'B', text: '4 hours', isCorrect: true },
          { label: 'C', text: '5 hours', isCorrect: false },
          { label: 'D', text: '5.5 hours', isCorrect: false },
        ],
      },
      {
        prompt: 'Two trains running in opposite directions cross each other in 12 seconds. Their lengths are 140 m and 160 m respectively. If the speed of the first train is 40 km/h, find the speed of the second train.',
        topicTag: 'Relative Speed',
        explanation: 'Total distance = 140 + 160 = 300 m. Relative speed = 300 / 12 = 25 m/s = 25 * (18/5) = 90 km/h. S2 = 90 - 40 = 50 km/h.',
        options: [
          { label: 'A', text: '45 km/h', isCorrect: false },
          { label: 'B', text: '50 km/h', isCorrect: true },
          { label: 'C', text: '55 km/h', isCorrect: false },
          { label: 'D', text: '60 km/h', isCorrect: false },
        ],
      },
      {
        prompt: 'Walking at 3/4 of his usual speed, a man reaches his office 20 minutes late. Find his usual time to reach the office.',
        topicTag: 'Speed & Time Inverse',
        explanation: 'Speed becomes 3/4 => Time becomes 4/3 of usual time T. Extra time = (4/3 - 1)T = T/3 = 20 minutes => T = 60 minutes (1 hour).',
        options: [
          { label: 'A', text: '45 minutes', isCorrect: false },
          { label: 'B', text: '50 minutes', isCorrect: false },
          { label: 'C', text: '60 minutes', isCorrect: true },
          { label: 'D', text: '80 minutes', isCorrect: false },
        ],
      },
      {
        prompt: 'A train 240 m in length crosses a telegraph post in 16 seconds. What is the length of a bridge which it crosses in 30 seconds?',
        topicTag: 'Trains Bridge',
        explanation: 'Speed = 240 / 16 = 15 m/s. In 30 s, distance = 15 * 30 = 450 m. Bridge length = 450 - 240 = 210 m.',
        options: [
          { label: 'A', text: '200 m', isCorrect: false },
          { label: 'B', text: '210 m', isCorrect: true },
          { label: 'C', text: '220 m', isCorrect: false },
          { label: 'D', text: '240 m', isCorrect: false },
        ],
      },
      {
        prompt: 'A man rows to a place 48 km distant and comes back in 14 hours. He finds that he can row 4 km with the stream in the same time as 3 km against the stream. The rate of the stream is:',
        topicTag: 'Boats Upstream Downstream',
        explanation: 'Downstream speed / Upstream speed = 4/3. Let speeds be 4x and 3x. 48/4x + 48/3x = 14 => 12/x + 16/x = 14 => 28/x = 14 => x = 2. Down = 8 km/h, Up = 6 km/h. Stream rate = (8 - 6)/2 = 1 km/h.',
        options: [
          { label: 'A', text: '1 km/h', isCorrect: true },
          { label: 'B', text: '1.5 km/h', isCorrect: false },
          { label: 'C', text: '2 km/h', isCorrect: false },
          { label: 'D', text: '2.5 km/h', isCorrect: false },
        ],
      },
      {
        prompt: 'Two persons start running in opposite directions from the same point on a circular track of circumference 600 m at speeds of 4 m/s and 6 m/s. After how many seconds will they meet for the first time?',
        topicTag: 'Circular Track',
        explanation: 'Relative speed in opposite directions = 4 + 6 = 10 m/s. Time to meet = 600 / 10 = 60 seconds.',
        options: [
          { label: 'A', text: '50 seconds', isCorrect: false },
          { label: 'B', text: '60 seconds', isCorrect: true },
          { label: 'C', text: '75 seconds', isCorrect: false },
          { label: 'D', text: '100 seconds', isCorrect: false },
        ],
      },
      {
        prompt: 'A thief is spotted by a policeman from a distance of 100 meters. When the policeman starts the chase, the thief also starts running. If the speed of the thief is 8 km/h and that of the policeman 10 km/h, how far will the thief have run before he is overtaken?',
        topicTag: 'Chasing Relative Speed',
        explanation: 'Relative speed = 10 - 8 = 2 km/h = 2 * (5/18) = 5/9 m/s. Time to overtake = 100 / (5/9) = 180 seconds. Distance run by thief = 8 * (5/18) * 180 = 400 meters.',
        options: [
          { label: 'A', text: '350 meters', isCorrect: false },
          { label: 'B', text: '400 meters', isCorrect: true },
          { label: 'C', text: '450 meters', isCorrect: false },
          { label: 'D', text: '500 meters', isCorrect: false },
        ],
      },
      {
        prompt: 'Excluding stoppages, the speed of a bus is 54 km/h and including stoppages, it is 45 km/h. For how many minutes does the bus stop per hour?',
        topicTag: 'Stoppages',
        explanation: 'Stoppage time per hour = [(Speed without stoppage - Speed with stoppage) / Speed without stoppage] * 60 = [(54 - 45) / 54] * 60 = (9/54) * 60 = 10 minutes.',
        options: [
          { label: 'A', text: '8 minutes', isCorrect: false },
          { label: 'B', text: '10 minutes', isCorrect: true },
          { label: 'C', text: '12 minutes', isCorrect: false },
          { label: 'D', text: '15 minutes', isCorrect: false },
        ],
      },
      {
        prompt: 'A train leaves Station A at 7:00 AM reaching Station B at 11:00 AM. Another train leaves B at 8:00 AM reaching A at 11:30 AM. At what time do the two trains cross each other?',
        topicTag: 'Meeting Trains',
        explanation: 'Train 1 takes 4 hrs. Train 2 takes 3.5 hrs (7/2 hrs). Let distance = 28 km. Speed 1 = 7 km/h, Speed 2 = 8 km/h. From 7 to 8 AM, Train 1 covers 7 km. Remaining distance at 8 AM = 21 km. Relative speed = 7 + 8 = 15 km/h. Time = 21/15 = 7/5 hrs = 1 hr 24 min. Cross at 8:00 + 1:24 = 9:24 AM.',
        options: [
          { label: 'A', text: '9:15 AM', isCorrect: false },
          { label: 'B', text: '9:24 AM', isCorrect: true },
          { label: 'C', text: '9:36 AM', isCorrect: false },
          { label: 'D', text: '9:45 AM', isCorrect: false },
        ],
      },
      {
        prompt: 'A man travels 35 km partly at 4 km/h and partly at 5 km/h. If he had travelled at 5 km/h when he travelled at 4 km/h and vice versa, he would have covered 2 km more in the same time. The time taken by him for the journey is:',
        topicTag: 'Simultaneous Equations',
        explanation: 'Let t1 and t2 be the times. 4*t1 + 5*t2 = 35. Also 5*t1 + 4*t2 = 37. Adding equations: 9(t1 + t2) = 72 => t1 + t2 = 8 hours.',
        options: [
          { label: 'A', text: '7 hours', isCorrect: false },
          { label: 'B', text: '8 hours', isCorrect: true },
          { label: 'C', text: '9 hours', isCorrect: false },
          { label: 'D', text: '10 hours', isCorrect: false },
        ],
      },
      {
        prompt: 'In a 100 m race, A beats B by 10 m and C by 13 m. In a race of 180 m, by how many meters will B beat C?',
        topicTag: 'Races & Games',
        explanation: 'When A = 100 m, B = 90 m, C = 87 m. When B runs 90 m, C runs 87 m. In 180 m race, C runs (87/90) * 180 = 174 m. B beats C by 180 - 174 = 6 meters.',
        options: [
          { label: 'A', text: '4.5 meters', isCorrect: false },
          { label: 'B', text: '5.4 meters', isCorrect: false },
          { label: 'C', text: '6.0 meters', isCorrect: true },
          { label: 'D', text: '7.2 meters', isCorrect: false },
        ],
      },
      {
        prompt: 'An aeroplane flies along the four sides of a square at the speeds of 100, 200, 300 and 400 km/h. The average speed of the plane around the field is:',
        topicTag: 'Harmonic Mean',
        explanation: 'Let side = 1200 km. Times = 12, 6, 4, 3 hrs. Total distance = 4800 km. Total time = 25 hrs. Avg speed = 4800 / 25 = 192 km/h.',
        options: [
          { label: 'A', text: '192 km/h', isCorrect: true },
          { label: 'B', text: '200 km/h', isCorrect: false },
          { label: 'C', text: '225 km/h', isCorrect: false },
          { label: 'D', text: '250 km/h', isCorrect: false },
        ],
      },
      {
        prompt: 'A motorboat whose speed is 15 km/h in still water goes 30 km downstream and comes back in a total of 4 hours 30 minutes. What is the speed of the stream?',
        topicTag: 'Boats Quadratic',
        explanation: '30/(15 + v) + 30/(15 - v) = 4.5. Testing options: for v = 5, 30/20 + 30/10 = 1.5 + 3 = 4.5 hours. Correct stream speed = 5 km/h.',
        options: [
          { label: 'A', text: '4 km/h', isCorrect: false },
          { label: 'B', text: '5 km/h', isCorrect: true },
          { label: 'C', text: '6 km/h', isCorrect: false },
          { label: 'D', text: '8 km/h', isCorrect: false },
        ],
      },
    ],
  },
];
