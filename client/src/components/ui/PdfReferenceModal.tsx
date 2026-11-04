import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Download,
  X,
  BookOpen,
  Building,
  CheckCircle2,
  ChevronRight,
  Layers,
  HelpCircle,
  Eye,
} from 'lucide-react';
import { Button } from './Button.js';
import { Badge } from './Badge.js';
import { WhatsAppIcon } from './WhatsAppButton.js';
import { APTITUDE_SIR_PHONE, APTITUDE_SIR_FORMATTED_PHONE } from '../../utils/whatsapp.js';
import { SAHYADRI_PDF_DETAILS, CompanyPdfDetail } from '../../data/sahyadriPdfQuestions.js';

export interface ReferencePdf {
  id: string;
  title: string;
  filename: string;
  company: 'Accenture' | 'TCS' | 'Infosys' | 'Wipro' | 'Cognizant';
  size: string;
  questionsCount: number;
  description: string;
}

export const SAHYADRI_REFERENCE_PDFS: ReferencePdf[] = [
  {
    id: 'Accenture_Test_1',
    title: 'Accenture Placement Aptitude Paper 1',
    filename: 'Accenture_Test_1.pdf',
    company: 'Accenture',
    size: '14.5 KB',
    questionsCount: 25,
    description: 'Number series, alternating quadratic patterns, percentage mixtures, and time-speed-distance questions with full derivations.',
  },
  {
    id: 'Accenture_Test_3',
    title: 'Accenture Placement Aptitude Paper 3',
    filename: 'Accenture_Test_3.pdf',
    company: 'Accenture',
    size: '15.3 KB',
    questionsCount: 25,
    description: 'Critical logical deduction, cryptarithmetic problem solving, seating puzzles, and probability.',
  },
  {
    id: 'TCS_Test_1',
    title: 'TCS NQT Placement Aptitude Paper 1',
    filename: 'TCS_Test_1.pdf',
    company: 'TCS',
    size: '15.7 KB',
    questionsCount: 25,
    description: 'TCS National Qualifier Test quantitative section: work equations, quadratic sequences, and algebraic identities.',
  },
  {
    id: 'TCS_Test_2',
    title: 'TCS NQT Placement Aptitude Paper 2',
    filename: 'TCS_Test_2.pdf',
    company: 'TCS',
    size: '17.1 KB',
    questionsCount: 25,
    description: 'Advanced data interpretation, ratios, pipes & cisterns, and series completion.',
  },
  {
    id: 'Infosys_Test_3',
    title: 'Infosys Reasoning & Aptitude Paper 3',
    filename: 'Infosys_Test_3.pdf',
    company: 'Infosys',
    size: '16.7 KB',
    questionsCount: 25,
    description: 'Infosys special pattern: Cryptarithmetic addition, syllogistic deductions, and circular seating arrangements.',
  },
  {
    id: 'Wipro_Test_1',
    title: 'Wipro Elite NTH Aptitude Paper 1',
    filename: 'Wipro_Test_1.pdf',
    company: 'Wipro',
    size: '14.5 KB',
    questionsCount: 25,
    description: 'Wipro National Talent Hunt: clock angles, calendar odd days, profit & loss, and logarithms.',
  },
  {
    id: 'Wipro_Test_2',
    title: 'Wipro Elite NTH Aptitude Paper 2',
    filename: 'Wipro_Test_2.pdf',
    company: 'Wipro',
    size: '17.3 KB',
    questionsCount: 25,
    description: 'Mensuration area relations, divisibility benchmarks, unit digit cycles, and race speed distances.',
  },
  {
    id: 'CTS_Test_3',
    title: 'Cognizant (CTS) Placement Aptitude Paper 3',
    filename: 'CTS_Test_3.pdf',
    company: 'Cognizant',
    size: '17.5 KB',
    questionsCount: 25,
    description: 'Cognizant GenC analytical questions: age ratios, successive wage changes, simple interest doubling, and odd word classifications.',
  },
];

interface PdfReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPdfFilename?: string;
}

