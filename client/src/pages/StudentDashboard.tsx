import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Target,
  BookOpen,
  Briefcase,
  TrendingUp,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  ChevronRight,
  ExternalLink,
  Award,
  Eye,
  Languages,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { api } from '../services/api.js';
import { useAuth } from '../context/AuthContext.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import {
  PdfReferenceModal,
  SAHYADRI_REFERENCE_PDFS,
} from '../components/ui/PdfReferenceModal.js';
import { WhatsAppShareButton } from '../components/ui/WhatsAppButton.js';
import {
  formatStudyMaterialShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../utils/whatsapp.js';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [featuredExams, setFeaturedExams] = useState<any[]>([]);

  // PDF Reference Material Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfFilename, setSelectedPdfFilename] = useState('Accenture_Test_1.pdf');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashRes, examsRes] = await Promise.all([
          api.students.dashboard(),
          api.exams.list(),
        ]);
        setData(dashRes);

        // Extract 3 Sahyadri Aptitude + 2 Japanese exams
        const all = examsRes.exams || [];
        const sahyadri = all.filter(
          (e: any) =>
            e.slug.includes('sahyadri-aptitude') ||
            (e.category === 'APTITUDE' && e.title.includes('Sahyadri'))
        );
        const japanese = all.filter(
          (e: any) =>
            e.slug.includes('japanese') ||
            e.category === 'JAPANESE' ||
            e.title.toLowerCase().includes('japanese')
        );

        const combined = [...sahyadri, ...japanese];
        setFeaturedExams(combined.length > 0 ? combined : all.slice(0, 5));
      } catch (err) {
        console.error('Failed to load student dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleOpenPdf = (filename: string) => {
    setSelectedPdfFilename(filename);
    setIsPdfModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const upcomingJobs = data?.upcomingJobs || [];
  const latestNewsletter = data?.latestNewsletter;

  return (
    <StudentLayout>
      <div className="space-y-6 sm:space-y-8 animate-fade-in">
        {/* Welcome & Streak Banner */}
        <div className="p-6 sm:p-7 rounded-lg bg-slate-900 dark:bg-slate-900 border border-slate-800 text-white shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 text-[11px] font-semibold text-slate-200 mb-2.5">
              <span>Placement Season 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mt-1 leading-relaxed">
              Targeting: <strong className="text-slate-200">{user?.studentProfile?.targetRoles || 'Software Development Engineer'}</strong>
              {user?.studentProfile?.department && ` • ${user.studentProfile.department}`}
            </p>
          </div>

          {/* Prep Streak Counter */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-lg border border-white/10">
            <div>
              <p className="text-xl font-display font-black leading-tight text-white">
                {stats.streakDays || 7} Days
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Daily Prep Streak</p>
            </div>
          </div>
        </div>

        {/* 4 Overview Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <Card className="p-4 sm:p-5">
            <div className="mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Tests Completed
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              {stats.completedAttempts || 0}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Best Score: <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.bestScore ? `${stats.bestScore} pts` : '—'}</span>
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Average Accuracy
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              {stats.averageAccuracy || 85}%
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Top 10% cutoff is ~80%
            </p>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Study Hub Progress
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              {stats.preparationProgressPercentage || 30}%
            </p>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-brand-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.preparationProgressPercentage || 30}%` }}
              />
            </div>
          </Card>

          <Card className="p-4 sm:p-5">
            <div className="mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Saved Job Drives
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-display font-black text-slate-900 dark:text-white">
              {stats.savedJobsCount || 4}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              All verified by Placement Board
            </p>
          </Card>
        </div>

        {/* ============================================================== */}
        {/* NEW SECTION 1: FEATURED TRACK - 3 APTITUDE + 2 JAPANESE TESTS */}
        {/* ============================================================== */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Featured Assessment Track (3 Aptitude + 2 Japanese Language Tests)
                </h3>
                <Badge variant="primary">Campus Screening</Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Practice the exact patterns evaluated by Tier-1 IT drives and Japanese bilingual technology recruitment cells.
              </p>
            </div>
            <Link
              to="/exams"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 shrink-0"
            >
              Go to Full Test Suite <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredExams.map((ex: any) => {
              const isJapanese =
                ex.category === 'JAPANESE' || ex.slug?.includes('japanese');
              const isSahyadri =
                ex.slug?.includes('sahyadri-aptitude') || ex.title?.includes('Sahyadri');

              return (
                <Card
                  key={ex.id}
                  hoverEffect
                  className={`p-4 flex flex-col justify-between border ${
                    isJapanese
                      ? 'border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-white to-rose-50/30 dark:from-slate-900 dark:to-rose-950/20'
                      : isSahyadri
                      ? 'border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-white to-indigo-50/30 dark:from-slate-900 dark:to-indigo-950/20'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isJapanese
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300'
                            : isSahyadri
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isJapanese
                          ? 'JLPT N5 Japanese'
                          : isSahyadri
                          ? 'Sahyadri Placement Drive'
                          : ex.category}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        {ex.difficulty}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
                      {ex.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {ex.description || 'Full timed mock test with negative marking & derivations.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" /> {ex.durationMinutes}m • {ex._count?.questions || 15} Qs
                    </span>

                    <Link to={`/exams/${ex.id}`}>
                      <Button
                        size="sm"
                        variant={isJapanese ? 'danger' : 'primary'}
                        className="text-xs font-semibold py-1 px-3"
                      >
                        Start Test
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* NEW SECTION 2: SAHYADRI APTITUDE REFERENCE MATERIALS (MODAL VIEW) */}
        {/* ============================================================== */}
        <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                  Sahyadri Aptitude Reference Materials & Company Past Papers
                </h3>
                <Badge variant="success">8 Source PDFs</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenPdf('Accenture_Test_1.pdf')}
              leftIcon={<Eye className="w-4 h-4 text-brand-600" />}
            >
              Open PDF Viewer
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SAHYADRI_REFERENCE_PDFS.map((doc) => (
              <Card
                key={doc.id}
                hoverEffect
                onClick={() => handleOpenPdf(doc.filename)}
                className="p-4 flex flex-col justify-between border border-slate-200 dark:border-slate-800 group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {doc.company}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {doc.size}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                    {doc.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenPdf(doc.filename)}
                    className="text-xs flex-1 justify-center"
                    leftIcon={<Eye className="w-3.5 h-3.5" />}
                  >
                    Open PDF
                  </Button>

                  <WhatsAppShareButton
                    shareOptions={{
                      phone: APTITUDE_SIR_PHONE,
                      text: formatStudyMaterialShareText({
                        title: doc.title,
                        category: `Sahyadri Past Papers (${doc.company})`,
                        resourceType: 'PDF Reference Paper',
                        url: `${window.location.origin}/reference-materials/${doc.filename}`,
                      }),
                    }}
                    variant="icon-only"
                    size="sm"
                    title={`Ask doubts on this past paper to Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
                  />

                  <a
                    href={`/reference-materials/${doc.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Open in Full Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4 sm:p-6 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Score Trajectory Over Attempts
                </h3>
                <p className="text-xs text-slate-400">Performance benchmark across consecutive mock tests</p>
              </div>
              <Badge variant="primary" size="sm">Accuracy Trend</Badge>
            </div>
            <div className="h-60 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.scoreProgression || []}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="attempt" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 min-w-0 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Topic Strength & Weakness Radar
                </h3>
                <p className="text-xs text-slate-400">Multi-axis competency across placement sections</p>
              </div>
              <Badge variant="neutral" size="sm">Profile Radar</Badge>
            </div>
            <div className="h-60 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={charts.categoryRadar || []}>
                  <PolarGrid opacity={0.2} />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name="Accuracy %" dataKey="accuracy" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.35} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Upcoming Verified Job Deadlines & Newsletter */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming Placement Deadlines
              </h3>
              <Link to="/jobs" className="text-xs text-brand-600 font-semibold hover:underline">
                All Opportunities
              </Link>
            </div>

            <Card className="divide-y divide-slate-100 dark:divide-slate-800">
              {upcomingJobs.map((job: any) => (
                <div key={job.id} className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {job.companyName}
                    </span>
                    <span className="text-[10px] font-semibold text-rose-500 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full shrink-0">
                      Closes {new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {job.roleTitle}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">{job.salaryRange}</span>
                    <a
                      href={job.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline flex items-center gap-1"
                    >
                      Apply <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Latest Newsletter Card */}
          {latestNewsletter && (
            <Card className="p-4 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-800/40 border-slate-200 dark:border-slate-800">
              <div className="mb-2 text-slate-700 dark:text-slate-300 text-xs font-bold">
                <span>Placement Bulletin #{latestNewsletter.editionNumber}</span>
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                {latestNewsletter.title}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                {latestNewsletter.summary}
              </p>
              <Link to={`/newsletter`}>
                <Button size="sm" variant="ghost" className="mt-2 text-xs font-semibold p-0 text-brand-600 hover:text-brand-700 dark:text-brand-400">
                  Read Issue <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </Card>
          )}
        </div>
      </div>

      {/* PDF Reference Material Modal */}
      <PdfReferenceModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialPdfFilename={selectedPdfFilename}
      />
    </StudentLayout>
  );
};
