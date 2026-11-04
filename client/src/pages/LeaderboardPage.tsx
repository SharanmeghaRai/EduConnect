import React, { useEffect, useState } from 'react';
import {
  Trophy,
  Award,
  Medal,
  Users,
  Target,
  Filter,
  TrendingUp,
  GraduationCap,
  Star,
  CheckCircle2,
  Flame,
  Zap,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { LeaderboardEntry, StreakSummary } from '../types/index.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const LeaderboardPage: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<LeaderboardEntry | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [streakSummary, setStreakSummary] = useState<StreakSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');
  const [selectedSort, setSelectedSort] = useState<'percentile' | 'streak' | 'accuracy'>('percentile');

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.students.leaderboard({
        category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
        department: selectedDepartment !== 'ALL' ? selectedDepartment : undefined,
        sortBy: selectedSort,
      });
      setLeaderboard(res.leaderboard || []);
      setCurrentUserRank(res.currentUserRank || null);
      setTotalParticipants(res.totalParticipants || 0);
      if (res.streakSummary) {
        setStreakSummary(res.streakSummary);
      }
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [selectedCategory, selectedDepartment, selectedSort]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-400 text-white font-black text-xs flex items-center justify-center shadow-md ring-2 ring-amber-300">
          🥇 1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-md ring-2 ring-slate-200">
          🥈 2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md ring-2 ring-amber-600">
          🥉 3
        </span>
      );
    }
    return (
      <span className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center border border-slate-200 dark:border-slate-700">
        #{rank}
      </span>
    );
  };

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/80 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <Trophy className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Sahyadri Campus Cohort Rankings
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Placement Prep Leaderboard
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Benchmarked across all timed mock exam attempts. Rankings reflect aggregate percentile, negative marking discipline, and consistency.
              </p>
            </div>

            {/* Current user rank summary */}
            {currentUserRank && (
              <div className="p-4 rounded-lg bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 border border-brand-200 dark:border-brand-800 shrink-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Your Standing</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-2xl font-display font-black text-brand-700 dark:text-brand-300">
                    Rank #{currentUserRank.rank}
                  </span>
                  <span className="text-xs text-slate-500">
                    of {totalParticipants}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1">
                  {currentUserRank.avgPercentile.toFixed(0)}th Percentile • {currentUserRank.avgAccuracy.toFixed(1)}% Acc
                </p>
              </div>
            )}
          </div>

          {/* Filters & Sort Controls */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Track:
              </span>
              {[
                { id: 'ALL', label: 'Overall' },
                { id: 'QUANT', label: 'Quantitative' },
                { id: 'LOGICAL', label: 'Logical' },
                { id: 'VERBAL', label: 'Verbal' },
                { id: 'TECH_CS', label: 'CS Tech' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                    selectedCategory === c.id
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Sort Criteria Tabs & Department Select */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-1 p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs">
                <button
                  onClick={() => setSelectedSort('percentile')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    selectedSort === 'percentile'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Percentile
                </button>
                <button
                  onClick={() => setSelectedSort('streak')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all flex items-center gap-1 ${
                    selectedSort === 'streak'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-500 hover:text-amber-500 dark:hover:text-amber-400'
                  }`}
                  title="Rank candidates by active preparation streak days"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Streak Champions</span>
                </button>
                <button
                  onClick={() => setSelectedSort('accuracy')}
                  className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                    selectedSort === 'accuracy'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Accuracy
                </button>
              </div>

              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
              >
                <option value="ALL">All Departments</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Science">Information Science</option>
                <option value="Electronics">Electronics (ECE)</option>
                <option value="Mechanical">Mechanical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Daily Prep Streak Maintenance & Consistency Tracker Card */}
        <div className="p-5 sm:p-6 rounded-lg bg-slate-900 border border-slate-800 text-white shadow-soft-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Left: Streak Status & Counter */}
            <div className="flex items-center gap-4">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Flame className="w-7 h-7 sm:w-8 sm:h-8 fill-amber-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-2xl sm:text-3xl font-display font-black text-white">
                    {streakSummary?.currentStreak ?? (currentUserRank?.streakDays || 7)} Days
                  </span>
                  {streakSummary?.isMaintainedToday ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Streak Maintained Today
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold animate-pulse">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Streak Pending Today
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-lg">
                  {streakSummary?.isMaintainedToday
                    ? "Great consistency! You have logged active placement prep today. Keep it rolling tomorrow to extend your streak."
                    : "Your streak is at risk! Complete 1 timed mock test or review study materials before midnight to keep your streak intact."}
                </p>
              </div>
            </div>

            {/* Middle: Trailing 7-Day Activity Matrix */}
            <div className="flex flex-col items-start lg:items-end gap-2 w-full lg:w-auto">
              <div className="flex items-center justify-between w-full lg:w-auto gap-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  7-Day Streak Matrix
                </span>
                <span className="text-[11px] font-semibold text-amber-300">
                  {streakSummary?.streakTitle || 'Weekly Warrior'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                {streakSummary?.weeklyActivity.map((day, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                        day.isCompleted
                          ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                          : idx === 6 && !streakSummary?.isMaintainedToday
                          ? 'bg-amber-500/10 border border-amber-400/50 text-amber-400 animate-pulse'
                          : 'bg-white/5 border border-white/10 text-slate-500'
                      }`}
                      title={`${day.dayName} (${day.date}): ${day.isCompleted ? 'Maintained' : 'Pending'}`}
                    >
                      {day.isCompleted ? (
                        <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ) : (
                        <span className="text-[10px]">{day.dayName.slice(0, 1)}</span>
                      )}
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">{day.dayName}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Milestone & Quick Action */}
            <div className="p-3.5 rounded-md bg-white/5 border border-white/10 text-xs space-y-2 shrink-0 w-full lg:w-auto min-w-[210px]">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400">Next Milestone:</span>
                <span className="font-bold text-amber-300 font-mono">
                  {streakSummary?.nextMilestone || 14} Days
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-400 h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      (((streakSummary?.currentStreak || 7) % (streakSummary?.nextMilestone || 14)) /
                        (streakSummary?.nextMilestone || 14)) *
                        100
                    )}%`,
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                <span>{streakSummary?.daysToNextMilestone || 3} days to next badge</span>
                <a
                  href="/exams"
                  className="text-amber-400 font-bold hover:underline flex items-center gap-0.5"
                >
                  Take Mock <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Podium Top 3 */}
        {!loading && top3.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((entry) => (
              <div
                key={entry.userId}
                className={`p-6 rounded-lg border text-center relative overflow-hidden ${
                  entry.rank === 1
                    ? 'bg-gradient-to-b from-amber-50 to-white dark:from-amber-950/30 dark:to-slate-900 border-amber-300 dark:border-amber-700 shadow-md md:-translate-y-2'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-soft-sm'
                }`}
              >
                <div className="flex justify-center mb-3">
                  {getRankBadge(entry.rank)}
                </div>

                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-soft-md">
                  {entry.name.slice(0, 2).toUpperCase()}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center justify-center gap-1.5">
                  {entry.name}
                  {entry.isCurrentUser && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold">
                      You
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{entry.department}</p>

                <div className="flex items-center justify-center gap-1.5 mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-700 dark:text-amber-300 font-bold text-[11px]">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{entry.streakDays}d Streak</span>
                  </span>
                  {entry.isStreakMaintainedToday && (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      • Maintained
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
                  <div>
                    <p className="text-xs font-black text-brand-600 dark:text-brand-400">
                      {entry.avgPercentile.toFixed(0)}%
                    </p>
                    <p className="text-[9px] text-slate-400">Percentile</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {entry.avgAccuracy.toFixed(1)}%
                    </p>
                    <p className="text-[9px] text-slate-400">Accuracy</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-purple-600 dark:text-purple-400">
                      {entry.totalAttempts}
                    </p>
                    <p className="text-[9px] text-slate-400">Attempts</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Full Table */}
        {loading ? (
          <div className="min-h-[30vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leaderboard.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No cohort rankings yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Complete mock exams to establish peer percentiles and claim your spot on the Sahyadri leaderboard.
            </p>
          </Card>
        ) : (
          <div className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-soft-sm">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                All Ranked Aspirants ({leaderboard.length})
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">
                Sorted by {selectedSort === 'streak' ? 'Streak Days' : selectedSort === 'accuracy' ? 'Accuracy' : 'Percentile'}
              </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {leaderboard.map((item) => (
                <div
                  key={item.userId}
                  className={`px-6 py-4 flex items-center justify-between gap-4 transition-colors ${
                    item.isCurrentUser
                      ? 'bg-brand-50/60 dark:bg-brand-950/30'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {getRankBadge(item.rank)}

                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {item.name.slice(0, 2).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {item.name}
                        </h4>
                        {item.isCurrentUser && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-600 dark:text-brand-300 font-bold">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.department} • USN: {item.rollNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 sm:gap-6 text-right">
                    <div>
                      <div className="flex items-center gap-1 justify-end">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span className="text-sm font-display font-black text-slate-900 dark:text-white">
                          {item.streakDays}d
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {item.isStreakMaintainedToday ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Active Today</span>
                        ) : (
                          'Streak'
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-display font-black text-brand-600 dark:text-brand-400">
                        {item.avgPercentile.toFixed(0)}th
                      </p>
                      <p className="text-[10px] text-slate-400">Percentile</p>
                    </div>

                    <div className="hidden sm:block">
                      <p className="text-sm font-display font-bold text-emerald-600 dark:text-emerald-400">
                        {item.avgAccuracy.toFixed(1)}%
                      </p>
                      <p className="text-[10px] text-slate-400">Accuracy</p>
                    </div>

                    <div className="hidden md:block">
                      <p className="text-sm font-display font-bold text-slate-900 dark:text-white">
                        {item.totalAttempts}
                      </p>
                      <p className="text-[10px] text-slate-400">Attempts</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
