import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Clock,
  Award,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  Filter,
  Layers,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '../services/api.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const ExamHistoryPage: React.FC = () => {
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'COMPLETED' | 'TIMED_OUT'>('ALL');
  const [sortField, setSortField] = useState<'DATE' | 'SCORE' | 'ACCURACY'>('DATE');

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const res = await api.exams.myAttempts();
      setAttempts(res.attempts || []);
    } catch (err) {
      console.error('Failed to load exam history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  // Filter & sort
  const filteredAttempts = attempts
    .filter((att) => {
      if (statusFilter === 'COMPLETED') return att.status === 'COMPLETED';
      if (statusFilter === 'TIMED_OUT') return att.status === 'TIMED_OUT';
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'SCORE') return b.score - a.score;
      if (sortField === 'ACCURACY') return b.accuracyPercentage - a.accuracyPercentage;
      return new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime();
    });

  // Chart data: trajectory of scores over time
  const chartData = [...attempts]
    .filter((a) => a.status === 'COMPLETED')
    .sort((a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime())
    .map((a, idx) => ({
      name: `Attempt ${idx + 1}`,
      accuracy: Math.round(a.accuracyPercentage),
      percentile: Math.round(a.peerPercentile),
      exam: a.exam?.title || 'Exam',
    }));

  const avgAccuracy = attempts.length
    ? Math.round(
        attempts.reduce((sum, a) => sum + (a.accuracyPercentage || 0), 0) / attempts.length
      )
    : 0;

  const totalCompleted = attempts.filter((a) => a.status === 'COMPLETED').length;

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <History className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Candidate Assessment History
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Exam Attempt History & Telemetry
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Review past mock test performances, track accuracy trajectories across company tracks, and open question-by-question derivations.
              </p>
            </div>

            <Link to="/exams">
              <Button size="sm" className="font-semibold text-xs gap-1.5 shrink-0">
                Take New Exam
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-2xl font-display font-black text-brand-600 dark:text-brand-400">
                {attempts.length}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Total Attempts</p>
            </div>
            <div>
              <p className="text-2xl font-display font-black text-emerald-600 dark:text-emerald-400">
                {totalCompleted}
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Completed Mocks</p>
            </div>
            <div>
              <p className="text-2xl font-display font-black text-indigo-600 dark:text-indigo-400">
                {avgAccuracy}%
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Average Accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-display font-black text-purple-600 dark:text-purple-400">
                {attempts.length ? Math.max(...attempts.map((a) => a.peerPercentile || 0)).toFixed(0) : 0}%
              </p>
              <p className="text-[11px] font-medium text-slate-400 mt-0.5">Peak Peer Percentile</p>
            </div>
          </div>
        </div>

        {/* Trajectory AreaChart */}
        {chartData.length > 1 && (
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-brand-500" />
                  Accuracy & Percentile Progression
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Timeline of scores across completed mock exam attempts
                </p>
              </div>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="percGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      borderRadius: '12px',
                      border: 'none',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="accuracy"
                    stroke="#6366f1"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#accGrad)"
                    name="Accuracy %"
                  />
                  <Area
                    type="monotone"
                    dataKey="percentile"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#percGrad)"
                    name="Percentile %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Filter & Sort Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {(['ALL', 'COMPLETED', 'TIMED_OUT'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === st
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Sort:</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="DATE">Recent First</option>
              <option value="SCORE">Highest Score</option>
              <option value="ACCURACY">Best Accuracy</option>
            </select>
          </div>
        </div>

        {/* Attempts Table */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAttempts.length === 0 ? (
          <Card className="p-12 text-center">
            <History className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No attempts recorded</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
              You haven't attempted any mock exams yet. Jump into the catalog and begin your first timed assessment.
            </p>
            <Link to="/exams">
              <Button size="sm">Go to Exam Catalog</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredAttempts.map((att) => (
              <div
                key={att.id}
                className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm hover:border-brand-300 dark:hover:border-brand-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      att.status === 'COMPLETED'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {att.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <Clock className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {att.exam?.title || 'Placement Exam'}
                      </h4>
                      <Badge variant="default" size="sm">
                        Attempt #{att.attemptNumber}
                      </Badge>
                      {att.exam?.category && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {att.exam.category}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(att.startedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s spent
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Review */}
                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-right">
                    <p className="text-lg font-display font-black text-slate-900 dark:text-white">
                      {att.score.toFixed(1)} / {att.maxScore.toFixed(0)}
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {att.accuracyPercentage.toFixed(1)}% Accuracy • {att.peerPercentile.toFixed(0)}th Percentile
                    </p>
                  </div>

                  <Link to={`/exams/attempts/${att.id}/review`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <span>Review</span>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
