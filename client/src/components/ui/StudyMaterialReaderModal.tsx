import React, { useState } from 'react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Printer,
  Share2,
  Clock,
  Award,
  Layers,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
  FileText,
} from 'lucide-react';
import { StudyMaterial } from '../../types/index.js';
import { STUDY_MATERIAL_CONTENTS, StudyMaterialContent } from '../../data/studyMaterialContents.js';
import { Badge } from './Badge.js';
import { Button } from './Button.js';
import { WhatsAppShareButton } from './WhatsAppButton.js';
import {
  formatStudyMaterialShareText,
  APTITUDE_SIR_PHONE,
  APTITUDE_SIR_FORMATTED_PHONE,
} from '../../utils/whatsapp.js';

interface StudyMaterialReaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: StudyMaterial | null;
  onToggleComplete?: (mat: StudyMaterial) => void;
  onToggleBookmark?: (mat: StudyMaterial) => void;
}

export const StudyMaterialReaderModal: React.FC<StudyMaterialReaderModalProps> = ({
  isOpen,
  onClose,
  material,
  onToggleComplete,
  onToggleBookmark,
}) => {
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'PRACTICE' | 'CHEAT_SHEET'>('CONTENT');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  if (!isOpen || !material) return null;

  // Retrieve rich enriched content from lookup, or construct fallback from material fields
  const enriched: StudyMaterialContent = STUDY_MATERIAL_CONTENTS[material.title] || {
    id: material.id,
    title: material.title,
    category: (material.category as any) || 'TECHNICAL',
    subCategory: material.subCategory || 'PLACEMENT',
    contentType: (material.contentType as any) || 'DOCUMENT',
    estimatedMinutes: material.estimatedMinutes || 25,
    difficulty: (material.difficulty as any) || 'INTERMEDIATE',
    overview: material.description || 'Comprehensive campus placement reference guide.',
    keyTakeaways: [
      'Understand core foundational principles and derivations.',
      'Practice speed-based numerical and algorithmic problem solving.',
      'Focus on clean communication and recruiter evaluation benchmarks.',
    ],
    recruiterNotes: 'Campus recruiters evaluate structural clarity, edge case handling, and foundational knowledge.',
    sections: [
      {
        title: 'Curriculum & Topic Coverage',
        description: material.description,
        subsections: [
          {
            subtitle: 'Overview',
            contentHtml: `<p class="text-xs leading-relaxed">${material.description || 'Verified study resource for campus placement drives.'}</p>`,
          },
        ],
      },
    ],
  };

  const toggleSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-5xl h-[94vh] sm:h-[90vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="brand" className="text-[10px] uppercase font-bold tracking-wider">
                  {enriched.category}
                </Badge>
                <Badge variant="neutral" className="text-[10px] font-mono">
                  {enriched.contentType}
                </Badge>
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {enriched.estimatedMinutes} min read
                </span>
                <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hidden sm:inline">
                  {enriched.difficulty}
                </span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate mt-0.5 max-w-xl">
                {enriched.title}
              </h1>
            </div>
          </div>

          {/* Quick Header Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {onToggleComplete && (
              <Button
                variant={material.isCompleted ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onToggleComplete(material)}
                className="hidden sm:inline-flex text-xs py-1.5 px-3 rounded-md"
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                <span>{material.isCompleted ? 'Completed' : 'Mark Done'}</span>
              </Button>
            )}

            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(material)}
                className={`p-2 rounded-md border text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors ${
                  material.isBookmarked
                    ? 'border-brand-500 text-brand-600 bg-brand-50 dark:bg-brand-950/40'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title={material.isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
              >
                <Bookmark className={`w-4 h-4 ${material.isBookmarked ? 'fill-brand-600' : ''}`} />
              </button>
            )}

            <WhatsAppShareButton
              shareOptions={{
                phone: APTITUDE_SIR_PHONE,
                text: formatStudyMaterialShareText({
                  title: enriched.title,
                  category: enriched.category,
                  resourceType: enriched.contentType,
                  url: window.location.href,
                }),
              }}
              variant="solid"
              size="sm"
              label="Doubt"
              title={`Ask doubts directly to Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
            />

            <button
              onClick={handlePrint}
              className="hidden md:inline-flex p-2 rounded-md border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Print / Save Notes"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              title="Close Reader"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('CONTENT')}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'CONTENT'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Study Guide & Modules</span>
            </button>

            {enriched.practiceQuestions && enriched.practiceQuestions.length > 0 && (
              <button
                onClick={() => setActiveTab('PRACTICE')}
                className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                  activeTab === 'PRACTICE'
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Solved Interview Questions ({enriched.practiceQuestions.length})</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('CHEAT_SHEET')}
              className={`py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'CHEAT_SHEET'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Key Takeaways & Recruiter Radar</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
            <span>EduConnect Placement Repository</span>
          </div>
        </div>

        {/* Modal Scrollable Reader Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-7 space-y-6 bg-slate-50/50 dark:bg-slate-950/40">
          
          {/* TAB 1: FULL STUDY GUIDE */}
          {activeTab === 'CONTENT' && (
            <div className="max-w-4xl mx-auto space-y-6">
              
              {/* Executive Overview Card */}
              <div className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  <span>Executive Curriculum Overview</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {enriched.overview}
                </p>
                {enriched.recruiterNotes && (
                  <div className="p-3.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    <strong className="block font-bold mb-1 uppercase tracking-wider text-[11px]">
                      Campus Recruiter Insight:
                    </strong>
                    {enriched.recruiterNotes}
                  </div>
                )}
              </div>

              {/* Sections Breakdown */}
              {enriched.sections.map((section, sIdx) => (
                <div
                  key={sIdx}
                  className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm space-y-4"
                >
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {section.description}
                      </p>
                    )}
                  </div>

                  {section.subsections && section.subsections.length > 0 && (
                    <div className="space-y-4">
                      {section.subsections.map((sub, subIdx) => (
                        <div key={subIdx} className="space-y-2">
                          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                            <span>{sub.subtitle}</span>
                          </h3>
                          <div
                            className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2"
                            dangerouslySetInnerHTML={{ __html: sub.contentHtml }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Quick WhatsApp Doubt Prompt Card at Bottom of Article */}
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                    Need Step-by-Step Clarification on this Topic?
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                    Connect directly with Aptitude & Technical Mentor on WhatsApp for customized interview explanations.
                  </p>
                </div>
                <WhatsAppShareButton
                  shareOptions={{
                    phone: APTITUDE_SIR_PHONE,
                    text: formatStudyMaterialShareText({
                      title: enriched.title,
                      category: enriched.category,
                      resourceType: enriched.contentType,
                      url: window.location.href,
                    }),
                  }}
                  variant="solid"
                  size="sm"
                  label={`Chat on WhatsApp`}
                />
              </div>
            </div>
          )}

          {/* TAB 2: SOLVED INTERVIEW PROBLEMS */}
          {activeTab === 'PRACTICE' && (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  Campus Screening Questions & Worked Solutions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  These problems represent the exact patterns and time-bounded formats used in campus recruitment assessments.
                </p>
              </div>

              {enriched.practiceQuestions &&
                enriched.practiceQuestions.map((pq, qIdx) => {
                  const isRevealed = revealedSolutions[qIdx];
                  return (
                    <div
                      key={qIdx}
                      className="p-5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono">
                          Question #{qIdx + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSolution(qIdx)}
                          className="text-xs text-brand-600 dark:text-brand-400 font-semibold"
                        >
                          {isRevealed ? 'Hide Solution' : 'View Worked Solution'}
                        </Button>
                      </div>

                      <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                        {pq.question}
                      </p>

                      {pq.options && pq.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {pq.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-md text-xs border transition-all ${
                                isRevealed && opt === pq.correctAnswer
                                  ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200 font-semibold'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <span className="font-mono text-slate-400 mr-2">
                                {String.fromCharCode(65 + oIdx)}.
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {isRevealed && (
                        <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-fade-in">
                          <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct Answer: {pq.correctAnswer}</span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                            {pq.solution}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          )}

          {/* TAB 3: KEY TAKEAWAYS & CHEAT SHEET */}
          {activeTab === 'CHEAT_SHEET' && (
            <div className="max-w-4xl mx-auto space-y-5">
              {/* Key Takeaways Card */}
              <div className="p-5 sm:p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm space-y-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  <span>High-Yield Revision Takeaways</span>
                </div>
                <ul className="space-y-2.5">
                  {enriched.keyTakeaways.map((point, pIdx) => (
                    <li
                      key={pIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
                    >
                      <span className="text-brand-600 dark:text-brand-400 font-bold select-none">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recruiter Evaluation Perspectives */}
              <div className="p-5 sm:p-6 rounded-lg bg-slate-900 text-white border border-slate-800 space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  <span>Campus Interview Radar & Evaluation Criteria</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {enriched.recruiterNotes}
                </p>
                <div className="pt-2 text-[11px] text-slate-400">
                  Recommended review time: {enriched.estimatedMinutes} minutes prior to technical assessment rounds.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-400">
            <span>{enriched.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
              Close Reader
            </Button>
            {onToggleComplete && (
              <Button
                variant={material.isCompleted ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => onToggleComplete(material)}
                className="text-xs"
                leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
              >
                <span>{material.isCompleted ? 'Marked Completed' : 'Mark as Completed'}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
