import React from 'react';
import { Clock, ShieldAlert, Award, AlertCircle } from 'lucide-react';
import { Button } from '../ui/Button.js';

interface DistractionFreeExamLayoutProps {
  examTitle: string;
  category: string;
  remainingSeconds: number;
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredCount: number;
  markedForReviewCount: number;
  onReferenceClick?: () => void;
  onSubmitClick: () => void;
  children: React.ReactNode;
}

export const DistractionFreeExamLayout: React.FC<DistractionFreeExamLayoutProps> = ({
  examTitle,
  category,
  remainingSeconds,
  totalQuestions,
  currentQuestionIndex,
  answeredCount,
  markedForReviewCount,
  onReferenceClick,
  onSubmitClick,
  children,
}) => {
  // Format remaining seconds into MM:SS
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // Urgency indicator states
  const isCaution = remainingSeconds < 600; // < 10 mins
  const isUrgent = remainingSeconds < 180; // < 3 mins

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col selection:bg-brand-500 selection:text-white">
      {/* Top Fixed Exam Header Bar */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 shadow-soft-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          {/* Exam Title & Live Badge */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="flex h-2.5 w-2.5 sm:h-3 sm:w-3 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-emerald-500"></span>
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-xs md:max-w-md">
                  {examTitle}
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {category}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                <span className="sm:hidden font-mono font-bold">Q{currentQuestionIndex + 1}/{totalQuestions}</span>
                <span className="hidden sm:inline">Question {currentQuestionIndex + 1} of {totalQuestions} • {answeredCount} answered • {markedForReviewCount} for review</span>
              </p>
            </div>
          </div>

          {/* Center/Right: Reference Material, Countdown Timer & Submit Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {onReferenceClick && (
              <Button
                variant="outline"
                size="sm"
                onClick={onReferenceClick}
                className="hidden md:inline-flex text-xs font-semibold"
                leftIcon={<Award className="w-3.5 h-3.5 text-brand-600" />}
              >
                Reference PDFs
              </Button>
            )}

            {/* Timer Box */}
            <div
              className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-xl font-mono text-xs sm:text-base font-bold border transition-colors shadow-sm shrink-0 ${
                isUrgent
                  ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border-rose-300 animate-pulse'
                  : isCaution
                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border-amber-300'
                  : 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span>{timeFormatted}</span>
            </div>

            {/* Submit Exam Button */}
            <Button
              variant="primary"
              size="sm"
              onClick={onSubmitClick}
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 shadow-sm text-xs font-bold shrink-0 px-2.5 sm:px-3"
            >
              <span className="hidden sm:inline">Submit Exam</span>
              <span className="sm:hidden">Submit</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Examination Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Subtle Proctored Watermark Footer */}
      <footer className="py-2.5 px-4 text-center text-[11px] text-slate-400 border-t border-slate-200 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50">
        <div className="flex items-center justify-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
          <span>EduConnect Secure Exam Session • Anti-cheating & periodic auto-save active</span>
        </div>
      </footer>
    </div>
  );
};
