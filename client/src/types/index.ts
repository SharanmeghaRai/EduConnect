export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  isActive: boolean;
  studentProfile?: StudentProfile;
}

export interface StudentProfile {
  id: string;
  userId: string;
  rollNumber?: string;
  department?: string;
  graduationYear?: number;
  targetRoles?: string;
  resumeUrl?: string;
  cgpa?: number;
  prepStreakDays: number;
  skills?: string;
  preferredCompanies?: string;
  isLeaderboardOptIn?: boolean;
  lastActiveDate: string;
}

export interface Exam {
  id: string;
  title: string;
  slug: string;
  description?: string;
  category: 'QUANT' | 'LOGICAL' | 'VERBAL' | 'DATA_INT' | 'TECH_CS' | 'TECH_CORE' | 'APTITUDE' | 'JAPANESE' | string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  negativeMarkingRatio: number;
  maxAttempts: number;
  isPublished: boolean;
  questions?: Question[];
  _count?: { questions: number; attempts: number };
  userAttemptsCount?: number;
  bestScore?: number | null;
  hasPassed?: boolean;
}

export interface Question {
  id: string;
  examId: string;
  prompt: string;
  explanation?: string;
  topicTag?: string;
  marks: number;
  orderIndex: number;
  options: Option[];
}

export interface Option {
  id: string;
  questionId: string;
  label: string;
  text: string;
  isCorrect?: boolean;
}

export interface Attempt {
  id: string;
  examId: string;
  userId: string;
  attemptNumber: number;
  startedAt: string;
  submittedAt?: string;
  timeSpentSeconds: number;
  score: number;
  maxScore: number;
  accuracyPercentage: number;
  peerPercentile: number;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMED_OUT';
  exam: Exam;
  answers: AttemptAnswer[];
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionId?: string;
  selectedOption?: Option;
  isMarkedForReview: boolean;
  isCorrect: boolean;
  marksAwarded: number;
  timeSpentSeconds: number;
  question?: Question;
}

export interface JobListing {
  id: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  jobType: 'FULL_TIME' | 'INTERNSHIP';
  location: string;
  salaryRange: string;
  eligibilityCriteria: string;
  requiredSkills: string;
  applyUrl: string;
  isVerified: boolean;
  verifiedAt?: string;
  verificationSource?: string;
  linkStatus: 'ACTIVE' | 'BROKEN' | 'EXPIRED';
  deadline: string;
  viewCount: number;
  applyClickCount: number;
  isBookmarked?: boolean;
  _count?: { bookmarks: number; reports: number };
}

export interface StudyMaterial {
  id: string;
  title: string;
  category: 'APTITUDE' | 'TECHNICAL' | 'INTERVIEW_PREP' | string;
  subCategory?: string;
  contentType?: 'PDF' | 'DOCUMENT' | 'VIDEO' | 'ARTICLE' | 'CHEATSHEET' | string;
  resourceType?: string;
  resourceUrl?: string;
  externalUrl?: string;
  description?: string;
  tags?: string | string[];
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
  estimatedMinutes?: number;
  isFeatured?: boolean;
  isCompleted?: boolean;
  isBookmarked?: boolean;
}

export interface Newsletter {
  id: string;
  title: string;
  editionNumber: number;
  contentHtml: string;
  summary?: string;
  targetAudience?: string;
  publishedAt?: string;
  status: 'DRAFT' | 'SCHEDULED' | 'PUBLISHED';
  recipientCount: number;
}

export interface AiNewsletter {
  id: string;
  title: string;
  editionNumber: number;
  publishedAt: string;
  summary: string;
  contentHtml: string;
  topics: string[];
  keyTakeaways: string[];
  readingTimeMin: number;
  category: string;
  campusInterviewRelevance: string;
  recipientCount: number;
  status: string;
}

export interface AiNewsletterResponse {
  newsletters: AiNewsletter[];
  stats: {
    totalRecentDays: number;
    todayDate: string;
    latestDispatchTime: string;
    nextScheduledDispatch: string;
    nextScheduledDispatchIso?: string;
    cronSchedule: string;
    updateFrequency: string;
    timezone?: string;
    isTodayEditionLive?: boolean;
    secondsUntilNextDispatch?: number;
  };
}

export interface ChatMessage {
  id?: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  citationsJson?: string;
  feedbackRating?: number;
  createdAt?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'EXAM' | 'JOB' | 'NEWSLETTER';
  isRead: boolean;
  link?: string | null;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  department: string;
  graduationYear: number;
  rollNumber: string;
  totalAttempts: number;
  bestScore: number;
  avgAccuracy: number;
  avgPercentile: number;
  streakDays: number;
  isStreakMaintainedToday: boolean;
  isCurrentUser: boolean;
}

export interface StreakSummary {
  currentStreak: number;
  isMaintainedToday: boolean;
  longestStreak: number;
  weeklyActivity: {
    dayName: string;
    date: string;
    isCompleted: boolean;
  }[];
  streakTitle: string;
  nextMilestone: number;
  daysToNextMilestone: number;
  lastActiveDate?: string | null;
}

export interface GlobalSearchResult {
  exams: {
    id: string;
    title: string;
    category: string;
    difficulty: string;
    durationMinutes: number;
    totalMarks: number;
  }[];
  jobs: {
    id: string;
    companyName: string;
    roleTitle: string;
    jobType: string;
    salaryRange: string;
    deadline: string;
    isVerified: boolean;
  }[];
  materials: {
    id: string;
    title: string;
    category: string;
    contentType: string;
    estimatedMinutes: number;
    resourceUrl: string;
  }[];
}
