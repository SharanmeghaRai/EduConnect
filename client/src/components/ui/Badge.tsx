import React, { useState } from 'react';
import { ShieldCheck, Calendar, Award } from 'lucide-react';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'primary' | 'neutral' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const base = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    neutral: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    brand: 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800',
    primary: 'bg-brand-50 text-brand-700 border border-brand-200 dark:bg-brand-950/40 dark:text-brand-300 dark:border-brand-800',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    danger: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    error: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
    info: 'bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return <span className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>{children}</span>;
};

/**
 * Verified Badge with Hover Popover showing verification provenance
 */
export const VerifiedBadge: React.FC<{
  source?: string;
  verifiedAt?: string;
  verifierName?: string;
}> = ({
  source = 'University Placement Cell',
  verifiedAt = 'Recent',
  verifierName = 'Placement Dean',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const formattedDate = verifiedAt !== 'Recent'
    ? new Date(verifiedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Verified Today';

  return (
    <div
      className="relative inline-block cursor-help"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-700 shadow-sm transition-all hover:bg-emerald-100 dark:hover:bg-emerald-900/40">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/60" />
        Verified Drive
      </span>

      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-xl shadow-soft-xl z-50 border border-slate-700 animate-fade-in pointer-events-none">
          <div className="font-semibold text-emerald-400 flex items-center gap-1.5 mb-1.5">
            <Award className="w-3.5 h-3.5" />
            Official Placement Cell Verification
          </div>
          <div className="space-y-1 text-slate-300 text-[11px]">
            <p>
              <strong className="text-white">Source:</strong> {source}
            </p>
            <p>
              <strong className="text-white">Audited By:</strong> {verifierName}
            </p>
            <p className="flex items-center gap-1 text-slate-400 pt-0.5">
              <Calendar className="w-3 h-3" />
              Verified on {formattedDate}
            </p>
          </div>
          <div className="w-2.5 h-2.5 bg-slate-900 border-r border-b border-slate-700 transform rotate-45 absolute -bottom-1.5 left-4"></div>
        </div>
      )}
    </div>
  );
};
