import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button.js';
import { useAuth } from '../context/AuthContext.js';

export const NotFoundPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-center px-4 gap-5">
      {/* Decorative background blob */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-400/10 dark:bg-brand-600/10 rounded-full blur-3xl" />
      </div>

      {/* Icon */}
      <div className="w-20 h-20 rounded-lg bg-brand-100 dark:bg-brand-950 border border-brand-200 dark:border-brand-800 flex items-center justify-center shadow-soft-md">
        <GraduationCap className="w-10 h-10 text-brand-500" />
      </div>

      {/* Status */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">404 — Not Found</p>
        <h1 className="text-4xl sm:text-5xl font-display font-black text-slate-900 dark:text-white">
          Page doesn't exist
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 max-w-md mx-auto leading-relaxed">
          This route isn't part of the EduConnect placement portal. You may have typed a wrong URL or followed an outdated link.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>
        <Link to="/">
          <Button variant="outline" size="sm">
            <Home className="w-4 h-4 mr-1.5" />
            Home
          </Button>
        </Link>
        {user && (
          <Link to="/dashboard">
            <Button size="sm">
              <LayoutDashboard className="w-4 h-4 mr-1.5" />
              Dashboard
            </Button>
          </Link>
        )}
      </div>

      {/* Quick nav links */}
      <div className="mt-4 text-xs text-slate-400 dark:text-slate-500 space-y-1">
        <p className="font-semibold text-slate-500 dark:text-slate-400 mb-2">Quick links:</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link to="/exams" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Aptitude Exams</Link>
          <Link to="/jobs" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Verified Jobs</Link>
          <Link to="/materials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Study Hub</Link>
          <Link to="/chat" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">AI Mentor</Link>
        </div>
      </div>
    </div>
  );
};
