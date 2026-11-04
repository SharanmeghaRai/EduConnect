import React, { useEffect, useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Bookmark,
  ExternalLink,
  FileText,
  Video,
  FileCode,
  Download,
  Filter,
  Check,
  Eye,
  Award,
  X,
  RotateCcw,
} from 'lucide-react';
import { api } from '../services/api.js';
import { StudyMaterial } from '../types/index.js';
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { Tabs } from '../components/ui/Tabs.js';
import {
  PdfReferenceModal,
  SAHYADRI_REFERENCE_PDFS,
} from '../components/ui/PdfReferenceModal.js';
import { StudyMaterialReaderModal } from '../components/ui/StudyMaterialReaderModal.js';
import { WhatsAppShareButton } from '../components/ui/WhatsAppButton.js';
import {
  formatStudyMaterialShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../utils/whatsapp.js';

export const StudyMaterialsPage: React.FC = () => {
  const [allMaterials, setAllMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');

  // PDF Reference Material Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfFilename, setSelectedPdfFilename] = useState('Accenture_Test_1.pdf');

  // Study Material In-App Reader Modal State
  const [isMaterialReaderOpen, setIsMaterialReaderOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<StudyMaterial | null>(null);

  const handleOpenMaterialReader = (mat: StudyMaterial) => {
    setSelectedMaterial(mat);
    setIsMaterialReaderOpen(true);
  };

  // Load all materials once on mount
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await api.materials.list();
        setAllMaterials(res.materials || []);
      } catch (err) {
        console.error('Failed to load study materials:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const toggleComplete = async (mat: StudyMaterial) => {
    const nextCompleted = !mat.isCompleted;
    setAllMaterials((prev) =>
      prev.map((m) => (m.id === mat.id ? { ...m, isCompleted: nextCompleted } : m))
    );

    try {
      await api.materials.toggleProgress(mat.id, nextCompleted);
    } catch {
      // rollback
      setAllMaterials((prev) =>
        prev.map((m) => (m.id === mat.id ? { ...m, isCompleted: mat.isCompleted } : m))
      );
    }
  };

  const toggleBookmark = async (mat: StudyMaterial) => {
    setAllMaterials((prev) =>
      prev.map((m) => (m.id === mat.id ? { ...m, isBookmarked: !m.isBookmarked } : m))
    );

    try {
      await api.materials.toggleBookmark(mat.id);
    } catch {
      setAllMaterials((prev) =>
        prev.map((m) => (m.id === mat.id ? { ...m, isBookmarked: mat.isBookmarked } : m))
      );
    }
  };

  const handleOpenPdf = (filename: string) => {
    setSelectedPdfFilename(filename);
    setIsPdfModalOpen(true);
  };

  // Precomputed Category Counts for Badges
  const counts = useMemo(() => {
    const sahyadriCount = SAHYADRI_REFERENCE_PDFS.length;
    const aptitudeGuideCount = allMaterials.filter((m) => m.category === 'APTITUDE').length;
    const techCount = allMaterials.filter((m) => m.category === 'TECHNICAL').length;
    const interviewCount = allMaterials.filter((m) => m.category === 'INTERVIEW_PREP').length;

    return {
      all: allMaterials.length + sahyadriCount,
      aptitude: aptitudeGuideCount + sahyadriCount,
      technical: techCount,
      interview: interviewCount,
    };
  }, [allMaterials]);

  const categories = useMemo(
    () => [
      { id: 'ALL', label: 'All Resources', badge: counts.all },
      { id: 'APTITUDE', label: 'Aptitude Formulas', badge: counts.aptitude },
      { id: 'TECHNICAL', label: 'Technical CS / Core', badge: counts.technical },
      { id: 'INTERVIEW_PREP', label: 'Interview Prep (HR / GD / Resume)', badge: counts.interview },
    ],
    [counts]
  );

  // Real-time Search & Filter for Sahyadri PDFs
  const filteredPdfs = useMemo(() => {
    const q = search.trim().toLowerCase();
    const isCategoryRelevant = activeCategory === 'ALL' || activeCategory === 'APTITUDE';

    return SAHYADRI_REFERENCE_PDFS.filter((doc) => {
      // If user is strictly viewing TECHNICAL or INTERVIEW_PREP, hide aptitude papers unless search explicitly targets them
      if (!isCategoryRelevant && !q) return false;

      if (!q) return isCategoryRelevant;

      const titleMatch = doc.title.toLowerCase().includes(q);
      const companyMatch = doc.company.toLowerCase().includes(q);
      const descMatch = doc.description.toLowerCase().includes(q);
      const fileMatch = doc.filename.toLowerCase().includes(q);
      const aptitudeMatch = 'aptitude'.includes(q) || 'sahyadri'.includes(q);

      return titleMatch || companyMatch || descMatch || fileMatch || aptitudeMatch;
    });
  }, [search, activeCategory]);

  // Real-time Search & Filter for General Study Materials
  const filteredMaterials = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allMaterials.filter((mat) => {
      // Category Tab Filter
      if (activeCategory !== 'ALL' && mat.category !== activeCategory) {
        return false;
      }

      // Search Query Filter
      if (!q) return true;

      const titleMatch = mat.title.toLowerCase().includes(q);
      const descMatch = (mat.description || '').toLowerCase().includes(q);
      const catMatch = (mat.category || '').toLowerCase().includes(q);
      const subCatMatch = (mat.subCategory || '').toLowerCase().includes(q);
      const tagsMatch =
        typeof mat.tags === 'string'
          ? mat.tags.toLowerCase().includes(q)
          : Array.isArray(mat.tags)
          ? mat.tags.some((t: string) => t.toLowerCase().includes(q))
          : false;

      return titleMatch || descMatch || catMatch || subCatMatch || tagsMatch;
    });
  }, [allMaterials, activeCategory, search]);

  const totalResults = filteredPdfs.length + filteredMaterials.length;

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setSearch('');
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'VIDEO':
        return <Video className="w-5 h-5 text-sky-500" />;
      case 'CHEATSHEET':
        return <FileCode className="w-5 h-5 text-amber-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-brand-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar />

        <main className="flex-1 min-w-0 space-y-8 animate-fade-in">
          {/* Header Banner */}
          <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950 text-xs font-semibold text-sky-700 dark:text-sky-300 mb-3">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Structured Placement Repository</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Study Materials & Interview Blueprints
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Handcrafted formula cheat-sheets, high-yield technical algorithms, and HR behavioural frameworks (STAR method, elevator pitch).
              </p>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <Tabs
                tabs={categories}
                activeTab={activeCategory}
                onChange={setActiveCategory}
                className="shrink-0"
              />

              {/* Responsive Real-Time Search Bar with Clear Button */}
              <div className="relative sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search materials (e.g. TCS, DP, SQL, STAR)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-all"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Active Search / Filter Feedback Bar */}
            {(search.trim() !== '' || activeCategory !== 'ALL') && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Filter className="w-3.5 h-3.5 text-brand-500" />
                  <span>
                    Showing <strong className="text-slate-900 dark:text-white font-bold">{totalResults}</strong> result{totalResults === 1 ? '' : 's'}
                    {activeCategory !== 'ALL' && (
                      <> in <span className="font-semibold text-brand-600 dark:text-brand-400">"{categories.find((c) => c.id === activeCategory)?.label}"</span></>
                    )}
                    {search.trim() && (
                      <> matching <span className="font-semibold text-brand-600 dark:text-brand-400">"{search.trim()}"</span></>
                    )}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && (
            <>
              {/* SECTION 1: SAHYADRI APTITUDE REFERENCE PAPERS REPOSITORY (MODAL VIEW) */}
              {filteredPdfs.length > 0 && (
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Sahyadri Aptitude Reference Materials (Company Past Papers)</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
                          {filteredPdfs.length}
                        </span>
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Direct company aptitude question banks from Sahyadri placement drives (Accenture, TCS, Infosys, Wipro, CTS).
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenPdf(filteredPdfs[0]?.filename || 'Accenture_Test_1.pdf')}
                      leftIcon={<Eye className="w-4 h-4 text-brand-600" />}
                    >
                      Open First PDF in Modal
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredPdfs.map((doc) => (
                      <Card
                        key={doc.id}
                        onClick={() => handleOpenPdf(doc.filename)}
                        className="p-4 flex flex-col justify-between hover:shadow-soft-md transition-all border border-slate-200 dark:border-slate-800 group cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/80 dark:text-brand-300">
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenPdf(doc.filename);
                            }}
                            className="text-xs flex-1 justify-center rounded-md"
                            leftIcon={<Eye className="w-3.5 h-3.5" />}
                          >
                            View Solutions & PDF
                          </Button>

                          <WhatsAppShareButton
                            shareOptions={{
                              phone: APTITUDE_SIR_PHONE,
                              text: formatStudyMaterialShareText({
                                title: doc.title,
                                category: `Sahyadri Company Aptitude (${doc.company})`,
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
                            onClick={(e) => e.stopPropagation()}
                            className="p-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Open in Full Tab"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* SECTION 2: GENERAL STUDY MATERIALS LIST */}
              {filteredMaterials.length > 0 && (
                <section className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Syllabus Guides & Concept Sheets</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {filteredMaterials.length}
                      </span>
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredMaterials.map((mat) => (
                      <Card
                        key={mat.id}
                        hoverEffect
                        onClick={() => handleOpenMaterialReader(mat)}
                        className={`p-5 flex flex-col justify-between border-slate-200/90 dark:border-slate-800 cursor-pointer ${
                          mat.isCompleted ? 'bg-emerald-50/20 dark:bg-emerald-950/10' : ''
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <div className="flex items-center gap-2">
                              {getIconForType(mat.resourceType || mat.contentType || 'PDF')}
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                {mat.resourceType || mat.contentType || 'PDF'}
                              </span>
                            </div>

                            {mat.isFeatured && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                                Must Read
                              </span>
                            )}
                          </div>

                          <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                            {mat.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                            {mat.description}
                          </p>

                          {mat.tags && (
                            <div className="flex flex-wrap gap-1.5 mt-4">
                              {(Array.isArray(mat.tags)
                                ? mat.tags
                                : typeof mat.tags === 'string'
                                ? (mat.tags as string).split(',')
                                : []
                              ).map((tag: string, idx: number) => (
                                <span
                                  key={idx}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                                >
                                  {tag.trim()}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleComplete(mat);
                            }}
                            className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-md transition-colors ${
                              mat.isCompleted
                                ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300'
                                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <CheckCircle2
                              className={`w-4 h-4 ${mat.isCompleted ? 'fill-emerald-500 text-white' : ''}`}
                            />
                            <span>{mat.isCompleted ? 'Completed' : 'Mark Done'}</span>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBookmark(mat);
                              }}
                              className={`p-1.5 rounded-md text-slate-400 hover:text-slate-600 ${
                                mat.isBookmarked ? 'text-brand-600 font-bold' : ''
                              }`}
                              title={mat.isBookmarked ? 'Remove Bookmark' : 'Bookmark Material'}
                            >
                              <Bookmark className={`w-4 h-4 ${mat.isBookmarked ? 'fill-brand-600' : ''}`} />
                            </button>

                            <WhatsAppShareButton
                              shareOptions={{
                                phone: APTITUDE_SIR_PHONE,
                                text: formatStudyMaterialShareText({
                                  title: mat.title,
                                  category: mat.category,
                                  resourceType: mat.resourceType || mat.contentType,
                                  url: `${window.location.origin}/materials`,
                                }),
                              }}
                              variant="icon-only"
                              size="sm"
                              title={`Ask doubts on this study resource to Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
                            />

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenMaterialReader(mat);
                              }}
                              className="text-xs font-semibold py-1.5 px-3 rounded-md shadow-soft-sm"
                            >
                              <span>Read Guide</span>
                              <BookOpen className="w-3.5 h-3.5 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </section>
              )}

              {/* OVERALL EMPTY STATE */}
              {totalResults === 0 && (
                <Card className="p-12 text-center border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                    <Search className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    No placement materials match your filter
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {search.trim()
                      ? `No resources found matching "${search.trim()}". Try checking for typos or searching a broader term like "TCS", "Accenture", "Formula", or "SQL".`
                      : `No resources available in "${categories.find((c) => c.id === activeCategory)?.label}".`}
                  </p>
                  <div className="mt-5">
                    <Button size="sm" variant="outline" onClick={handleResetFilters}>
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset All Filters
                    </Button>
                  </div>
                </Card>
              )}
            </>
          )}
        </main>
      </div>

      {/* PDF Reference Modal */}
      <PdfReferenceModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        initialPdfFilename={selectedPdfFilename}
      />

      {/* Study Material In-App Reader Modal */}
      <StudyMaterialReaderModal
        isOpen={isMaterialReaderOpen}
        onClose={() => setIsMaterialReaderOpen(false)}
        material={selectedMaterial}
        onToggleComplete={toggleComplete}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
};
