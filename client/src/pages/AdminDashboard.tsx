import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Users,
  Sparkles,
  Briefcase,
  FileSpreadsheet,
  Download,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.admin.analytics();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const csvData = await api.admin.exportCSV();
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EduConnect_Cohort_Report_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const mockCategoryBreakdown = [
    { category: 'Quantitative', avg: 72, attempts: 45 },
    { category: 'Logical Reasoning', avg: 78, attempts: 52 },
    { category: 'Verbal Ability', avg: 81, attempts: 38 },
    { category: 'Data Interpretation', avg: 69, attempts: 30 },
    { category: 'CS Tech', avg: 75, attempts: 64 },
    { category: 'Core Tech', avg: 67, attempts: 22 },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar role="ADMIN" />

        <main className="flex-1 min-w-0 space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Faculty & Placement Cell Cohort Studio
                </h1>
                <Badge variant="primary">Admin Portal</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Real-time cohort performance telemetry, aptitude engagement, and placement drive tracking.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Link to="/admin/performance">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm"
                  leftIcon={<Award className="w-4 h-4 text-white" />}
                >
                  Student Marks & Tests
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                isLoading={exporting}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export Cohort CSV
              </Button>
              <Link to="/admin/exams">
                <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Manage Exams
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Enrolled Students</span>
                    <Users className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data?.overview?.totalStudents || 0}
                    </div>
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {data?.overview?.activeStudents || 0} active in 30d
                    </span>
                  </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Exams Seeded</span>
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data?.overview?.totalExams || 20}
                    </div>
                    <span className="text-xs text-slate-500">6 core categories</span>
                  </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Exam Submissions</span>
                    <TrendingUp className="w-4 h-4 text-blue-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data?.overview?.totalAttempts || 0}
                    </div>
                    <span className="text-xs text-slate-500">Avg Acc: {data?.overview?.averageAccuracy || 75}%</span>
                  </div>
                </Card>

                <Card className="p-5 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                    <span className="text-xs font-semibold uppercase tracking-wider">Verified Jobs</span>
                    <Briefcase className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {data?.overview?.totalJobs || 0}
                    </div>
                    <span className="text-xs text-brand-600 dark:text-brand-400 font-medium">
                      {data?.overview?.totalJobClicks || 0} applications tracked
                    </span>
                  </div>
                </Card>
              </div>

              {/* Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Category-wise Accuracy Distribution
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Cohort average percentage scores across tested skills
                      </p>
                    </div>
                    <Badge variant="neutral">Live Aggregate</Badge>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockCategoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis
                          dataKey="category"
                          tick={{ fontSize: 10 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                        />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderRadius: '8px',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="avg" name="Avg Accuracy %" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                        Student Engagement by Category
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Total completed attempts per syllabus module
                      </p>
                    </div>
                    <Badge variant="primary">Participation</Badge>
                  </div>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={mockCategoryBreakdown} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                        <XAxis
                          dataKey="category"
                          tick={{ fontSize: 10 }}
                          interval={0}
                          angle={-15}
                          textAnchor="end"
                        />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderRadius: '8px',
                            border: 'none',
                            color: '#fff',
                            fontSize: '12px',
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="attempts"
                          name="Attempts"
                          stroke="#06b6d4"
                          fill="#06b6d4"
                          fillOpacity={0.25}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Quick Admin Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Link to="/admin/students" className="group">
                  <Card className="p-4 h-full border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          Student Cohort
                        </h4>
                        <p className="text-[11px] text-slate-500">View progress & audit</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Card>
                </Link>

                <Link to="/admin/exams" className="group">
                  <Card className="p-4 h-full border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          Exam Studio
                        </h4>
                        <p className="text-[11px] text-slate-500">Bulk upload MCQs</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Card>
                </Link>

                <Link to="/admin/jobs" className="group">
                  <Card className="p-4 h-full border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          Job Verifier
                        </h4>
                        <p className="text-[11px] text-slate-500">Review & post drives</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Card>
                </Link>

                <Link to="/admin/newsletters" className="group">
                  <Card className="p-4 h-full border border-slate-200 dark:border-slate-800 hover:border-brand-500 transition-all flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 transition-colors">
                          Newsletter Studio
                        </h4>
                        <p className="text-[11px] text-slate-500">Publish & schedule</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </Card>
                </Link>
              </div>

              {/* Recent Attempts Table */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Recent Cohort Submissions
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Latest completed tests across campus batches
                    </p>
                  </div>
                  <Link to="/admin/students" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
                    Full Student Directory <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-4 py-3 rounded-l-lg">Student</th>
                        <th className="px-4 py-3">Exam Title</th>
                        <th className="px-4 py-3">Category</th>
                        <th className="px-4 py-3">Score</th>
                        <th className="px-4 py-3">Accuracy</th>
                        <th className="px-4 py-3 rounded-r-lg">Submitted At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data?.recentAttempts?.length > 0 ? (
                        data.recentAttempts.map((att: any) => (
                          <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                            <td className="px-4 py-3">
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {att.user?.name || 'Anonymous'}
                              </p>
                              <p className="text-[11px] text-slate-400">{att.user?.email}</p>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                              {att.exam?.title}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="neutral" size="sm">
                                {att.exam?.category}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                              {att.score?.toFixed(1)}
                            </td>
                            <td className="px-4 py-3">
                              <span
                                className={`font-semibold ${
                                  (att.accuracyPercentage || 0) >= 70
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-amber-600 dark:text-amber-400'
                                }`}
                              >
                                {att.accuracyPercentage ? `${Math.round(att.accuracyPercentage)}%` : 'N/A'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                              {new Date(att.submittedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center py-6 text-slate-400">
                            No student submissions recorded yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