export const PdfReferenceModal: React.FC<PdfReferenceModalProps> = ({
  isOpen,
  onClose,
  initialPdfFilename = 'Accenture_Test_1.pdf',
}) => {
  const [selectedFilename, setSelectedFilename] = useState<string>(initialPdfFilename);
  const [activeTab, setActiveTab] = useState<'INTERACTIVE' | 'PDF_VIEW' | 'FORMULAS'>('INTERACTIVE');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const currentPdf =
    SAHYADRI_REFERENCE_PDFS.find((p) => p.filename === selectedFilename) ||
    SAHYADRI_REFERENCE_PDFS[0];

  const detail: CompanyPdfDetail | undefined = SAHYADRI_PDF_DETAILS[currentPdf.filename];
  const pdfUrl = `/reference-materials/${currentPdf.filename}`;

  const toggleSolution = (idx: number) => {
    setRevealedSolutions((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-6xl h-[95vh] sm:h-[92vh] bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
        
        {/* Modal Top Header */}
        <div className="px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-md bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-brand-600" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[140px] sm:max-w-md">
                  {currentPdf.title}
                </h2>
                <Badge variant="primary" size="sm" className="hidden xs:inline-flex text-[10px]">
                  {currentPdf.company}
                </Badge>
                <span className="hidden sm:inline-block text-[11px] font-mono text-slate-400">
                  {currentPdf.size}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                Sahyadri Aptitude Reference Archive • Verified Company Question Bank
              </p>
            </div>
          </div>

          {/* Quick Select & Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <select
              value={selectedFilename}
              onChange={(e) => setSelectedFilename(e.target.value)}
              className="text-xs py-1.5 px-2 sm:px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-semibold focus:outline-none focus:ring-1 focus:ring-brand-500 max-w-[120px] sm:max-w-none"
            >
              {SAHYADRI_REFERENCE_PDFS.map((doc) => (
                <option key={doc.filename} value={doc.filename}>
                  {doc.company}: {doc.filename.replace('.pdf', '')}
                </option>
              ))}
            </select>

            {/* Direct WhatsApp Aptitude Sir Doubt Support Button */}
            <a
              href={`https://wa.me/${APTITUDE_SIR_PHONE}?text=${encodeURIComponent(
                `Hello Aptitude Sir! 👋\nI am studying the past aptitude paper *${currentPdf.title}* (${currentPdf.company}) on EduConnect and have a question/doubt.\n\nCould you please help me understand this? Thank you!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
              title={`Ask doubts directly to Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Ask Mentor</span>
              <span className="xs:hidden">Doubt</span>
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Open in Full Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Tab</span>
            </a>

            <a
              href={pdfUrl}
              download={currentPdf.filename}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold transition-colors"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close Reference Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="px-4 sm:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between shrink-0">
          <div className="flex gap-4 sm:gap-6 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('INTERACTIVE')}
              className={`py-2.5 sm:py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'INTERACTIVE'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Interactive Solved Paper</span>
            </button>

            <button
              onClick={() => setActiveTab('PDF_VIEW')}
              className={`py-2.5 sm:py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'PDF_VIEW'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Embedded PDF Document</span>
            </button>

            <button
              onClick={() => setActiveTab('FORMULAS')}
              className={`py-2.5 sm:py-3 border-b-2 transition-all flex items-center gap-1.5 ${
                activeTab === 'FORMULAS'
                  ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Pattern & Shortcuts</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span>Official Sahyadri Placement Archive</span>
          </div>
        </div>

        {/* Modal Body: Left Navigator + Right Active View */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Left Reference Shelf Navigator (Desktop only) */}
          <div className="hidden md:block w-72 shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 p-3 overflow-y-auto space-y-1.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 flex items-center justify-between">
              <span>Company Papers ({SAHYADRI_REFERENCE_PDFS.length})</span>
              <BookOpen className="w-3.5 h-3.5" />
            </p>

            {SAHYADRI_REFERENCE_PDFS.map((doc) => {
              const isSelected = doc.filename === selectedFilename;
              return (
                <button
                  key={doc.id}
                  onClick={() => setSelectedFilename(doc.filename)}
                  className={`w-full text-left p-2.5 rounded-md text-xs transition-all flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-brand-50 text-brand-900 border border-brand-300 dark:bg-brand-950/60 dark:text-brand-200 dark:border-brand-700 font-bold shadow-sm'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 border border-transparent'
                  }`}
                >
                  <FileText className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-brand-600' : 'text-slate-400'}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                      {doc.size} • {doc.questionsCount} Questions
                    </p>
                  </div>
                  {isSelected && <ChevronRight className="w-3.5 h-3.5 text-brand-600 shrink-0 self-center" />}
                </button>
              );
            })}

            <div className="mt-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong className="block font-bold mb-0.5">Placement Cell Guideline:</strong>
              These PDFs contain actual past questions used in Sahyadri campus drives. Use them to verify step-by-step methods during your preparation!
            </div>
          </div>

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden">
            
            {/* VIEW 1: INTERACTIVE SOLVED PAPER */}
            {activeTab === 'INTERACTIVE' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="p-4 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {currentPdf.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {currentPdf.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" /> Full Tab
                    </a>
                    <a
                      href={pdfUrl}
                      download={currentPdf.filename}
                      className="px-2.5 py-1 rounded-md bg-brand-600 text-white font-semibold hover:bg-brand-700 flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Download PDF
                    </a>
                  </div>
                </div>

                {detail?.questions && detail.questions.length > 0 ? (
                  detail.questions.map((q, idx) => {
                    const isRevealed = revealedSolutions[idx];
                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-mono">
                            Question #{q.number} • {q.topic}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSolution(idx)}
                            className="text-xs text-brand-600 dark:text-brand-400 font-semibold"
                          >
                            {isRevealed ? 'Hide Solution' : 'View Worked Solution'}
                          </Button>
                        </div>

                        <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                          {q.prompt}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2.5 rounded-md text-xs border transition-all ${
                                isRevealed && opt === q.correctAnswer
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

                        {isRevealed && (
                          <div className="p-3.5 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 animate-fade-in">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Correct Answer: {q.correctAnswer}</span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-md border border-slate-200 dark:border-slate-800 space-y-3">
                    <p className="text-xs text-slate-500">
                      Viewing questions for {currentPdf.title}. Click "Embedded PDF Document" to inspect the full original document layout.
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveTab('PDF_VIEW')}
                      className="text-xs"
                    >
                      Switch to Embedded PDF View
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 2: EMBEDDED PDF DOCUMENT */}
            {activeTab === 'PDF_VIEW' && (
              <div className="flex-1 flex flex-col p-2 sm:p-4 overflow-hidden space-y-2">
                <div className="p-2 px-3 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 truncate">
                    Showing official document: <strong>{currentPdf.filename}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open in New Tab
                    </a>
                  </div>
                </div>

                <div className="flex-1 rounded-md overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner">
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0`}
                    className="w-full h-full"
                    title={currentPdf.title}
                  />
                </div>
              </div>
            )}

            {/* VIEW 3: PATTERN & FORMULAS */}
            {activeTab === 'FORMULAS' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {detail?.pattern && (
                  <div className="p-5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      {detail.company} Campus Test Evaluation Structure
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Test Duration</span>
                        <strong className="text-slate-800 dark:text-slate-200">{detail.pattern.duration}</strong>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Questions</span>
                        <strong className="text-slate-800 dark:text-slate-200">{detail.pattern.totalQuestions} Questions</strong>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Negative Marking</span>
                        <strong className="text-slate-800 dark:text-slate-200">{detail.pattern.negativeMarking}</strong>
                      </div>
                      <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
                        <span className="text-slate-400 block text-[10px]">Target Cutoff</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{detail.pattern.targetCutoff}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {detail?.keyFormulas && detail.keyFormulas.length > 0 && (
                  <div className="p-5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      Core Speed-Math Formulas & Short-Cut Methods
                    </h3>
                    <ul className="space-y-2">
                      {detail.keyFormulas.map((f, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                          <span className="text-brand-600 dark:text-brand-400 font-bold select-none">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
