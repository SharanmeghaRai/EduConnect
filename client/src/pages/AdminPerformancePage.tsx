import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api.js';
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { WhatsAppShareButton, WhatsAppButton } from '../components/ui/WhatsAppButton.js';
import {
  Award,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  BarChart2,
  BookCheck,
  TrendingUp,
  Users,
  Eye,
  RefreshCw,
  Sparkles,
  BookOpen,
  ArrowRight,
  GraduationCap,
  Layers,
  Check,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';

export const AdminPerformancePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    summary: {
      totalStudents: number;
      totalAttempts: number;
      cohortAverageScore: number;
      cohortAverageAccuracy: number;
      cohortPassRate: number;
      topDepartment: string;
      filteredCount: number;
    };
    exams: any[];
    departments: string[];
    studentCards: any[];
    attempts: any[];
    total: number;
  } | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PASSED' | 'FAILED'>('ALL');
  const [viewMode, setViewMode] = useState<'scorecards' | 'ledger'>('scorecards');

  // Selected student / attempt modal state
  const [selectedAttemptId, setSelectedAttemptId] = useState<string | null>(null);
  const [attemptDetails, setAttemptDetails] = useState<any | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Selected student for student-specific modal
  const [selectedStudentCard, setSelectedStudentCard] = useState<any | null>(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [search, selectedExamId, selectedDept, statusFilter]);

  const fetchPerformanceData = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (search) params.search = search;
      if (selectedExamId) params.examId = selectedExamId;
      if (selectedDept) params.department = selectedDept;
      if (statusFilter !== 'ALL') params.status = statusFilter;

      const res = await api.admin.performance(params);
      setData(res);
    } catch (err) {
      console.error('Failed to load performance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAttemptModal = async (attemptId: string) => {
    try {
      setSelectedAttemptId(attemptId);
      setLoadingDetails(true);
      const res = await api.admin.attemptDetails(attemptId);
      setAttemptDetails(res);
    } catch (err) {
      console.error('Failed to load attempt details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseAttemptModal = () => {
    setSelectedAttemptId(null);
    setAttemptDetails(null);
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const params: any = {};
      if (selectedExamId) params.examId = selectedExamId;
      if (selectedDept) params.department = selectedDept;

      const csvData = await api.admin.exportMarksCSV(params);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Sahyadri_Student_Exam_Marks_${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Marks export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  // Identify special Sahyadri & Japanese exams for quick tags
  const isSahyadriOrJapanese = (examTitle: string) => {
    return (
      examTitle.toLowerCase().includes('sahyadri') ||
      examTitle.toLowerCase().includes('japanese')
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar role="ADMIN" />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="brand" className="text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Faculty Placement Suite
                </Badge>
                <span className="text-xs text-slate-400 font-semibold">• Sahyadri Placement Cell</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
                <Award className="w-7 h-7 text-emerald-500" />
                Student Test Marks & Performance
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
                Inspect student marks across Sahyadri Aptitude tests, JLPT Japanese language exams, and technical mock evaluations. Analyze topic weaknesses, scorecards, and cohort benchmarks.
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={fetchPerformanceData}
                disabled={loading}
                className="flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={handleExportCSV}
                disabled={exporting}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm"
              >
                <Download className="w-4 h-4" />
                <span>{exporting ? 'Generating CSV...' : 'Export Marks CSV'}</span>
              </Button>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
            <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Students</span>
                <Users className="w-4 h-4 text-brand-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {data?.summary.totalStudents ?? '—'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Enrolled candidates</p>
            </Card>

            <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Tests Attempted</span>
                <BookCheck className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {data?.summary.totalAttempts ?? '—'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Completed mock sessions</p>
            </Card>

            <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cohort Accuracy</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {data?.summary.cohortAverageAccuracy ? `${data.summary.cohortAverageAccuracy}%` : '—'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Avg Score: {data?.summary.cohortAverageScore ?? 0} pts
              </p>
            </Card>

            <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cohort Pass Rate</span>
                <CheckCircle className="w-4 h-4 text-teal-500" />
              </div>
              <p className="text-2xl font-black text-teal-600 dark:text-teal-400">
                {data?.summary.cohortPassRate ? `${data.summary.cohortPassRate}%` : '—'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Qualified cutoff</p>
            </Card>

            <Card className="p-4 border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Top Performing Dept</span>
                <GraduationCap className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate" title={data?.summary.topDepartment}>
                {data?.summary.topDepartment || 'CSE'}
              </p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">Highest placement benchmark</p>
            </Card>
          </div>

          {/* Filter & Search Bar */}
          <Card className="p-4 mb-6 border-slate-200 dark:border-slate-800 shadow-soft-sm">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by student name, USN (e.g. 4SF22CS001), or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                />
              </div>

              {/* Exam Selector */}
              <div className="w-full lg:w-72">
                <select
                  value={selectedExamId}
                  onChange={(e) => setSelectedExamId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all truncate"
                >
                  <option value="">All Test Categories ({data?.exams.length || 0} exams)</option>
                  <optgroup label="Sahyadri Placement Drives & Japanese">
                    {data?.exams
                      .filter((ex) => isSahyadriOrJapanese(ex.title))
                      .map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          ⭐ {ex.title}
                        </option>
                      ))}
                  </optgroup>
                  <optgroup label="Technical & Core Mock Tests">
                    {data?.exams
                      .filter((ex) => !isSahyadriOrJapanese(ex.title))
                      .map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.title}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              {/* Department Selector */}
              <div className="w-full lg:w-48">
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all truncate"
                >
                  <option value="">All Branches</option>
                  {data?.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-start lg:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  All Status
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('PASSED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'PASSED'
                      ? 'bg-emerald-500 text-white shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Passed
                </button>
                <button
                  type="button"
                  onClick={() => setStatusFilter('FAILED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === 'FAILED'
                      ? 'bg-rose-500 text-white shadow-soft-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Retake
                </button>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl shrink-0">
                <button
                  type="button"
                  onClick={() => setViewMode('scorecards')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'scorecards'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Student Cards
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('ledger')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    viewMode === 'ledger'
                      ? 'bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-soft-sm font-bold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Marks Ledger
                </button>
              </div>
            </div>
          </Card>

          {/* Active Filter Indicators */}
          {(search || selectedExamId || selectedDept || statusFilter !== 'ALL') && (
            <div className="flex items-center flex-wrap gap-2 mb-4 text-xs">
              <span className="text-slate-400 font-semibold">Active filters:</span>
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="hover:text-rose-500">×</button>
                </span>
              )}
              {selectedExamId && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300">
                  Exam Filtered
                  <button onClick={() => setSelectedExamId('')} className="hover:text-rose-500">×</button>
                </span>
              )}
              {selectedDept && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                  Branch: {selectedDept}
                  <button onClick={() => setSelectedDept('')} className="hover:text-rose-500">×</button>
                </span>
              )}
              {statusFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter('ALL')} className="hover:text-rose-500">×</button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedExamId('');
                  setSelectedDept('');
                  setStatusFilter('ALL');
                }}
                className="text-brand-600 hover:underline font-semibold ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loading student test marks & evaluations...</p>
              <p className="text-xs text-slate-400 mt-1">Fetching candidate scorecards from Sahyadri database</p>
            </div>
          ) : data?.studentCards.length === 0 && data?.attempts.length === 0 ? (
            <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No student performance records found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                No students or test attempts matched your active search or branch criteria. Try selecting "All Branches" or resetting the search bar.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setSelectedExamId('');
                  setSelectedDept('');
                  setStatusFilter('ALL');
                }}
              >
                Reset Filters
              </Button>
            </Card>
          ) : viewMode === 'scorecards' ? (
            /* VIEW MODE A: STUDENT SCORECARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data?.studentCards.map((card) => {
                const { student, totalAttempts, passedAttempts, failedAttempts, averageAccuracy, bestScore, attempts } = card;
                const isHighPerformer = averageAccuracy >= 85;

                return (
                  <Card
                    key={student.id}
                    className="p-5 border-slate-200 dark:border-slate-800 hover:shadow-soft-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Student Top Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                            alt={student.name}
                            className="w-11 h-11 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                {student.name}
                              </h3>
                              {isHighPerformer && (
                                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 text-[10px] font-black uppercase tracking-wide">
                                  Top Tier
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                              USN: {student.rollNumber}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">
                              {student.department} • CGPA: {student.cgpa || 'N/A'}
                            </p>
                          </div>
                        </div>

                        {/* Overall Accuracy Gauge */}
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Accuracy
                          </span>
                          <span
                            className={`text-lg font-black ${
                              averageAccuracy >= 80
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : averageAccuracy >= 60
                                ? 'text-brand-600 dark:text-brand-400'
                                : 'text-amber-500'
                            }`}
                          >
                            {averageAccuracy}%
                          </span>
                        </div>
                      </div>

                      {/* Summary Metrics Row */}
                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 mb-3.5 text-center">
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 block">Tests Taken</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {totalAttempts}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 block">Passed</span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {passedAttempts} / {totalAttempts}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-semibold text-slate-400 block">Highest Mark</span>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {bestScore} pts
                          </span>
                        </div>
                      </div>

                      {/* Recent Test Attempts Pill List */}
                      <div className="space-y-1.5 mb-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Recent Test Marks
                        </span>
                        {attempts.slice(0, 3).map((att: any) => (
                          <div
                            key={att.id}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/50 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-xs"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                                {att.examTitle}
                              </p>
                              <span className="text-[10px] text-slate-400">
                                {new Date(att.submittedAt).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-bold text-slate-900 dark:text-white">
                                {att.score}/{att.maxScore}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  att.passed
                                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                                }`}
                              >
                                {att.passed ? 'PASS' : 'RETAKE'}
                              </span>
                              <button
                                onClick={() => handleOpenAttemptModal(att.id)}
                                className="p-1 rounded text-slate-400 hover:text-brand-600 hover:bg-white dark:hover:bg-slate-700"
                                title="Inspect test questions"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <WhatsAppShareButton
                        shareOptions={{
                          text: `*Sahyadri Placement Assessment Result*\nCandidate: ${student.name} (${student.rollNumber})\nScore: ${bestScore} pts\nAccuracy: ${averageAccuracy}%\nBranch: ${student.department}\nPortal: EduConnect Faculty Suite`,
                        }}
                        variant="subtle"
                        size="sm"
                        label="WhatsApp Share"
                      />

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudentCard(card)}
                        className="text-xs flex items-center gap-1 hover:text-brand-600"
                      >
                        <span>All Attempts ({totalAttempts})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            /* VIEW MODE B: DETAILED MARKS LEDGER (TABLE) */
            <Card className="border-slate-200 dark:border-slate-800 overflow-hidden shadow-soft-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Student & USN</th>
                      <th className="px-4 py-3">Branch</th>
                      <th className="px-4 py-3">Exam Title</th>
                      <th className="px-4 py-3">Marks Obtained</th>
                      <th className="px-4 py-3">Accuracy</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Time Spent</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data?.attempts.map((att: any) => (
                      <tr
                        key={att.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
                      >
                        {/* Student */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={att.student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt={att.student.name}
                              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white truncate max-w-[140px]">
                                {att.student.name}
                              </p>
                              <span className="font-mono text-[10px] text-brand-600 dark:text-brand-400 font-semibold">
                                {att.student.rollNumber}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Branch */}
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px]">
                            {att.student.department.replace('Engineering', 'Engg.')}
                          </span>
                        </td>

                        {/* Exam Title */}
                        <td className="px-4 py-3 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            {isSahyadriOrJapanese(att.exam.title) && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                            )}
                            <p className="font-semibold text-slate-900 dark:text-white truncate" title={att.exam.title}>
                              {att.exam.title}
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 uppercase font-mono">
                            {att.exam.category}
                          </span>
                        </td>

                        {/* Marks */}
                        <td className="px-4 py-3">
                          <div className="font-mono font-black text-slate-900 dark:text-white text-sm">
                            {att.score}{' '}
                            <span className="text-slate-400 text-xs font-normal">
                              / {att.maxScore}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400">
                            Cutoff: {att.exam.passingMarks}
                          </span>
                        </td>

                        {/* Accuracy */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-bold ${
                                att.accuracyPercentage >= 80
                                  ? 'text-emerald-600 dark:text-emerald-400'
                                  : att.accuracyPercentage >= 60
                                  ? 'text-brand-600 dark:text-brand-400'
                                  : 'text-rose-500'
                              }`}
                            >
                              {att.accuracyPercentage}%
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              att.passed
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                            }`}
                          >
                            {att.passed ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                PASSED
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                RETAKE
                              </>
                            )}
                          </span>
                        </td>

                        {/* Time Spent */}
                        <td className="px-4 py-3 text-slate-500">
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {Math.floor(att.timeSpentSeconds / 60)}m {att.timeSpentSeconds % 60}s
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 text-slate-500 text-[11px]">
                          {att.submittedAt ? new Date(att.submittedAt).toLocaleDateString() : 'N/A'}
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenAttemptModal(att.id)}
                            className="px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 ml-auto"
                          >
                            <Eye className="w-3.5 h-3.5 text-brand-500" />
                            <span>Review</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Pagination note */}
          {data && (
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
              <span>
                Showing <strong>{viewMode === 'scorecards' ? data.studentCards.length : data.attempts.length}</strong> records (Total evaluated: {data.summary.totalAttempts} attempts)
              </span>
              <span className="font-semibold text-slate-400">
                Official Sahyadri Placement & Aptitude Gradebook
              </span>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: INDIVIDUAL TEST ATTEMPT QUESTION BREAKDOWN */}
      <Modal
        isOpen={!!selectedAttemptId}
        onClose={handleCloseAttemptModal}
        title="Student Exam Scorecard & Question Analysis"
      >
        {loadingDetails ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-xs text-slate-500 font-semibold">Retrieving student answers and topic matrix...</p>
          </div>
        ) : attemptDetails ? (
          <div className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
            {/* Header Exam & Student Summary */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <Badge variant="brand" className="text-[10px] mb-1 font-mono uppercase">
                    {attemptDetails.attempt.exam.category}
                  </Badge>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {attemptDetails.attempt.exam.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Candidate:{' '}
                    <strong className="text-slate-800 dark:text-slate-200">
                      {attemptDetails.attempt.user.name}
                    </strong>{' '}
                    ({attemptDetails.attempt.user.studentProfile?.rollNumber || 'N/A'}) • {attemptDetails.attempt.user.studentProfile?.department}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Score</span>
                    <span className="text-xl font-black text-slate-900 dark:text-white font-mono">
                      {attemptDetails.attempt.score} / {attemptDetails.attempt.exam.totalMarks}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      attemptDetails.attempt.passed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {attemptDetails.attempt.passed ? 'PASSED' : 'RETAKE RECOMMENDED'}
                  </span>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 text-center text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Accuracy</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {attemptDetails.attempt.accuracyPercentage}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Percentile</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {attemptDetails.attempt.peerPercentile}th
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Time Taken</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {Math.floor(attemptDetails.attempt.timeSpentSeconds / 60)}m {attemptDetails.attempt.timeSpentSeconds % 60}s
                  </span>
                </div>
              </div>
            </div>

            {/* Topic Diagnostics Breakdown */}
            {attemptDetails.topicBreakdown && attemptDetails.topicBreakdown.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-brand-500" />
                  Topic Strength & Weakness Diagnostics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {attemptDetails.topicBreakdown.map((t: any) => (
                    <div
                      key={t.topic}
                      className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                          {t.topic}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {t.correctCount} of {t.totalQuestions} correct
                        </span>
                      </div>
                      <span
                        className={`font-mono font-bold ${
                          t.accuracyPercentage >= 75
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-amber-500'
                        }`}
                      >
                        {t.accuracyPercentage}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Question by Question Detailed Ledger */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                Individual Question Responses ({attemptDetails.attempt.answers.length} Questions)
              </h4>

              <div className="space-y-3">
                {attemptDetails.attempt.answers.map((ans: any, idx: number) => {
                  const q = ans.question;
                  const correctOption = q.options.find((o: any) => o.isCorrect);

                  return (
                    <div
                      key={ans.id}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        ans.isCorrect
                          ? 'border-emerald-200 dark:border-emerald-950/80 bg-emerald-50/30 dark:bg-emerald-950/20'
                          : 'border-rose-200 dark:border-rose-950/80 bg-rose-50/30 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          Q{idx + 1}. {q.prompt}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold shrink-0 ${
                            ans.isCorrect
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300'
                          }`}
                        >
                          {ans.marksAwarded > 0 ? `+${ans.marksAwarded}` : ans.marksAwarded} Marks
                        </span>
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mb-2.5">
                        {q.options.map((opt: any) => {
                          const isStudentSelected = ans.selectedOption?.id === opt.id;
                          const isCorrect = opt.isCorrect;

                          return (
                            <div
                              key={opt.id}
                              className={`p-2 rounded-lg border text-[11px] flex items-center gap-2 ${
                                isCorrect
                                  ? 'border-emerald-500 bg-emerald-100/60 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                                  : isStudentSelected && !isCorrect
                                  ? 'border-rose-500 bg-rose-100/60 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 line-through'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span className="w-5 h-5 rounded-md bg-white dark:bg-slate-800 border flex items-center justify-center font-bold text-[10px]">
                                {opt.label}
                              </span>
                              <span className="flex-1 truncate">{opt.text}</span>
                              {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                            </div>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {q.explanation && (
                        <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 mt-2">
                          <strong className="text-slate-900 dark:text-white">Explanation: </strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer with WhatsApp action */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <WhatsAppShareButton
                shareOptions={{
                  text: `*Sahyadri Exam Scorecard*\nCandidate: ${attemptDetails.attempt.user.name} (${attemptDetails.attempt.user.studentProfile?.rollNumber || 'N/A'})\nExam: ${attemptDetails.attempt.exam.title}\nScore: ${attemptDetails.attempt.score}/${attemptDetails.attempt.exam.totalMarks}\nAccuracy: ${attemptDetails.attempt.accuracyPercentage}%\nStatus: ${attemptDetails.attempt.passed ? 'PASSED' : 'RETAKE RECOMMENDED'}\nPortal: EduConnect Placement Suite`,
                }}
                variant="solid"
                size="sm"
                label="Share via WhatsApp"
              />

              <Button variant="outline" size="sm" onClick={handleCloseAttemptModal}>
                Close Scorecard
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* MODAL 2: STUDENT ALL ATTEMPTS HISTORY */}
      <Modal
        isOpen={!!selectedStudentCard}
        onClose={() => setSelectedStudentCard(null)}
        title={selectedStudentCard ? `${selectedStudentCard.student.name} — Full Test Portfolio` : 'Student History'}
      >
        {selectedStudentCard && (
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <img
                src={selectedStudentCard.student.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={selectedStudentCard.student.name}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {selectedStudentCard.student.name}
                </h4>
                <p className="text-xs font-mono font-semibold text-brand-600 dark:text-brand-400">
                  {selectedStudentCard.student.rollNumber} • {selectedStudentCard.student.department}
                </p>
                <p className="text-[11px] text-slate-500">
                  Email: {selectedStudentCard.student.email} • CGPA: {selectedStudentCard.student.cgpa || 'N/A'}
                </p>
              </div>
            </div>

            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Complete Test Records ({selectedStudentCard.attempts.length})
            </h5>

            <div className="space-y-2">
              {selectedStudentCard.attempts.map((att: any) => (
                <div
                  key={att.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all flex items-center justify-between text-xs"
                >
                  <div>
                    <Badge variant="neutral" className="text-[9px] font-mono uppercase mb-1">
                      {att.examCategory}
                    </Badge>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {att.examTitle}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      Attempted on {new Date(att.submittedAt).toLocaleDateString()} • {Math.floor(att.timeSpentSeconds / 60)} mins
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                        {att.score}/{att.maxScore}
                      </span>
                      <span className="block text-[10px] font-bold text-emerald-600">
                        {att.accuracyPercentage}% acc
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedStudentCard(null);
                        handleOpenAttemptModal(att.id);
                      }}
                      className="px-2.5 py-1 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminPerformancePage;
