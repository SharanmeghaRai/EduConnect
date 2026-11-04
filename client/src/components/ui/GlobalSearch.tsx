import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Briefcase,
  BookOpen,
  X,
  ExternalLink,
  ChevronRight,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api.js';
import { GlobalSearchResult } from '../../types/index.js';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<GlobalSearchResult>({ exams: [], jobs: [], materials: [] });
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults({ exams: [], jobs: [], materials: [] });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults({ exams: [], jobs: [], materials: [] });
      setLoading(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await api.search(trimmed);
        setResults(res);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const handleSelect = (url: string) => {
    onClose();
    navigate(url);
  };

  const totalResults = results.exams.length + results.jobs.length + results.materials.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search aptitude exams, verified jobs, formulas, topics (e.g. TCS, speed, DP)..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 hidden sm:inline">
            ESC
          </span>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-5">
          {loading ? (
            <div className="py-8 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : query.trim().length >= 2 && totalResults === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm">No matching records found for "{query}"</p>
              <p className="text-xs mt-1">Try keywords like "TCS", "Accenture", "Probability", "Quantitative"</p>
            </div>
          ) : query.trim().length < 2 ? (
            <div className="py-4 text-xs text-slate-400 text-center">
              Type at least 2 characters to search across all portal resources
            </div>
          ) : (
            <>
              {/* Exams */}
              {results.exams.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" />
                    Aptitude Exams ({results.exams.length})
                  </p>
                  <div className="space-y-1.5">
                    {results.exams.map((exam) => (
                      <div
                        key={exam.id}
                        onClick={() => handleSelect(`/exams/${exam.id}`)}
                        className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {exam.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {exam.category} • {exam.durationMinutes} mins • {exam.difficulty}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jobs */}
              {results.jobs.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-500" />
                    Verified Job Drives ({results.jobs.length})
                  </p>
                  <div className="space-y-1.5">
                    {results.jobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => handleSelect('/jobs')}
                        className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              {job.companyName}
                            </p>
                            <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                              {job.jobType.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {job.roleTitle} • {job.salaryRange}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Study Materials */}
              {results.materials.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                    Study Hub Materials ({results.materials.length})
                  </p>
                  <div className="space-y-1.5">
                    {results.materials.map((mat) => (
                      <div
                        key={mat.id}
                        onClick={() => handleSelect('/materials')}
                        className="p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer flex items-center justify-between border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {mat.title}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {mat.category} • {mat.contentType} • {mat.estimatedMinutes} mins
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Tip: Press <strong>ESC</strong> to close</span>
          <span>EduConnect Cross-Portal Intelligence</span>
        </div>
      </div>
    </div>
  );
};
