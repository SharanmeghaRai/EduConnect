export interface StudyMaterialContent {
  id: string;
  title: string;
  category: 'APTITUDE' | 'TECHNICAL' | 'INTERVIEW_PREP';
  subCategory: string;
  contentType: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'ARTICLE' | 'CHEATSHEET';
  estimatedMinutes: number;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  overview: string;
  keyTakeaways: string[];
  recruiterNotes: string;
  sections: {
    title: string;
    description?: string;
    subsections?: {
      subtitle: string;
      contentHtml: string;
    }[];
  }[];
  practiceQuestions?: {
    question: string;
    options?: string[];
    correctAnswer: string;
    solution: string;
  }[];
}

export const STUDY_MATERIAL_CONTENTS: Record<string, StudyMaterialContent> = {
  // 1. Quantitative Aptitude Formula Master Handbook
  'Quantitative Aptitude Formula Master Handbook': {
    id: 'quant-handbook',
    title: 'Quantitative Aptitude Formula Master Handbook',
    category: 'APTITUDE',
    subCategory: 'QUANT',
    contentType: 'PDF',
    estimatedMinutes: 45,
    difficulty: 'INTERMEDIATE',
    overview:
      'The definitive campus quantitative formula handbook. Master speed-math mental shortcuts, percentage fractions, work equations, speed-distance-train problems, and probability models tested by Tier-1 campus recruiters (TCS NQT, Accenture, Infosys, Cognizant, Wipro).',
    keyTakeaways: [
      'Memorize fraction-to-percentage conversions (1/2 through 1/16) to calculate profit, discount, and interest rates in under 15 seconds.',
      'Always express Work as 1 unit or compute LCM of individual times to assign unit capacities per day.',
      'Relative speed formula: Same direction = (u - v); Opposite direction = (u + v). Remember to convert km/h to m/s by multiplying by 5/18.',
      'Simple Interest = (P × R × T) / 100. For Compound Interest compounded annually: A = P(1 + R/100)^T. Difference between CI & SI for 2 years = P(R/100)^2.',
    ],
    recruiterNotes:
      'Recruiters look for high accuracy in under 60 seconds per question. Candidates using algebraic variables (x, y) take 2.5 minutes; candidates applying ratio and LCM shortcuts solve questions in 45 seconds.',
    sections: [
      {
        title: '1. Percentage & Profit-Loss Master Equations',
        description: 'Core arithmetic relations governing 35% of all campus aptitude exams.',
        subsections: [
          {
            subtitle: 'Fraction to Percentage Speed Reference Table',
            contentHtml: `
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono my-3">
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/2 = 50%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/3 = 33.33%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/4 = 25%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/5 = 20%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/6 = 16.67%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/7 = 14.28%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/8 = 12.5%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/9 = 11.11%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/11 = 9.09%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/12 = 8.33%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/14 = 7.14%</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">1/16 = 6.25%</div>
              </div>
              <p><strong>Successive Percentage Formula:</strong> Net effect of successive changes <em>a%</em> and <em>b%</em> is:</p>
              <div class="p-3 bg-brand-50/50 dark:bg-brand-950/40 rounded border border-brand-200 dark:border-brand-800 font-mono text-center my-2">
                Net % Change = a + b + (a × b) / 100
              </div>
              <p><em>Example:</em> Price increased by 20%, then decreased by 10%. Net = 20 - 10 + (20 × -10)/100 = 10 - 2 = +8% increase.</p>
            `,
          },
          {
            subtitle: 'Profit, Loss, and Marked Price Equations',
            contentHtml: `
              <ul class="list-disc pl-5 space-y-1.5 text-xs">
                <li><strong>Profit %</strong> = (Profit / Cost Price) × 100</li>
                <li><strong>Loss %</strong> = (Loss / Cost Price) × 100</li>
                <li><strong>Selling Price (SP)</strong> = Cost Price × (100 + Profit%) / 100</li>
                <li><strong>Discount %</strong> = [(Marked Price - Selling Price) / Marked Price] × 100</li>
                <li><strong>Faulty Weights:</strong> Gain % = [Error / (True Value - Error)] × 100</li>
              </ul>
            `,
          },
        ],
      },
      {
        title: '2. Time, Work & Pipes/Cisterns',
        description: 'Unit capacity method to eliminate fractional addition.',
        subsections: [
          {
            subtitle: 'The LCM Unit Efficiency Method',
            contentHtml: `
              <p>Never solve using <code>1/A + 1/B = 1/T</code>. Instead:</p>
              <ol class="list-decimal pl-5 space-y-1 my-2 text-xs">
                <li>Find LCM of individual completion times — this represents <strong>Total Work Units</strong>.</li>
                <li>Divide Total Units by each person's days to find their <strong>Efficiency (Units/Day)</strong>.</li>
                <li>Add individual efficiencies to get combined daily work.</li>
                <li>Total Days = Total Work Units / Combined Efficiency.</li>
              </ol>
              <div class="p-3 bg-slate-100 dark:bg-slate-800 rounded text-xs mt-2">
                <strong>Worked Pattern:</strong> A takes 12 days, B takes 18 days.<br/>
                • LCM(12, 18) = 36 Units.<br/>
                • A efficiency = 36 / 12 = 3 units/day.<br/>
                • B efficiency = 36 / 18 = 2 units/day.<br/>
                • Combined = 5 units/day.<br/>
                • Total days = 36 / 5 = <strong>7.2 days</strong>.
              </div>
            `,
          },
        ],
      },
      {
        title: '3. Speed, Distance, Trains & Boats',
        description: 'Conversion rates and relative motion physics.',
        subsections: [
          {
            subtitle: 'Speed Conversion & Relative Speed Rules',
            contentHtml: `
              <p>• <strong>1 km/h = 5/18 m/s</strong> (e.g., 72 km/h = 72 × 5/18 = 20 m/s)<br/>
              • <strong>1 m/s = 18/5 km/h</strong></p>
              <p class="mt-2"><strong>Crossing Objects:</strong></p>
              <ul class="list-disc pl-5 space-y-1 text-xs">
                <li>Crossing a pole/standing person: Distance = Length of Train (L).</li>
                <li>Crossing a platform/bridge: Distance = Length of Train (L1) + Length of Platform (L2).</li>
                <li>Opposite Direction Trains: Relative Speed = S1 + S2; Distance = L1 + L2.</li>
                <li>Same Direction Trains: Relative Speed = |S1 - S2|; Distance = L1 + L2.</li>
              </ul>
              <p class="mt-2"><strong>Boats & Streams:</strong></p>
              <p>Let boat speed in still water = <em>u</em>, stream speed = <em>v</em>.<br/>
              • Downstream Speed (D) = u + v<br/>
              • Upstream Speed (U) = u - v<br/>
              • Boat Speed <em>u</em> = (D + U) / 2<br/>
              • Stream Speed <em>v</em> = (D - U) / 2</p>
            `,
          },
        ],
      },
    ],
    practiceQuestions: [
      {
        question:
          'A train 180 meters long is travelling at 54 km/h. How many seconds will it take to pass a bridge 360 meters long?',
        options: ['24 seconds', '36 seconds', '40 seconds', '30 seconds'],
        correctAnswer: '36 seconds',
        solution:
          'Total distance = Train length + Bridge length = 180 + 360 = 540 m. Speed = 54 km/h = 54 × (5/18) = 15 m/s. Time = Distance / Speed = 540 / 15 = 36 seconds.',
      },
      {
        question:
          'A sum of money doubles itself in 5 years at simple interest. In how many years will it become four times itself at the same rate of interest?',
        options: ['10 years', '15 years', '20 years', '25 years'],
        correctAnswer: '15 years',
        solution:
          'Doubling means SI = P in 5 years. For the sum to become 4 times, the total SI needed is 3P. Since simple interest accumulates linearly, time needed = 3 × 5 = 15 years.',
      },
    ],
  },

  // 2. Logical Reasoning: Seating Arrangements & Puzzles Blueprint
  'Logical Reasoning: Seating Arrangements & Puzzles Blueprint': {
    id: 'logical-puzzles',
    title: 'Logical Reasoning: Seating Arrangements & Puzzles Blueprint',
    category: 'APTITUDE',
    subCategory: 'LOGICAL',
    contentType: 'DOCUMENT',
    estimatedMinutes: 30,
    difficulty: 'ADVANCED',
    overview:
      'Step-by-step methodology to deconstruct circular, rectangular, linear, and multi-floor seating puzzle constraints without confusion or backtracking. Tested by TCS Digital, Infosys, and Cognizant.',
    keyTakeaways: [
      'Always start with absolute statements (e.g. "X sits at the extreme right end" or "P is on floor 3"). Never start with ambiguous relative statements.',
      'For circular tables: when facing center, Left is Clockwise, Right is Counter-Clockwise. If facing outward, directions reverse.',
      'Draw two parallel candidate diagrams simultaneously when encountering a bifurcating condition (e.g., A is 2nd to the left of B, but B can be in position 2 or 6). Prune the invalid diagram as soon as a contradiction emerges.',
      'In blood relations mixed with seating, decode gender first (+ for male, - for female) and generational hierarchy before assigning table seats.',
    ],
    recruiterNotes:
      'Candidates who fail puzzles usually do so because they erase their scratch paper repeatedly. High performers maintain structured constraint matrices and bifurcated trees.',
    sections: [
      {
        title: '1. The 4-Step Analytical Framework',
        description: 'Standard operating procedure for complex arrangement questions.',
        subsections: [
          {
            subtitle: 'Phase 1 to Phase 4 Execution Flow',
            contentHtml: `
              <div class="space-y-3 text-xs">
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <strong class="text-brand-600 dark:text-brand-400">Step 1: Constraint Classification</strong><br/>
                  Scan the paragraph and tag each clue as:
                  <ul class="list-disc pl-5 mt-1 space-y-0.5">
                    <li><strong>[A] Absolute:</strong> Position is definitively pinned (e.g., "K is on the 5th floor").</li>
                    <li><strong>[R] Relative:</strong> Conditional to another entity (e.g., "M is 3 places away from K").</li>
                    <li><strong>[N] Negative:</strong> Prohibition clues (e.g., "Neither R nor S likes Blue").</li>
                  </ul>
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <strong class="text-brand-600 dark:text-brand-400">Step 2: Skeletal Template</strong><br/>
                  Draw 8 seats for circular (numbered 1 to 8) or 8 floor boxes. Insert all [A] clues immediately.
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <strong class="text-brand-600 dark:text-brand-400">Step 3: Branch Dual Cases</strong><br/>
                  If a clue says "P sits adjacent to Q" and Q is in slot 4, fork Case 1 (P in 3) and Case 2 (P in 5). Run both concurrently.
                </div>
                <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-200 dark:border-slate-700">
                  <strong class="text-brand-600 dark:text-brand-400">Step 4: Contradiction Elimination</strong><br/>
                  A [N] negative clue will immediately invalidate one case. Cross it out and finalize the valid configuration.
                </div>
              </div>
            `,
          },
        ],
      },
    ],
    practiceQuestions: [
      {
        question:
          'Eight persons (A, B, C, D, E, F, G, H) are sitting around a circular table facing center. A is second to the right of B. C is third to the left of A. D is not an immediate neighbor of B. Who is sitting opposite to A?',
        options: ['C', 'D', 'E', 'G'],
        correctAnswer: 'C',
        solution:
          'Let B be at position 1. A (2nd to right) is at position 3. C (3rd to left of A) moves clockwise: 3 -> 2 -> 1 -> 8 (position 7/8). In an 8-person symmetric circle, opposite of position 3 is position 3 + 4 = position 7, which corresponds to C.',
      },
    ],
  },

  // 3. Verbal Ability: Top 100 Grammatical Errors in Campus Exams
  'Verbal Ability: Top 100 Grammatical Errors in Campus Exams': {
    id: 'verbal-grammar',
    title: 'Verbal Ability: Top 100 Grammatical Errors in Campus Exams',
    category: 'APTITUDE',
    subCategory: 'VERBAL',
    contentType: 'CHEATSHEET',
    estimatedMinutes: 20,
    difficulty: 'BEGINNER',
    overview:
      'High-yield quick reference sheet targeting recurring grammatical pitfalls, subject-verb agreement traps, modifier placement, parallel structures, and conditional tenses tested in TCS, Infosys, and Cognizant verbal sections.',
    keyTakeaways: [
      'Phrases like "along with", "as well as", "together with", and "in addition to" do NOT alter the number of the subject. E.g. "The manager, along with his engineers, WAS present" (not were).',
      'When two subjects are joined by "either...or" or "neither...nor", the verb agrees with the subject CLOSER to it.',
      'Dangling Modifier Trap: An introductory participial phrase must modify the noun immediately following the comma. (Incorrect: "Walking down the street, a falling mango hit John." Correct: "Walking down the street, John was hit by a falling mango.")',
      'The subjunctive mood uses "were" regardless of singular pronoun: "If I were the CEO..." (never "If I was").',
    ],
    recruiterNotes:
      'Verbal ability tests in campus drives assess professional written communication and precision under pressure. Eliminating 2 obvious grammar traps gives an instant 90+ percentile.',
    sections: [
      {
        title: '1. Subject-Verb Agreement High-Impact Rules',
        description: 'The #1 tested concept across all Indian campus placement verbal screenings.',
        subsections: [
          {
            subtitle: 'Rule 1: Intervening Prepositional Phrases',
            contentHtml: `
              <p>The verb must agree with the true subject, not the object of an intervening preposition:</p>
              <div class="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded text-xs my-2">
                ❌ <em>Incorrect:</em> The quality of these mangoes <strong>are</strong> outstanding.<br/>
                ✅ <em>Correct:</em> The quality of these mangoes <strong>is</strong> outstanding. (Subject is "quality", not mangoes).
              </div>
            `,
          },
          {
            subtitle: 'Rule 2: "Neither of", "Either of", "Each of"',
            contentHtml: `
              <p>"Each", "Every", "Neither of", and "Either of" take a <strong>singular verb</strong>:</p>
              <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded text-xs my-2">
                ✅ Neither of the candidates <strong>has</strong> submitted the documents.<br/>
                ✅ Each of the microservices <strong>runs</strong> in an isolated container.
              </div>
            `,
          },
        ],
      },
      {
        title: '2. Parallelism & Verb Tense Consistency',
        description: 'Ensuring balanced sentence structures and correct sequence of events.',
        subsections: [
          {
            subtitle: 'Parallel Structure in Lists',
            contentHtml: `
              <p>Items joined by coordinating conjunctions (and, but, or) must share identical grammatical form:</p>
              <div class="p-2.5 bg-slate-100 dark:bg-slate-800 rounded text-xs my-2">
                ❌ <em>Faulty:</em> She enjoys programming, to write unit tests, and design interfaces.<br/>
                ✅ <em>Parallel:</em> She enjoys <strong>programming</strong>, <strong>writing</strong> unit tests, and <strong>designing</strong> interfaces.
              </div>
            `,
          },
        ],
      },
    ],
    practiceQuestions: [
      {
        question:
          'Identify the error: "Neither the team lead nor the developers (A) / was willing to take responsibility (B) / for the deployment failure (C) / on the production server (D)."',
        options: ['Part A', 'Part B', 'Part C', 'No Error'],
        correctAnswer: 'Part B',
        solution:
          'In "Neither...nor" constructions, the verb agrees with the closer subject. The closer subject is "developers" (plural), so the verb must be "were willing", not "was willing". Hence error is in Part B.',
      },
    ],
  },

  // 4. Data Interpretation: Visual Chart Reading Masterclass
  'Data Interpretation: Visual Chart Reading Masterclass': {
    id: 'data-interpretation',
    title: 'Data Interpretation: Visual Chart Reading Masterclass',
    category: 'APTITUDE',
    subCategory: 'DATA_INT',
    contentType: 'VIDEO',
    estimatedMinutes: 25,
    difficulty: 'INTERMEDIATE',
    overview:
      'Video and interactive breakdown of rapid chart reading. Learn how to estimate percentages from stacked bar charts, spider/radar plots, and multi-slice pie charts without pen-paper calculation overhead.',
    keyTakeaways: [
      'Pie Chart degree-to-percentage conversion factor: 360 degrees = 100%. Therefore, 3.6 degrees = 1%, and 18 degrees = 5%. Multiply degrees by 5/18 to get percentage.',
      'Percentage Growth Rate formula: [(Final Value - Initial Value) / Initial Value] × 100. Never divide by the final value.',
      'Look at the answer options first! If the options are wide apart (e.g. 12%, 24%, 48%, 80%), use round numbers (e.g. approximate 4,892 as 5,000) for instant mental estimation.',
    ],
    recruiterNotes:
      'Data Interpretation questions in Accenture and TCS test visual data literacy and rapid numerical approximation, fundamental skills for modern analytics and software engineering roles.',
    sections: [
      {
        title: '1. Mental Approximation Techniques',
        description: 'Eliminating manual long division under test conditions.',
        subsections: [
          {
            subtitle: 'The 10% and 1% Anchor Method',
            contentHtml: `
              <p>To compute any percentage of a number rapidly:</p>
              <ul class="list-disc pl-5 space-y-1 text-xs my-2">
                <li>10% of 6,480 = <strong>648</strong> (shift decimal left by 1).</li>
                <li>1% of 6,480 = <strong>64.8</strong> (shift decimal left by 2).</li>
                <li>To find 23% of 6,480: (2 × 10%) + (3 × 1%) = (2 × 648) + (3 × 64.8) = 1296 + 194.4 = <strong>1490.4</strong>.</li>
              </ul>
            `,
          },
        ],
      },
    ],
  },

  // 5. Data Structures & Algorithms: The Essential 75 Patterns
  'Data Structures & Algorithms: The Essential 75 Patterns': {
    id: 'dsa-75-patterns',
    title: 'Data Structures & Algorithms: The Essential 75 Patterns',
    category: 'TECHNICAL',
    subCategory: 'CS_CORE',
    contentType: 'CHEATSHEET',
    estimatedMinutes: 60,
    difficulty: 'ADVANCED',
    overview:
      'The definitive breakdown of foundational DSA interview patterns: Two Pointers, Sliding Window, Fast & Slow Pointers, BFS/DFS, Top K Elements, and Dynamic Programming state transitions. Covers 90% of technical coding interview problems.',
    keyTakeaways: [
      'Sliding Window is optimal for contiguous subarray or substring problems requiring min/max/target conditions (reduces O(N^2) to O(N)).',
      'Fast & Slow Pointers (Floyd\'s Cycle Detection) detects cycles in linked lists and arrays in O(N) time and O(1) auxiliary space.',
      'Two Heaps Pattern (Min-Heap + Max-Heap) maintains the median of a dynamically incoming number stream in O(log N) insert time.',
      'Dynamic Programming: Always write out the 3 components: 1) State definition (e.g. dp[i] is min cost up to index i), 2) Recurrence relation, 3) Base cases.',
    ],
    recruiterNotes:
      'Recruiters look for candidates who identify the algorithmic pattern within 60 seconds rather than writing a naive brute-force O(N^2) double-loop.',
    sections: [
      {
        title: '1. Two Pointers & Sliding Window Patterns',
        description: 'Linear time optimizations for sequence traversals.',
        subsections: [
          {
            subtitle: 'Sliding Window Template (Python & C++)',
            contentHtml: `
              <p>Standard template for variable-size sliding window:</p>
              <pre><code class="language-python">def max_subarray_sum(nums, k):
    max_sum = 0
    window_sum = 0
    left = 0
    
    for right in range(len(nums)):
        window_sum += nums[right] # expand window
        
        while window_needs_shrink(window_sum, k):
            window_sum -= nums[left] # shrink window
            left += 1
            
        max_sum = max(max_sum, window_sum)
    return max_sum</code></pre>
            `,
          },
        ],
      },
      {
        title: '2. Graph & Tree Traversal Complexities',
        description: 'BFS for shortest path in unweighted graphs; DFS for exhaustively searching paths.',
        subsections: [
          {
            subtitle: 'Complexity Cheat Sheet',
            contentHtml: `
              <div class="overflow-x-auto text-xs my-2">
                <table class="w-full border-collapse border border-slate-200 dark:border-slate-700">
                  <thead class="bg-slate-100 dark:bg-slate-800">
                    <tr>
                      <th class="border p-2 text-left">Algorithm</th>
                      <th class="border p-2 text-left">Time Complexity</th>
                      <th class="border p-2 text-left">Space Complexity</th>
                      <th class="border p-2 text-left">Primary Use Case</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border p-2 font-mono">BFS (Breadth-First)</td>
                      <td class="border p-2 font-mono">O(V + E)</td>
                      <td class="border p-2 font-mono">O(V)</td>
                      <td class="border p-2">Shortest path in unweighted graph</td>
                    </tr>
                    <tr>
                      <td class="border p-2 font-mono">DFS (Depth-First)</td>
                      <td class="border p-2 font-mono">O(V + E)</td>
                      <td class="border p-2 font-mono">O(V)</td>
                      <td class="border p-2">Cycle detection, topological sort</td>
                    </tr>
                    <tr>
                      <td class="border p-2 font-mono">Dijkstra's Algorithm</td>
                      <td class="border p-2 font-mono">O((V + E) log V)</td>
                      <td class="border p-2 font-mono">O(V)</td>
                      <td class="border p-2">Shortest path with non-negative weights</td>
                    </tr>
                    <tr>
                      <td class="border p-2 font-mono">Binary Search</td>
                      <td class="border p-2 font-mono">O(log N)</td>
                      <td class="border p-2 font-mono">O(1)</td>
                      <td class="border p-2">Search in sorted space or monotonic functions</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            `,
          },
        ],
      },
    ],
  },

  // 6. Database Management Systems & SQL Top 50 Interview Queries
  'Database Management Systems & SQL Top 50 Interview Queries': {
    id: 'dbms-sql',
    title: 'Database Management Systems & SQL Top 50 Interview Queries',
    category: 'TECHNICAL',
    subCategory: 'CS_CORE',
    contentType: 'DOCUMENT',
    estimatedMinutes: 35,
    difficulty: 'INTERMEDIATE',
    overview:
      'Practice guide covering second highest salary, self-joins, window functions (ROW_NUMBER, DENSE_RANK), transactions, ACID properties, and index tuning asked in technical rounds.',
    keyTakeaways: [
      'To find Nth highest salary: Use DENSE_RANK() OVER (ORDER BY salary DESC) as rnk WHERE rnk = N. Avoid naive LIMIT 1 OFFSET N-1 because of duplicates.',
      'ACID: Atomicity (all or nothing), Consistency (preserves invariants), Isolation (concurrent execution feels serial), Durability (committed data survives crashes).',
      'Clustered Index determines physical storage order of rows (only 1 per table); Non-Clustered index creates a separate B-tree pointing to row locators.',
      'Delete vs Truncate vs Drop: DELETE is DML (logged, can rollback, row by row); TRUNCATE is DDL (fast deallocation, cannot rollback easily); DROP removes structure and data entirely.',
    ],
    recruiterNotes:
      'SQL questions are mandatory in 95% of campus technical interviews. Writing syntactically correct window functions immediately distinguishes candidates from self-taught basics.',
    sections: [
      {
        title: '1. Top 5 Recurring Campus Interview Queries',
        description: 'Exact SQL statements asked in Amazon, Infosys, and Cognizant technical screens.',
        subsections: [
          {
            subtitle: 'Query 1: Second Highest Salary with DENSE_RANK',
            contentHtml: `
              <pre><code class="language-sql">WITH RankedSalaries AS (
    SELECT 
        employee_id, 
        salary, 
        DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos
    FROM employees
)
SELECT salary 
FROM RankedSalaries 
WHERE rank_pos = 2;</code></pre>
            `,
          },
          {
            subtitle: 'Query 2: Finding and Deleting Duplicate Rows',
            contentHtml: `
              <pre><code class="language-sql">DELETE FROM employees
WHERE id NOT IN (
    SELECT MIN(id)
    FROM employees
    GROUP BY email
);</code></pre>
            `,
          },
          {
            subtitle: 'Query 3: Self-Join for Employee-Manager Hierarchy',
            contentHtml: `
              <pre><code class="language-sql">SELECT 
    e.name AS Employee_Name, 
    m.name AS Manager_Name
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;</code></pre>
            `,
          },
        ],
      },
    ],
  },

  // 7. Operating Systems: Threads, Deadlocks & Virtual Memory
  'Operating Systems: Threads, Deadlocks & Virtual Memory': {
    id: 'os-threads-deadlocks',
    title: 'Operating Systems: Threads, Deadlocks & Virtual Memory',
    category: 'TECHNICAL',
    subCategory: 'CS_CORE',
    contentType: 'PDF',
    estimatedMinutes: 40,
    difficulty: 'INTERMEDIATE',
    overview:
      'Concise summary of process synchronization, semaphores vs mutexes, Banker\'s algorithm, page replacement (LRU, FIFO), and paging overheads.',
    keyTakeaways: [
      'Process has its own memory space (code, data, heap, stack); Threads share code, data, and heap, but have independent stacks and registers.',
      'Deadlock 4 Conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait. Breaking ANY ONE condition prevents deadlocks.',
      'Mutex is a locking mechanism (only 1 thread owns it at a time); Semaphore is a signaling mechanism (counter allows N concurrent accesses).',
      'Virtual Memory allows execution of processes larger than physical RAM via demand paging and translation lookaside buffers (TLB).',
    ],
    recruiterNotes:
      'Campus interviewers often ask: "Explain what happens in hardware and OS when a thread encounters a Page Fault."',
    sections: [
      {
        title: '1. CPU Scheduling & Turnaround Time Calculations',
        description: 'Formulas for Round Robin, SJF, and priority queues.',
        subsections: [
          {
            subtitle: 'Key Scheduling Metrics',
            contentHtml: `
              <ul class="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Turnaround Time (TAT)</strong> = Completion Time - Arrival Time</li>
                <li><strong>Waiting Time (WT)</strong> = Turnaround Time - Burst Time</li>
                <li><strong>Response Time</strong> = Time of first CPU allocation - Arrival Time</li>
              </ul>
            `,
          },
        ],
      },
    ],
  },

  // 8. Computer Networks: OSI Layers & Protocol Deep-Dive
  'Computer Networks: OSI Layers & Protocol Deep-Dive': {
    id: 'networks-osi',
    title: 'Computer Networks: OSI Layers & Protocol Deep-Dive',
    category: 'TECHNICAL',
    subCategory: 'CS_CORE',
    contentType: 'DOCUMENT',
    estimatedMinutes: 30,
    difficulty: 'INTERMEDIATE',
    overview:
      'Clear explanations of TCP 3-way handshake, UDP vs TCP, DNS resolution lifecycle, HTTP/HTTPS SSL handshake, and subnetting calculations.',
    keyTakeaways: [
      'TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK. Ensures reliable, in-order, flow-controlled transmission.',
      'TCP vs UDP: TCP is connection-oriented, reliable, with congestion control; UDP is connectionless, fast, lightweight (DNS, video streaming, VoIP).',
      'Subnetting formula: Valid hosts per subnet = 2^(32 - prefix) - 2 (subtract 2 for Network ID and Broadcast IP). E.g. /24 has 254 usable hosts.',
      'HTTPS uses asymmetric encryption (RSA/ECC) during the TLS handshake to safely exchange a symmetric session key (AES) used for subsequent data encryption.',
    ],
    recruiterNotes:
      'Almost every technical round includes the classic: "What happens when you type google.com into your browser and press Enter?"',
    sections: [
      {
        title: '1. The 7-Layer OSI Model Architecture',
        description: 'Layer functions and associated protocols.',
        subsections: [
          {
            subtitle: 'OSI Reference Matrix',
            contentHtml: `
              <div class="space-y-1 text-xs font-mono">
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 7 - Application: HTTP, DNS, SMTP, FTP</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 6 - Presentation: SSL/TLS, JPEG, ASCII</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 5 - Session: Sockets, RPC</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 4 - Transport: TCP (Segments), UDP (Datagrams)</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 3 - Network: IP, ICMP, Routers (Packets)</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 2 - Data Link: Ethernet, MAC, Switches (Frames)</div>
                <div class="p-2 rounded bg-slate-100 dark:bg-slate-800">Layer 1 - Physical: Cables, Repeaters, Bits (0s and 1s)</div>
              </div>
            `,
          },
        ],
      },
    ],
  },

  // 9. Core Electronics: Microcontroller Architectures & Embedded C
  'Core Electronics: Microcontroller Architectures & Embedded C': {
    id: 'embedded-c',
    title: 'Core Electronics: Microcontroller Architectures & Embedded C',
    category: 'TECHNICAL',
    subCategory: 'TECH_CORE',
    contentType: 'ARTICLE',
    estimatedMinutes: 30,
    difficulty: 'INTERMEDIATE',
    overview:
      'Crucial refresher for ECE/EEE/Robotics placement interviews: timers, interrupts, UART/SPI/I2C protocols, and GPIO registers in Embedded C.',
    keyTakeaways: [
      'UART is asynchronous (requires shared baud rate, 2 wires: TX, RX).',
      'SPI is synchronous, full duplex, 4 wires (MOSI, MISO, SCK, CS), high speed.',
      'I2C is synchronous, half duplex, 2 wires (SDA, SCL), uses pull-up resistors and 7-bit device addressing.',
      'Bit manipulation in C: Set bit = `PORT |= (1 << bit)`; Clear bit = `PORT &= ~(1 << bit)`; Toggle bit = `PORT ^= (1 << bit)`.',
    ],
    recruiterNotes:
      'Companies like Bosch, Texas Instruments, Qualcomm, and embedded software startups test hardware-software boundary concepts and register-level programming.',
    sections: [
      {
        title: '1. Communication Bus Comparison',
        description: 'UART vs SPI vs I2C trade-offs.',
        subsections: [
          {
            subtitle: 'Protocol Matrix',
            contentHtml: `
              <p>Understanding which protocol to choose based on pin counts, speed, and bus topology:</p>
              <ul class="list-disc pl-5 space-y-1 text-xs my-2">
                <li><strong>SPI:</strong> Best for high-speed sensor streams and SD cards where extra GPIO pins for chip-select are available.</li>
                <li><strong>I2C:</strong> Best for connecting multiple sensors (gyroscope, temperature, display) to just 2 microcontroller pins.</li>
                <li><strong>UART:</strong> Best for board-to-PC debugging and Bluetooth/GPS module communication.</li>
              </ul>
            `,
          },
        ],
      },
    ],
  },

  // 10. The STAR Method: Mastering Behavioral & HR Interviews
  'The STAR Method: Mastering Behavioral & HR Interviews': {
    id: 'star-method',
    title: 'The STAR Method: Mastering Behavioral & HR Interviews',
    category: 'INTERVIEW_PREP',
    subCategory: 'HR',
    contentType: 'DOCUMENT',
    estimatedMinutes: 25,
    difficulty: 'BEGINNER',
    overview:
      'How to structure answers to "Tell me about a time you failed", "Handling conflict in a team", and "Greatest strengths & weaknesses" using Situation-Task-Action-Result.',
    keyTakeaways: [
      'Situation (15%): Set the context, team size, project goal, and constraints briefly.',
      'Task (15%): Specify the specific challenge or technical hurdle assigned to you.',
      'Action (50%): Detail YOUR individual actions, decisions, tools used, and technical initiative. Use "I", not just "we".',
      'Result (20%): Quantify the outcome with metrics (e.g. "reduced latency by 35%", "delivered 2 days ahead of deadline").',
    ],
    recruiterNotes:
      'HR managers listen for accountability. Candidates who blame teammates or lack specific metrics in the Result phase receive low behavioral ratings.',
    sections: [
      {
        title: '1. The 4 Step STAR Breakdown',
        description: 'How to structure high-impact answers in 90 to 120 seconds.',
        subsections: [
          {
            subtitle: 'Sample Answer: "Tell me about a time you resolved a major bug under deadline pressure."',
            contentHtml: `
              <div class="space-y-2 text-xs">
                <p><strong>[Situation]:</strong> During our final year capstone project, 48 hours before our departmental evaluation, our team discovered that concurrent user logins crashed our Node.js auth service.</p>
                <p><strong>[Task]:</strong> As the backend lead, I had to diagnose the memory leak and ensure the platform could sustain 200 concurrent student test sessions.</p>
                <p><strong>[Action]:</strong> I isolated the issue using Chrome DevTools memory heap snapshots, identifying that unclosed database connection pools were leaking memory. I refactored the database client to use a singleton connection pool with a connection timeout of 5000ms.</p>
                <p><strong>[Result]:</strong> The platform handled 350 concurrent user requests during the evaluation without a single dropped packet, and our project secured the departmental first prize.</p>
              </div>
            `,
          },
        ],
      },
    ],
  },

  // 11. Technical Interview Simulator: Coding Under Observation
  'Technical Interview Simulator: Coding Under Observation': {
    id: 'live-coding-etiquette',
    title: 'Technical Interview Simulator: Coding Under Observation',
    category: 'INTERVIEW_PREP',
    subCategory: 'TECH_INTERVIEW',
    contentType: 'ARTICLE',
    estimatedMinutes: 20,
    difficulty: 'INTERMEDIATE',
    overview:
      'Techniques for thinking out loud, clarifying constraints, writing clean pseudocode, and analyzing time/space complexity before typing code in live technical rounds.',
    keyTakeaways: [
      'Clarify constraints first: What is the maximum value of N? Can inputs contain negatives, duplicates, or empty lists?',
      'Always verbalize brute-force first: "A naive approach would check all pairs in O(N^2), but we can optimize this to O(N) using a hash map."',
      'Never go silent for more than 20 seconds. If thinking, say: "I am considering two options: a heap versus sorting..."',
      'Dry-run your solution on paper/screen with a concrete sample input before telling the interviewer you are finished.',
    ],
    recruiterNotes:
      'Recruiters value communication and structured problem solving just as much as final code correctness. An engineer who communicates clearly is easier to collaborate with.',
    sections: [
      {
        title: '1. The 5-Step Live Coding Protocol',
        description: 'Step-by-step interview execution guide.',
        subsections: [
          {
            subtitle: 'Phase Breakdown',
            contentHtml: `
              <ol class="list-decimal pl-5 space-y-2 text-xs">
                <li><strong>Understand & Clarify (2-3 min):</strong> Rephrase problem in your own words, confirm edge cases.</li>
                <li><strong>Explore Approaches (3-4 min):</strong> Propose brute-force, discuss time/space trade-offs.</li>
                <li><strong>Agree on Optimal Path (1-2 min):</strong> Get interviewer verbal buy-in before coding.</li>
                <li><strong>Write Clean Modular Code (10-15 min):</strong> Descriptive names, handle null/empty checks first.</li>
                <li><strong>Test & Dry-run (3-4 min):</strong> Walk through sample trace line-by-line, verify complexity.</li>
              </ol>
            `,
          },
        ],
      },
    ],
  },

  // 12. Group Discussion (GD) Playbook: Initiating, Moderating & Concluding
  'Group Discussion (GD) Playbook: Initiating, Moderating & Concluding': {
    id: 'gd-playbook',
    title: 'Group Discussion (GD) Playbook: Initiating, Moderating & Concluding',
    category: 'INTERVIEW_PREP',
    subCategory: 'GD',
    contentType: 'PDF',
    estimatedMinutes: 30,
    difficulty: 'BEGINNER',
    overview:
      'Proven tactics to make impactful points in competitive GD rounds without aggression, plus 20 expected socio-tech topics for 2026 placement drives.',
    keyTakeaways: [
      'Only initiate if you have a clear definition, framework, or compelling factual anchor. A weak initiation hurts more than speaking 3rd.',
      'Use the PREP Framework: Point -> Reason -> Example -> Point re-statement.',
      'Steer chaotic fish-market discussions by saying: "Friends, we all agree on the problem; let us now structure our discussion into economic, technological, and societal dimensions."',
      'Body language: Maintain open palms, nod when peers speak, and avoid pointing fingers or crossing arms defensively.',
    ],
    recruiterNotes:
      'GD is an elimination round evaluating team maturity, listening skills, and diplomatic synthesis under pressure.',
    sections: [
      {
        title: '1. Winning Discussion Phrases',
        description: 'Professional conversational bridges for campus GD rounds.',
        subsections: [
          {
            subtitle: 'Intervention & Agreement Phrases',
            contentHtml: `
              <ul class="list-disc pl-5 space-y-1.5 text-xs">
                <li><em>To build on a peer:</em> "I completely align with Priya's point on data security, and I would like to add an enterprise cost perspective..."</li>
                <li><em>To politely disagree:</em> "That is a valid observation by Rahul; however, if we examine the adoption rate in rural sectors..."</li>
                <li><em>To invite quiet members:</em> "We have heard from the technical side; I would love to hear what Anita thinks about the ethical impact."</li>
              </ul>
            `,
          },
        ],
      },
    ],
  },

  // 13. ATS-Proof Engineering Resume: Layout, Metrics & Action Verbs
  'ATS-Proof Engineering Resume: Layout, Metrics & Action Verbs': {
    id: 'ats-resume',
    title: 'ATS-Proof Engineering Resume: Layout, Metrics & Action Verbs',
    category: 'INTERVIEW_PREP',
    subCategory: 'RESUME',
    contentType: 'CHEATSHEET',
    estimatedMinutes: 15,
    difficulty: 'BEGINNER',
    overview:
      'Harvard and Stanford style single-column resume template applying the Google XYZ formula ("Accomplished [X] as measured by [Y] by doing [Z]").',
    keyTakeaways: [
      'Use single-column layout only. Multi-column tables, skill progress bars, and headshots confuse Applicant Tracking Systems (ATS).',
      'The Google XYZ Formula: "Accomplished [X] as measured by [Y] by doing [Z]". E.g.: "Reduced API latency by 42% (Y) by implementing Redis caching and indexing PostgreSQL queries (Z)".',
      'Categorize technical skills cleanly: Languages (Python, Java, TypeScript), Frameworks (React, Node.js), Databases (PostgreSQL, MongoDB), Tools (Docker, Git, AWS).',
      'Keep resume strictly to 1 page for undergraduate campus drives.',
    ],
    recruiterNotes:
      'Recruiters spend an average of 6 to 8 seconds scanning a resume. Quantified metric bullet points stand out immediately.',
    sections: [
      {
        title: '1. Before & After Bullet Point Transformations',
        description: 'Transforming passive descriptions into high-impact accomplishments.',
        subsections: [
          {
            subtitle: 'Project Bullet Examples',
            contentHtml: `
              <div class="space-y-2 text-xs">
                <div class="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded">
                  ❌ <em>Weak:</em> Worked on an e-commerce website using React and Node.js. Built payment integration.
                </div>
                <div class="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded">
                  ✅ <em>Strong:</em> Engineered full-stack e-commerce portal supporting 500+ daily active users; integrated Razorpay webhooks achieving 99.8% payment reconciliation accuracy using React, Express, and PostgreSQL.
                </div>
              </div>
            `,
          },
        ],
      },
    ],
  },
};
