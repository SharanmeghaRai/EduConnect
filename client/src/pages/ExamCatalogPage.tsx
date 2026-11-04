import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Award,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  BookCheck,
  FileText,
  Eye,
  ExternalLink,
  Download,
  BookOpen,
  Languages,
  Building,
  Layers,
  X,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Exam } from '../types/index.js';
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import {
  PdfReferenceModal,
  SAHYADRI_REFERENCE_PDFS,
  ReferencePdf,
} from '../components/ui/PdfReferenceModal.js';
import { WhatsAppShareButton } from '../components/ui/WhatsAppButton.js';
import {
  formatExamShareText,
  formatStudyMaterialShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../utils/whatsapp.js';

export const ExamCatalogPage: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'FEATURED' | 'APTITUDE' | 'JAPANESE' | 'ALL'>('FEATURED');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // PDF Reference Material Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfFilename, setSelectedPdfFilename] = useState('Accenture_Test_1.pdf');

  useEffect(() => {
    const loadExams = async () => {
      try {
        const res = await api.exams.list();
        setExams(res.exams);
      } catch (err) {
        console.error('Failed to load exams catalog:', err);
      } finally {
        setLoading(false);
      }
    };
    loadExams();
  }, []);

  // Filter 3 Aptitude + 2 Japanese tests
  const sahyadriAptitudeExams = exams.filter(
    (e) =>
      e.slug.includes('sahyadri-aptitude') ||
      (e.category === 'APTITUDE' && e.title.includes('Sahyadri'))
  );

  const japaneseLanguageExams = exams.filter(
    (e) =>
      e.slug.includes('japanese') ||
      e.category === 'JAPANESE' ||
      e.title.toLowerCase().includes('japanese')
  );

  // Grouped filtered exams
  const getDisplayedExams = () => {
    let list: Exam[] = [];

    if (activeTab === 'FEATURED') {
      // 3 Aptitude Tests + 2 Japanese Tests prominently featured
      list = [...sahyadriAptitudeExams, ...japaneseLanguageExams];
      // Fallback if not loaded yet: match by category or slug
      if (list.length === 0) {
        list = exams.slice(0, 5);
      }
    } else if (activeTab === 'APTITUDE') {
      list = sahyadriAptitudeExams.length > 0
        ? sahyadriAptitudeExams
        : exams.filter((e) => ['QUANT', 'LOGICAL', 'APTITUDE'].includes(e.category)).slice(0, 3);
    } else if (activeTab === 'JAPANESE') {
      list = japaneseLanguageExams;
    } else {
      list = exams;
    }

    return list.filter((exam) => {
      const matchesDifficulty =
        selectedDifficulty === 'ALL' || exam.difficulty === selectedDifficulty;
      const matchesSearch =
        exam.title.toLowerCase().includes(search.toLowerCase()) ||
        (exam.description && exam.description.toLowerCase().includes(search.toLowerCase())) ||
        exam.category.toLowerCase().includes(search.toLowerCase());
      return matchesDifficulty && matchesSearch;
    });
  };

  const displayedExams = getDisplayedExams();

  const filteredPdfs = SAHYADRI_REFERENCE_PDFS.filter((doc) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.company.toLowerCase().includes(q) ||
      doc.description.toLowerCase().includes(q) ||
      doc.filename.toLowerCase().includes(q)
    );
  });

  const handleOpenPdf = (filename: string) => {
    setSelectedPdfFilename(filename);
    setIsPdfModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 min-w-0 space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm relative overflow-hidden">
            <div className="max-w-3xl relative z-10">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/80 text-xs font-bold text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                  3 Company Aptitude Tests + 2 Japanese Language Tests
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <BookOpen className="w-3.5 h-3.5" />
                  8 Sahyadri Reference PDFs Included
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Placement & Bilingual Language Testing Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Take timed placement screening exams modeled after actual campus recruitment patterns (Accenture, TCS, Infosys, Cognizant) and bilingual JLPT N5 Japanese language drives. Consult company past papers in the modal reader anytime.
              </p>
            </div>

            {/* Quick Navigation Filter Pills */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <button
                  onClick={() => setActiveTab('FEATURED')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === 'FEATURED'
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <span>Featured: 3 Aptitude + 2 Japanese</span>
                </button>

                <button
                  onClick={() => setActiveTab('APTITUDE')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === 'APTITUDE'
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>3 Sahyadri Aptitude Tests</span>
                </button>

                <button
                  onClick={() => setActiveTab('JAPANESE')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeTab === 'JAPANESE'
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>2 Japanese Language Tests</span>
                </button>

                <button
                  onClick={() => setActiveTab('ALL')}
                  className={`px-3 py-2 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    activeTab === 'ALL'
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  All 25 Tests
                </button>
              </div>

              {/* Search & Difficulty filter */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative flex-1 sm:w-56">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search test topics..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-7 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      title="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 1: THE TEST GIVING CATALOG (3 Aptitude + 2 Japanese) */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  {activeTab === 'FEATURED'
                    ? 'Featured Assessment Track (3 Aptitude + 2 Japanese)'
                    : activeTab === 'APTITUDE'
                    ? '3 Sahyadri Company Aptitude Tests'
                    : activeTab === 'JAPANESE'
                    ? '2 Basic Japanese Language Tests (JLPT N5)'
                    : 'Complete Exam Catalog'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Timed testing engine with countdown clock, auto-save synchronization, and step-by-step solutions.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Showing {displayedExams.length} tests
              </span>
            </div>

            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              </div>
            ) : displayedExams.length === 0 ? (
              <Card className="p-8 text-center text-slate-400">
                No matching examinations found. Try switching categories.
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedExams.map((exam) => {
                  const isJapanese =
                    exam.category === 'JAPANESE' || exam.slug.includes('japanese');
                  const isSahyadriAptitude =
                    exam.slug.includes('sahyadri-aptitude') ||
                    exam.title.includes('Sahyadri');

                  return (
                    <Card
                      key={exam.id}
                      className={`p-5 flex flex-col justify-between hover:shadow-soft-lg transition-all border ${
                        isJapanese
                          ? 'border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-white to-rose-50/20 dark:from-slate-900 dark:to-rose-950/20'
                          : isSahyadriAptitude
                          ? 'border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-white to-indigo-50/20 dark:from-slate-900 dark:to-indigo-950/20'
                          : 'border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      <div>
                        {/* Header Badges */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              isJapanese
                                ? 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800'
                                : isSahyadriAptitude
                                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
                                : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                            }`}
                          >
                            {isJapanese
                              ? 'JLPT N5 Japanese'
                              : isSahyadriAptitude
                              ? 'Sahyadri Placement Drive'
                              : exam.category}
                          </span>

                          <Badge
                            variant={
                              exam.difficulty === 'EASY'
                                ? 'success'
                                : exam.difficulty === 'MEDIUM'
                                ? 'warning'
                                : 'danger'
                            }
                            size="sm"
                          >
                            {exam.difficulty}
                          </Badge>
                        </div>

                        {/* Exam Title */}
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                          {exam.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                          {exam.description || 'Comprehensive placement screening examination.'}
                        </p>

                        {/* Spec Pills */}
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <span className="block text-[10px] text-slate-400">Duration</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {exam.durationMinutes}m
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <span className="block text-[10px] text-slate-400">Questions</span>
                            <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                              {exam._count?.questions ?? 15} MCQs
                            </span>
                          </div>

                          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                            <span className="block text-[10px] text-slate-400">Penalty</span>
                            <span className="font-bold text-rose-500 mt-0.5">
                              -{exam.negativeMarkingRatio || 0.25}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action */}
                      <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                        <Link to={`/exams/${exam.id}`} className="flex-1">
                          <Button
                            variant={isJapanese ? 'danger' : isSahyadriAptitude ? 'primary' : 'outline'}
                            size="sm"
                            className="w-full text-xs font-bold justify-center"
                          >
                            Start Timed Exam
                          </Button>
                        </Link>
                        <WhatsAppShareButton
                          shareOptions={{
                            phone: APTITUDE_SIR_PHONE,
                            text: formatExamShareText({
                              title: exam.title,
                              durationMinutes: exam.durationMinutes,
                              questionsCount: exam._count?.questions ?? 15,
                              category: exam.category,
                              difficulty: exam.difficulty,
                              id: exam.id,
                            }),
                          }}
                          variant="icon-only"
                          size="sm"
                          title={`Ask doubts on this exam to Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
                        />
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          {/* SECTION 2: SAHYADRI APTITUDE REFERENCE MATERIALS & PDF REPOSITORY (MODAL VIEW) */}
          <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    Sahyadri Aptitude Reference Materials & Company Papers
                  </h2>
                  <Badge variant="success">8 Source PDFs</Badge>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenPdf('Accenture_Test_1.pdf')}
                leftIcon={<BookOpen className="w-4 h-4 text-brand-600" />}
              >
                Launch PDF Reader
              </Button>
            </div>

            {/* Grid of PDF Resource Cards */}
            {filteredPdfs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPdfs.map((doc) => (
                  <Card
                    key={doc.id}
                    onClick={() => handleOpenPdf(doc.filename)}
                    className="p-4 flex flex-col justify-between hover:shadow-soft-md transition-all border border-slate-200 dark:border-slate-800 group cursor-pointer"
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

                      <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                        {doc.title}
                      </h3>
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
                        title="Open in Full Browser Tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center text-xs text-slate-400 border-slate-200 dark:border-slate-800">
                No past company aptitude papers match "{search}".
              </Card>
            )}
          </section>
        </main>
      </div>

      {/* Interactive PDF Reference Modal */}
      <PdfReferenceModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialPdfFilename={selectedPdfFilename}
      />
    </div>
  );
};
