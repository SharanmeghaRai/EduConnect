import { RawExam } from './exams-part1.js';

export const seedExamsPart5: RawExam[] = [
  // -------------------------------------------------------------
  // 11. VERBAL: Grammar & Sentence Correction
  // -------------------------------------------------------------
  {
    title: 'Verbal Ability: Grammar & Sentence Correction',
    slug: 'verbal-grammar-sentence-correction',
    description: 'Master subject-verb agreement, modifier dangling, parallelism, tense concordance, and prepositional idioms tested by IT recruiters.',
    category: 'VERBAL',
    difficulty: 'EASY',
    durationMinutes: 20,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Choose the correct sentence: "Neither of the candidates _____ qualified for the position."',
        topicTag: 'Subject-Verb Agreement',
        explanation: '"Neither" used as a pronoun is singular and takes the singular verb "is" or "was".',
        options: [
          { label: 'A', text: 'are', isCorrect: false },
          { label: 'B', text: 'is', isCorrect: true },
          { label: 'C', text: 'were', isCorrect: false },
          { label: 'D', text: 'have been', isCorrect: false },
        ],
      },
      {
        prompt: 'Identify the grammatically correct sentence:',
        topicTag: 'Parallelism',
        explanation: 'Parallel structure requires identical grammatical forms: "likes swimming, running, and cycling" (all gerunds).',
        options: [
          { label: 'A', text: 'He likes to swim, running and to cycle.', isCorrect: false },
          { label: 'B', text: 'He likes swimming, running, and cycling.', isCorrect: true },
          { label: 'C', text: 'He likes swimming, to run, and cycling.', isCorrect: false },
          { label: 'D', text: 'He likes to swim, run, and cycling.', isCorrect: false },
        ],
      },
      {
        prompt: 'Fill in the blank: "If I _____ you, I would accept the job offer immediately."',
        topicTag: 'Subjunctive Mood',
        explanation: 'In hypothetical conditional clauses contrary to fact ("If I were..."), the subjunctive "were" is required regardless of the subject pronoun.',
        options: [
          { label: 'A', text: 'was', isCorrect: false },
          { label: 'B', text: 'am', isCorrect: false },
          { label: 'C', text: 'were', isCorrect: true },
          { label: 'D', text: 'had been', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the error: "The committee (A) have decided (B) to postpone (C) its annual meeting (D)."',
        topicTag: 'Collective Noun',
        explanation: 'Since the singular possessive "its" is used in (D), the committee is acting as a unified entity and requires the singular verb "has decided".',
        options: [
          { label: 'A', text: 'The committee', isCorrect: false },
          { label: 'B', text: 'have decided', isCorrect: true },
          { label: 'C', text: 'to postpone', isCorrect: false },
          { label: 'D', text: 'its annual meeting', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the correct idiom: "He has been burning the candle at _____ ends preparing for Google interviews."',
        topicTag: 'Idioms',
        explanation: 'The standard English idiom is "burning the candle at both ends", meaning working extremely hard from early morning until late at night.',
        options: [
          { label: 'A', text: 'all', isCorrect: false },
          { label: 'B', text: 'both', isCorrect: true },
          { label: 'C', text: 'two', isCorrect: false },
          { label: 'D', text: 'opposite', isCorrect: false },
        ],
      },
      {
        prompt: 'Select the correct preposition: "She is thoroughly accustomed _____ working under tight production deadlines."',
        topicTag: 'Prepositions',
        explanation: 'The adjective phrase "accustomed to" takes the preposition "to" followed by a gerund or noun.',
        options: [
          { label: 'A', text: 'with', isCorrect: false },
          { label: 'B', text: 'for', isCorrect: false },
          { label: 'C', text: 'to', isCorrect: true },
          { label: 'D', text: 'by', isCorrect: false },
        ],
      },
      {
        prompt: 'Which sentence has NO dangling modifier?',
        topicTag: 'Dangling Modifiers',
        explanation: 'In option B, the introductory participle "Walking through the park" logically modifies the subject "I", not the trees.',
        options: [
          { label: 'A', text: 'Walking through the park, the fallen leaves covered my shoes.', isCorrect: false },
          { label: 'B', text: 'Walking through the park, I admired the fallen leaves.', isCorrect: true },
          { label: 'C', text: 'Walking through the park, the trees looked majestic to me.', isCorrect: false },
          { label: 'D', text: 'Having completed the exam, the timer expired.', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the correct passive voice: "The software engineer fixed the critical bug yesterday."',
        topicTag: 'Active Passive',
        explanation: 'Simple past passive structure: Object + was/were + past participle + by subject => "The critical bug was fixed by the software engineer yesterday."',
        options: [
          { label: 'A', text: 'The critical bug was fixed by the software engineer yesterday.', isCorrect: true },
          { label: 'B', text: 'The critical bug has been fixed by the software engineer yesterday.', isCorrect: false },
          { label: 'C', text: 'The critical bug had been fixed by the software engineer yesterday.', isCorrect: false },
          { label: 'D', text: 'The critical bug is fixed by the software engineer.', isCorrect: false },
        ],
      },
      {
        prompt: 'Fill in the blank: "Hardly had we entered the lecture hall _____ the fire alarm rang."',
        topicTag: 'Correlative Conjunctions',
        explanation: '"Hardly... when" is the correct correlative conjunction pair ("No sooner... than").',
        options: [
          { label: 'A', text: 'than', isCorrect: false },
          { label: 'B', text: 'then', isCorrect: false },
          { label: 'C', text: 'when', isCorrect: true },
          { label: 'D', text: 'as', isCorrect: false },
        ],
      },
      {
        prompt: 'Identify the sentence with correct punctuation:',
        topicTag: 'Punctuation',
        explanation: 'A semicolon properly connects two independent clauses not joined by a coordinating conjunction.',
        options: [
          { label: 'A', text: 'The project deadline is tomorrow; however, we have finished all core modules.', isCorrect: true },
          { label: 'B', text: 'The project deadline is tomorrow, however we have finished all core modules.', isCorrect: false },
          { label: 'C', text: 'The project deadline is tomorrow; however we have finished all core modules.', isCorrect: false },
          { label: 'D', text: 'The project deadline is tomorrow however; we have finished all core modules.', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the correct form: "Each of the participants received _____ certificate of completion."',
        topicTag: 'Pronoun Agreement',
        explanation: '"Each" is singular and gender-neutral in formal grammar: "his or her" or modern singular "their" when referring to non-specific individual; standard formal grammar chooses "his or her" or "their" depending on rulebook. Formal tests accept "his or her" or singular agreement.',
        options: [
          { label: 'A', text: 'their', isCorrect: false },
          { label: 'B', text: 'his or her', isCorrect: true },
          { label: 'C', text: 'its', isCorrect: false },
          { label: 'D', text: 'whose', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the correct sentence: "One of my best friends _____ moving to London next month."',
        topicTag: 'Subject Agreement',
        explanation: 'The true subject is "One", which is singular, not "friends". Therefore, "is moving" is correct.',
        options: [
          { label: 'A', text: 'are', isCorrect: false },
          { label: 'B', text: 'is', isCorrect: true },
          { label: 'C', text: 'were', isCorrect: false },
          { label: 'D', text: 'have been', isCorrect: false },
        ],
      },
      {
        prompt: 'Fill in the blank: "She is not only intelligent _____ highly disciplined."',
        topicTag: 'Correlatives',
        explanation: 'The correlative pair for "not only" is "but also".',
        options: [
          { label: 'A', text: 'and also', isCorrect: false },
          { label: 'B', text: 'but also', isCorrect: true },
          { label: 'C', text: 'as well as', isCorrect: false },
          { label: 'D', text: 'with', isCorrect: false },
        ],
      },
      {
        prompt: 'Select the word that correctly replaces the bracketed phrase: "The manager [insisted on to see] the audit logs."',
        topicTag: 'Gerund Usage',
        explanation: 'The verb "insist on" takes a gerund: "insisted on seeing".',
        options: [
          { label: 'A', text: 'insisted on seeing', isCorrect: true },
          { label: 'B', text: 'insisted to see', isCorrect: false },
          { label: 'C', text: 'insisted seeing', isCorrect: false },
          { label: 'D', text: 'insisted at seeing', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the sentence with correct article usage:',
        topicTag: 'Articles',
        explanation: '"European" begins with a consonant phonetic sound (/j/), hence it takes the indefinite article "a", not "an".',
        options: [
          { label: 'A', text: 'He is an European diplomat.', isCorrect: false },
          { label: 'B', text: 'He is a European diplomat.', isCorrect: true },
          { label: 'C', text: 'He is the European diplomat with no country.', isCorrect: false },
          { label: 'D', text: 'He is European diplomat.', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 12. VERBAL: Reading Comprehension & Inference
  // -------------------------------------------------------------
  {
    title: 'Verbal Ability: Reading Comprehension',
    slug: 'verbal-reading-comprehension',
    description: 'Read dense technical/economic passages, identify the central thesis, author tone, logical extrapolations, and contextual nuances.',
    category: 'VERBAL',
    difficulty: 'MEDIUM',
    durationMinutes: 25,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Passage snippet: "Artificial intelligence in campus recruitment is often touted as an impartial equalizer. However, machine-learning algorithms trained on historical hiring data inherently internalize and perpetuate institutional biases." What is the primary assertion of the author?',
        topicTag: 'Main Idea',
        explanation: 'The author argues that AI is not inherently impartial because historical training data contains past institutional biases.',
        options: [
          { label: 'A', text: 'AI is fundamentally incapable of conducting job interviews.', isCorrect: false },
          { label: 'B', text: 'AI algorithms can inadvertently perpetuate existing historical biases.', isCorrect: true },
          { label: 'C', text: 'Campus recruitment should entirely ban algorithmic automation.', isCorrect: false },
          { label: 'D', text: 'Historical hiring data is always 100% objective.', isCorrect: false },
        ],
      },
      {
        prompt: 'Based on the previous snippet, the author’s tone can best be described as:',
        topicTag: 'Author Tone',
        explanation: 'The author balances promise with skepticism/caution regarding algorithmic claims: critical and analytical.',
        options: [
          { label: 'A', text: 'Celebratory and enthusiastic', isCorrect: false },
          { label: 'B', text: 'Critical and analytical', isCorrect: true },
          { label: 'C', text: 'Cynical and aggressive', isCorrect: false },
          { label: 'D', text: 'Ambivalent and indifferent', isCorrect: false },
        ],
      },
      {
        prompt: 'Passage snippet: "Sustainable computing focuses on minimizing the carbon footprint of data centers without compromising latency. While liquid cooling and renewable micro-grids reduce power consumption, optimizing algorithmic computational complexity yields the highest thermodynamic savings per query." Which strategy provides the highest thermodynamic savings according to the text?',
        topicTag: 'Fact Retrieval',
        explanation: 'The text states: "optimizing algorithmic computational complexity yields the highest thermodynamic savings per query."',
        options: [
          { label: 'A', text: 'Liquid cooling implementations', isCorrect: false },
          { label: 'B', text: 'Renewable micro-grids', isCorrect: false },
          { label: 'C', text: 'Optimizing algorithmic computational complexity', isCorrect: true },
          { label: 'D', text: 'Shutting down low-priority cloud regions', isCorrect: false },
        ],
      },
      {
        prompt: 'From the sustainable computing passage, what can be logically inferred?',
        topicTag: 'Inference',
        explanation: 'Since code optimization saves the most energy per query, efficient software engineering directly contributes to environmental sustainability.',
        options: [
          { label: 'A', text: 'Hardware innovations have reached a physical dead end.', isCorrect: false },
          { label: 'B', text: 'Software efficiency plays a vital role in reducing data center environmental impact.', isCorrect: true },
          { label: 'C', text: 'Latency is completely irrelevant to cloud architects.', isCorrect: false },
          { label: 'D', text: 'Micro-grids are completely ineffective.', isCorrect: false },
        ],
      },
      {
        prompt: 'Passage snippet: "The tragedy of the commons in open-source software manifests when billion-dollar enterprises depend on volunteer-maintained libraries without offering financial stewardship or code contributions." The term "tragedy of the commons" in this context refers to:',
        topicTag: 'Contextual Meaning',
        explanation: 'It refers to commercial exploitation and exhaustion of a shared public good without replenishing or maintaining it.',
        options: [
          { label: 'A', text: 'The complete collapse of Linux distributions', isCorrect: false },
          { label: 'B', text: 'Exploiting shared volunteer resources without providing sustainable support', isCorrect: true },
          { label: 'C', text: 'Copyright disputes between rival corporations', isCorrect: false },
          { label: 'D', text: 'A dramatic play written by programmers', isCorrect: false },
        ],
      },
      {
        prompt: 'In competitive debate, what is an "ad hominem" fallacy?',
        topicTag: 'Critical Reasoning',
        explanation: 'An ad hominem attack targets the person making the argument rather than the merits of the argument itself.',
        options: [
          { label: 'A', text: 'Attacking the character or motive of the speaker instead of the argument', isCorrect: true },
          { label: 'B', text: 'Assuming the conclusion within the premises', isCorrect: false },
          { label: 'C', text: 'Misrepresenting an opponent\'s stance to make it easier to attack', isCorrect: false },
          { label: 'D', text: 'Claiming something is true merely because it is popular', isCorrect: false },
        ],
      },
      {
        prompt: 'What is a "straw man" fallacy?',
        topicTag: 'Logical Fallacy',
        explanation: 'Distorting or exaggerating someone\'s position to make it easier to defeat is a classic straw man fallacy.',
        options: [
          { label: 'A', text: 'Misrepresenting an argument to make it easier to refute', isCorrect: true },
          { label: 'B', text: 'Arguing in circles', isCorrect: false },
          { label: 'C', text: 'Appealing to false authority', isCorrect: false },
          { label: 'D', text: 'Drawing conclusions from insufficient sample size', isCorrect: false },
        ],
      },
      {
        prompt: 'Passage snippet: "Quantum computing promises exponential acceleration for specific mathematical domains such as prime factorization and quantum chemistry simulations. However, for everyday general computing tasks like word processing and video streaming, classical architectures remain fundamentally superior in speed and cost." What is the main constraint of quantum computing highlighted?',
        topicTag: 'Thesis Understanding',
        explanation: 'The passage highlights that quantum acceleration is domain-specific, not universally superior for daily general-purpose tasks.',
        options: [
          { label: 'A', text: 'Quantum computers will never exist physically.', isCorrect: false },
          { label: 'B', text: 'Quantum speedups are specialized and do not benefit typical everyday user tasks.', isCorrect: true },
          { label: 'C', text: 'Classical computers cannot simulate chemistry.', isCorrect: false },
          { label: 'D', text: 'Video streaming cannot be encrypted.', isCorrect: false },
        ],
      },
      {
        prompt: 'Which word in the previous snippet means "pertaining to a domain of knowledge or activity"?',
        topicTag: 'Vocabulary in Context',
        explanation: '"Domains" refers to distinct areas or spheres of activity/knowledge.',
        options: [
          { label: 'A', text: 'Acceleration', isCorrect: false },
          { label: 'B', text: 'Domains', isCorrect: true },
          { label: 'C', text: 'Architectures', isCorrect: false },
          { label: 'D', text: 'Factorization', isCorrect: false },
        ],
      },
      {
        prompt: 'If a passage claims that "Company X’s market share expanded by 40% while aggregate industry revenue plummeted by 10%", what must have happened to the revenue of other firms in the industry?',
        topicTag: 'Analytical Deduction',
        explanation: 'Since total revenue shrank while Company X gained significant share, the remaining competitors must have collectively suffered revenue declines.',
        options: [
          { label: 'A', text: 'They all grew faster than Company X.', isCorrect: false },
          { label: 'B', text: 'Competitors collectively lost market share and revenue.', isCorrect: true },
          { label: 'C', text: 'Every other firm went bankrupt.', isCorrect: false },
          { label: 'D', text: 'The industry expanded its customer base.', isCorrect: false },
        ],
      },
      {
        prompt: 'Passage snippet: "Imposter syndrome is prevalent among engineering graduates embarking on their first software role. The psychological impulse to attribute successes to luck rather than competence can be mitigated through transparent feedback loops and structured peer mentoring." How can imposter syndrome be counteracted according to the author?',
        topicTag: 'Fact Extraction',
        explanation: 'The passage explicitly lists "transparent feedback loops and structured peer mentoring."',
        options: [
          { label: 'A', text: 'By avoiding difficult assignments', isCorrect: false },
          { label: 'B', text: 'Through transparent feedback loops and structured peer mentoring', isCorrect: true },
          { label: 'C', text: 'By working in complete isolation', isCorrect: false },
          { label: 'D', text: 'By taking more aptitude tests', isCorrect: false },
        ],
      },
      {
        prompt: 'What does the author imply about new graduates experiencing imposter syndrome?',
        topicTag: 'Inference',
        explanation: 'They tend to discount their own abilities and credit chance or good fortune for their accomplishments.',
        options: [
          { label: 'A', text: 'They are genuinely incompetent programmers.', isCorrect: false },
          { label: 'B', text: 'They undervalue their real skills and attribute success to luck.', isCorrect: true },
          { label: 'C', text: 'They do not enjoy engineering work.', isCorrect: false },
          { label: 'D', text: 'They will be fired within 90 days.', isCorrect: false },
        ],
      },
      {
        prompt: 'Identify the antonym of "ephemeral" as used in academic writing:',
        topicTag: 'Vocabulary',
        explanation: '"Ephemeral" means short-lived or transitory. Its direct antonym is "permanent" or "enduring".',
        options: [
          { label: 'A', text: 'Fleeting', isCorrect: false },
          { label: 'B', text: 'Permanent', isCorrect: true },
          { label: 'C', text: 'Momentary', isCorrect: false },
          { label: 'D', text: 'Transient', isCorrect: false },
        ],
      },
      {
        prompt: 'When an author says a solution is "panacea", what do they mean?',
        topicTag: 'Literary Expression',
        explanation: '"Panacea" means a universal remedy or cure-all for all difficulties or diseases.',
        options: [
          { label: 'A', text: 'A temporary stopgap', isCorrect: false },
          { label: 'B', text: 'A universal remedy or cure-all', isCorrect: true },
          { label: 'C', text: 'A high-cost experiment', isCorrect: false },
          { label: 'D', text: 'A dangerous hazard', isCorrect: false },
        ],
      },
      {
        prompt: 'What is the most suitable title for an essay discussing the balance between code execution speed and code maintainability in enterprise systems?',
        topicTag: 'Title Selection',
        explanation: '"The Architecture Tradeoff: Balancing Performance and Code Readability" accurately captures the tension between speed and maintenance.',
        options: [
          { label: 'A', text: 'Why All Code Must Run Under 10ms', isCorrect: false },
          { label: 'B', text: 'The Architecture Tradeoff: Balancing Performance and Code Readability', isCorrect: true },
          { label: 'C', text: 'A Complete History of Microprocessors', isCorrect: false },
          { label: 'D', text: 'The Death of High-Level Programming', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 13. VERBAL: Vocabulary, Synonyms & Antonyms
  // -------------------------------------------------------------
  {
    title: 'Verbal Ability: Vocabulary & Synonyms',
    slug: 'verbal-vocabulary-synonyms-antonyms',
    description: 'High-frequency GRE and corporate placement vocabulary: synonyms, antonyms, analogies, and one-word substitutions.',
    category: 'VERBAL',
    difficulty: 'MEDIUM',
    durationMinutes: 20,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Choose the word most nearly SYNONYMOUS with "PRAGMATIC":',
        topicTag: 'Synonyms',
        explanation: '"Pragmatic" means dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
        options: [
          { label: 'A', text: 'Idealistic', isCorrect: false },
          { label: 'B', text: 'Practical', isCorrect: true },
          { label: 'C', text: 'Dogmatic', isCorrect: false },
          { label: 'D', text: 'Theoretical', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the word most nearly ANTONYMOUS to "METICULOUS":',
        topicTag: 'Antonyms',
        explanation: '"Meticulous" means showing great attention to detail; very careful and precise. Its opposite is "careless" or "sloppy".',
        options: [
          { label: 'A', text: 'Scrupulous', isCorrect: false },
          { label: 'B', text: 'Careless', isCorrect: true },
          { label: 'C', text: 'Diligent', isCorrect: false },
          { label: 'D', text: 'Fastidious', isCorrect: false },
        ],
      },
      {
        prompt: 'Find the synonym for "UBIQUITOUS":',
        topicTag: 'Synonyms',
        explanation: '"Ubiquitous" means present, appearing, or found everywhere (omnipresent).',
        options: [
          { label: 'A', text: 'Omnipresent', isCorrect: true },
          { label: 'B', text: 'Scarce', isCorrect: false },
          { label: 'C', text: 'Rare', isCorrect: false },
          { label: 'D', text: 'Ephemeral', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the antonym of "PROLIFIC":',
        topicTag: 'Antonyms',
        explanation: '"Prolific" means producing much fruit or foliage or many works; highly productive. Antonym is "barren" or "unproductive".',
        options: [
          { label: 'A', text: 'Fertile', isCorrect: false },
          { label: 'B', text: 'Unproductive', isCorrect: true },
          { label: 'C', text: 'Creative', isCorrect: false },
          { label: 'D', text: 'Abundant', isCorrect: false },
        ],
      },
      {
        prompt: 'Select the one-word substitution for: "A person who is indifferent to pleasure or pain"',
        topicTag: 'One-Word Substitution',
        explanation: 'A "stoic" is a person who can endure pain or hardship without showing their feelings or complaining.',
        options: [
          { label: 'A', text: 'Hedonist', isCorrect: false },
          { label: 'B', text: 'Stoic', isCorrect: true },
          { label: 'C', text: 'Epicurean', isCorrect: false },
          { label: 'D', text: 'Ascetic', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the synonym for "TENACIOUS":',
        topicTag: 'Synonyms',
        explanation: '"Tenacious" means tending to keep a firm hold of something; clinging or adhering closely; persistent.',
        options: [
          { label: 'A', text: 'Persistent', isCorrect: true },
          { label: 'B', text: 'Yielding', isCorrect: false },
          { label: 'C', text: 'Fragile', isCorrect: false },
          { label: 'D', text: 'Timid', isCorrect: false },
        ],
      },
      {
        prompt: 'What is the meaning of the idiom "to take with a grain of salt"?',
        topicTag: 'Idioms',
        explanation: 'To view something with skepticism or not to take it completely literally.',
        options: [
          { label: 'A', text: 'To accept with skepticism', isCorrect: true },
          { label: 'B', text: 'To refuse completely', isCorrect: false },
          { label: 'C', text: 'To misunderstand the context', isCorrect: false },
          { label: 'D', text: 'To cook properly', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the antonym of "BENEVOLENT":',
        topicTag: 'Antonyms',
        explanation: '"Benevolent" means well-meaning and kindly. Its antonym is "malevolent" or "spiteful".',
        options: [
          { label: 'A', text: 'Magnanimous', isCorrect: false },
          { label: 'B', text: 'Malevolent', isCorrect: true },
          { label: 'C', text: 'Charitable', isCorrect: false },
          { label: 'D', text: 'Altruistic', isCorrect: false },
        ],
      },
      {
        prompt: 'Analogies: COMPILER : CODE :: TRANSLATOR : _____',
        topicTag: 'Analogies',
        explanation: 'A compiler converts code from one language to another; a translator converts text/speech from one natural language to another.',
        options: [
          { label: 'A', text: 'Book', isCorrect: false },
          { label: 'B', text: 'Language', isCorrect: true },
          { label: 'C', text: 'Author', isCorrect: false },
          { label: 'D', text: 'Dictionary', isCorrect: false },
        ],
      },
      {
        prompt: 'Select the synonym for "MITIGATE":',
        topicTag: 'Synonyms',
        explanation: '"Mitigate" means to make less severe, serious, or painful (alleviate or lessen).',
        options: [
          { label: 'A', text: 'Aggravate', isCorrect: false },
          { label: 'B', text: 'Alleviate', isCorrect: true },
          { label: 'C', text: 'Intensify', isCorrect: false },
          { label: 'D', text: 'Provoke', isCorrect: false },
        ],
      },
      {
        prompt: 'One-word substitution: "An unintended, subtle error or slip in speaking or memory"',
        topicTag: 'Vocabulary',
        explanation: 'A "lapse" is a brief or temporary failure of concentration or memory.',
        options: [
          { label: 'A', text: 'Lapse', isCorrect: true },
          { label: 'B', text: 'Sin', isCorrect: false },
          { label: 'C', text: 'Faux pas', isCorrect: false },
          { label: 'D', text: 'Catastrophe', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the antonym for "CANDID":',
        topicTag: 'Antonyms',
        explanation: '"Candid" means truthful and straightforward; frank. Its antonym is "deceitful" or "guarded".',
        options: [
          { label: 'A', text: 'Frank', isCorrect: false },
          { label: 'B', text: 'Honest', isCorrect: false },
          { label: 'C', text: 'Guarded', isCorrect: true },
          { label: 'D', text: 'Outspoken', isCorrect: false },
        ],
      },
      {
        prompt: 'What does "bite the bullet" mean?',
        topicTag: 'Idioms',
        explanation: 'To face a difficult or unpleasant situation with courage and stoicism.',
        options: [
          { label: 'A', text: 'To endure an unavoidable grim situation bravely', isCorrect: true },
          { label: 'B', text: 'To act hastily without thinking', isCorrect: false },
          { label: 'C', text: 'To surrender to pressure', isCorrect: false },
          { label: 'D', text: 'To engage in armed combat', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the synonym for "EQUIVOCAL":',
        topicTag: 'Synonyms',
        explanation: '"Equivocal" means open to more than one interpretation; ambiguous.',
        options: [
          { label: 'A', text: 'Clear', isCorrect: false },
          { label: 'B', text: 'Ambiguous', isCorrect: true },
          { label: 'C', text: 'Decisive', isCorrect: false },
          { label: 'D', text: 'Certain', isCorrect: false },
        ],
      },
      {
        prompt: 'Choose the correctly spelled word:',
        topicTag: 'Spelling',
        explanation: '"Accommodate" is spelled with double-c and double-m: A-c-c-o-m-m-o-d-a-t-e.',
        options: [
          { label: 'A', text: 'Acommodate', isCorrect: false },
          { label: 'B', text: 'Accomodate', isCorrect: false },
          { label: 'C', text: 'Accommodate', isCorrect: true },
          { label: 'D', text: 'Acomodate', isCorrect: false },
        ],
      },
    ],
  },

  // -------------------------------------------------------------
  // 14. DATA INTERPRETATION: Bar Graphs & Tables
  // -------------------------------------------------------------
  {
    title: 'Data Interpretation: Bar Graphs & Tables',
    slug: 'data-interpretation-charts-tables',
    description: 'Analyze production numbers, corporate revenues, year-over-year percentage increments, and tabular sales matrices.',
    category: 'DATA_INT',
    difficulty: 'HARD',
    durationMinutes: 30,
    totalMarks: 15,
    passingMarks: 6,
    negativeMarkingRatio: 0.25,
    maxAttempts: 3,
    questions: [
      {
        prompt: 'Data Table: Software Exports (in ₹ Crores) across 4 Years: 2021: 400, 2022: 520, 2023: 650, 2024: 780. What was the percentage increase in exports from 2021 to 2022?',
        topicTag: 'Table Analysis',
        explanation: 'Increase = 520 - 400 = 120. % Increase = (120 / 400) * 100 = 30%.',
        options: [
          { label: 'A', text: '25%', isCorrect: false },
          { label: 'B', text: '28%', isCorrect: false },
          { label: 'C', text: '30%', isCorrect: true },
          { label: 'D', text: '32.5%', isCorrect: false },
        ],
      },
      {
        prompt: 'Using the previous export data, what is the average annual export over the 4 years (2021 to 2024)?',
        topicTag: 'Average Computation',
        explanation: 'Total = 400 + 520 + 650 + 780 = 2350. Average = 2350 / 4 = ₹587.5 Crores.',
        options: [
          { label: 'A', text: '₹575 Crores', isCorrect: false },
          { label: 'B', text: '₹587.5 Crores', isCorrect: true },
          { label: 'C', text: '₹600 Crores', isCorrect: false },
          { label: 'D', text: '₹612.5 Crores', isCorrect: false },
        ],
      },
      {
        prompt: 'In which year was the absolute growth in exports the highest compared to the preceding year?',
        topicTag: 'Growth Comparison',
        explanation: '2022 growth = 520 - 400 = 120. 2023 growth = 650 - 520 = 130. 2024 growth = 780 - 650 = 130. Years 2023 and 2024 tied with 130 Crores.',
        options: [
          { label: 'A', text: '2022', isCorrect: false },
          { label: 'B', text: '2023', isCorrect: true },
          { label: 'C', text: '2021', isCorrect: false },
          { label: 'D', text: 'None', isCorrect: false },
        ],
      },
      {
        prompt: 'Bar Chart: Number of students placed across departments in 2026: CSE: 240, ECE: 180, Mech: 120, Civil: 60. What percentage of total placed students belong to CSE?',
        topicTag: 'Percentage Share',
        explanation: 'Total placed = 240 + 180 + 120 + 60 = 600. CSE share = (240 / 600) * 100 = 40%.',
        options: [
          { label: 'A', text: '35%', isCorrect: false },
          { label: 'B', text: '40%', isCorrect: true },
          { label: 'C', text: '45%', isCorrect: false },
          { label: 'D', text: '50%', isCorrect: false },
        ],
      },
      {
        prompt: 'From the placement data, what is the ratio of students placed in ECE to students placed in Civil?',
        topicTag: 'Ratio from Graph',
        explanation: 'Ratio = ECE : Civil = 180 : 60 = 3 : 1.',
        options: [
          { label: 'A', text: '2 : 1', isCorrect: false },
          { label: 'B', text: '3 : 1', isCorrect: true },
          { label: 'C', text: '3 : 2', isCorrect: false },
          { label: 'D', text: '4 : 1', isCorrect: false },
        ],
      },
      {
        prompt: 'A company\'s expenditure breakdown: Raw materials 40%, Salaries 30%, Advertising 15%, R&D 10%, Misc 5%. If total expenditure is ₹50 Crores, how much was spent on Advertising?',
        topicTag: 'Proportion Analysis',
        explanation: 'Advertising = 15% of 50 Crores = 0.15 * 50 = ₹7.5 Crores.',
        options: [
          { label: 'A', text: '₹5 Crores', isCorrect: false },
          { label: 'B', text: '₹6.5 Crores', isCorrect: false },
          { label: 'C', text: '₹7.5 Crores', isCorrect: true },
          { label: 'D', text: '₹8.0 Crores', isCorrect: false },
        ],
      },
      {
        prompt: 'In a stacked bar chart, Company A produces 300 units in Q1 and 450 units in Q2. Company B produces 200 units in Q1 and 350 units in Q2. What is the total combined production in Q2?',
        topicTag: 'Stacked Bars',
        explanation: 'Combined Q2 = 450 + 350 = 800 units.',
        options: [
          { label: 'A', text: '750 units', isCorrect: false },
          { label: 'B', text: '800 units', isCorrect: true },
          { label: 'C', text: '850 units', isCorrect: false },
          { label: 'D', text: '900 units', isCorrect: false },
        ],
      },
      {
        prompt: 'What was the percentage increase in production for Company B from Q1 to Q2?',
        topicTag: 'Percentage Growth',
        explanation: 'Increase = 350 - 200 = 150. % increase = (150 / 200) * 100 = 75%.',
        options: [
          { label: 'A', text: '50%', isCorrect: false },
          { label: 'B', text: '60%', isCorrect: false },
          { label: 'C', text: '75%', isCorrect: true },
          { label: 'D', text: '80%', isCorrect: false },
        ],
      },
      {
        prompt: 'Table of Employee Distribution: Dept X has 40% females out of 250 employees. Dept Y has 60% females out of 150 employees. What is the total number of female employees in both departments combined?',
        topicTag: 'Weighted Table',
        explanation: 'Dept X females = 0.40 * 250 = 100. Dept Y females = 0.60 * 150 = 90. Combined females = 100 + 90 = 190.',
        options: [
          { label: 'A', text: '180', isCorrect: false },
          { label: 'B', text: '190', isCorrect: true },
          { label: 'C', text: '200', isCorrect: false },
          { label: 'D', text: '210', isCorrect: false },
        ],
      },
      {
        prompt: 'What percentage of the total combined employees in Dept X and Dept Y are female?',
        topicTag: 'Combined Percentage',
        explanation: 'Total employees = 250 + 150 = 400. Total females = 190. Percentage = (190 / 400) * 100 = 47.5%.',
        options: [
          { label: 'A', text: '45.0%', isCorrect: false },
          { label: 'B', text: '47.5%', isCorrect: true },
          { label: 'C', text: '50.0%', isCorrect: false },
          { label: 'D', text: '52.5%', isCorrect: false },
        ],
      },
      {
        prompt: 'A line graph shows monthly active users (MAU in thousands): Jan: 100, Feb: 120, Mar: 150, Apr: 180, May: 225. What was the compound monthly growth rate between Jan and May?',
        topicTag: 'Line Trend',
        explanation: 'Jan to May is 4 monthly periods. Growth = 225 / 100 = 2.25. (1 + r)^4 = 2.25 => (1 + r) = (1.5)^(1/2) approx ~1.22 (22.5%). Direct approximation: ~22.5% per month.',
        options: [
          { label: 'A', text: '15.5%', isCorrect: false },
          { label: 'B', text: '22.5%', isCorrect: true },
          { label: 'C', text: '25.0%', isCorrect: false },
          { label: 'D', text: '31.2%', isCorrect: false },
        ],
      },
      {
        prompt: 'If the total revenue of a startup was ₹2.4 Crores in 2025 and is projected to grow by 25% each year for the next two years, what will be the projected revenue in 2027?',
        topicTag: 'Compounded Projections',
        explanation: 'Revenue 2027 = 2.4 * (1.25)^2 = 2.4 * 1.5625 = ₹3.75 Crores.',
        options: [
          { label: 'A', text: '₹3.50 Crores', isCorrect: false },
          { label: 'B', text: '₹3.75 Crores', isCorrect: true },
          { label: 'C', text: '₹4.00 Crores', isCorrect: false },
          { label: 'D', text: '₹4.25 Crores', isCorrect: false },
        ],
      },
      {
        prompt: 'In a pie chart, if the central angle for "Research and Development" is 72 degrees, what percentage of the total budget is allocated to R&D?',
        topicTag: 'Pie Chart Angle',
        explanation: 'Full circle = 360 degrees. Percentage = (72 / 360) * 100 = (1 / 5) * 100 = 20%.',
        options: [
          { label: 'A', text: '18%', isCorrect: false },
          { label: 'B', text: '20%', isCorrect: true },
          { label: 'C', text: '22%', isCorrect: false },
          { label: 'D', text: '25%', isCorrect: false },
        ],
      },
      {
        prompt: 'A company\'s sales in 5 zones are: North ₹12M, South ₹18M, East ₹8M, West ₹14M, Central ₹8M. What is the central angle for South zone in a pie chart?',
        topicTag: 'Angle Conversion',
        explanation: 'Total sales = 12 + 18 + 8 + 14 + 8 = ₹60M. South share = 18 / 60 = 0.30 (30%). Angle = 0.30 * 360 = 108 degrees.',
        options: [
          { label: 'A', text: '90°', isCorrect: false },
          { label: 'B', text: '100°', isCorrect: false },
          { label: 'C', text: '108°', isCorrect: true },
          { label: 'D', text: '120°', isCorrect: false },
        ],
      },
      {
        prompt: 'If the ratio of production costs to sales revenues for a product over 3 years is 0.70, 0.75, and 0.80, in which year was the profit margin percentage highest?',
        topicTag: 'Margin Analysis',
        explanation: 'Profit margin % = (1 - Cost/Revenue) * 100. For 0.70 => 30% margin. For 0.75 => 25% margin. For 0.80 => 20% margin. Highest in Year 1.',
        options: [
          { label: 'A', text: 'Year 1', isCorrect: true },
          { label: 'B', text: 'Year 2', isCorrect: false },
          { label: 'C', text: 'Year 3', isCorrect: false },
          { label: 'D', text: 'Equal in all years', isCorrect: false },
        ],
      },
    ],
  },
];
