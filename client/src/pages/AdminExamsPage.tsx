import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  Sparkles,
  Plus,
  Upload,
  Clock,
  HelpCircle,
  Award,
  Trash2,
  Edit,
  CheckCircle2,
  FileSpreadsheet,
  AlertCircle,
  FileText,
} from 'lucide-react';

export const AdminExamsPage: React.FC = () => {
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [targetExamForBulk, setTargetExamForBulk] = useState<any>(null);

  // Quick add single question state
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false);
  const [targetExamForQuestion, setTargetExamForQuestion] = useState<any>(null);
  const [newQuestion, setNewQuestion] = useState({
    prompt: '',
    explanation: '',
    topicTag: '',
    marks: 1,
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
  });

  // Form states
  const [newExam, setNewExam] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'QUANT',
    difficulty: 'MEDIUM',
    durationMinutes: 30,
    totalMarks: 30,
    passingMarks: 12,
    negativeMarkingRatio: 0.25,
    shuffleQuestions: true,
  });

  const [csvContent, setCsvContent] = useState('');
  const [csvStatus, setCsvStatus] = useState<{ success?: string; error?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await api.exams.list();
      setExams(res.exams || []);
    } catch (err) {
      console.error('Failed to load exams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.admin.createExam({
        ...newExam,
        slug: newExam.slug || newExam.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      });
      setIsCreateOpen(false);
      fetchExams();
    } catch (err: any) {
      alert(err.message || 'Failed to create exam');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetExamForQuestion) return;
    setSubmitting(true);
    try {
      const options = [
        { label: 'A', text: newQuestion.optionA, isCorrect: newQuestion.correctOption === 'A' },
        { label: 'B', text: newQuestion.optionB, isCorrect: newQuestion.correctOption === 'B' },
        { label: 'C', text: newQuestion.optionC, isCorrect: newQuestion.correctOption === 'C' },
        { label: 'D', text: newQuestion.optionD, isCorrect: newQuestion.correctOption === 'D' },
      ];

      await api.admin.addQuestion(targetExamForQuestion.id, {
        prompt: newQuestion.prompt,
        explanation: newQuestion.explanation,
        topicTag: newQuestion.topicTag,
        marks: newQuestion.marks,
        options,
      });

      setIsAddQuestionOpen(false);
      setNewQuestion({
        prompt: '',
        explanation: '',
        topicTag: '',
        marks: 1,
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
      });
      fetchExams();
    } catch (err: any) {
      alert(err.message || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetExamForBulk || !csvContent.trim()) return;

    try {
      setSubmitting(true);
      setCsvStatus({});
      const res: any = await api.admin.bulkUploadMCQs(targetExamForBulk.id, csvContent);
      setCsvStatus({
        success: `Successfully imported ${res.importedCount ?? 'MCQs'} into ${targetExamForBulk.title}!`,
      });
      setTimeout(() => {
        setIsBulkOpen(false);
        setCsvContent('');
        setCsvStatus({});
        fetchExams();
      }, 2000);
    } catch (err: any) {
      setCsvStatus({ error: err.message || 'Failed to import MCQs from CSV.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const sampleCsvTemplate = `Prompt,OptionA,OptionB,OptionC,OptionD,CorrectOption,TopicTag,Explanation
"If a train travels at 60 km/h, how far does it travel in 45 minutes?","40 km","45 km","50 km","55 km","B","Time-Speed-Distance","Distance = Speed * Time = 60 * (45/60) = 45 km."
"What is the next number in the sequence: 2, 6, 12, 20, ?","28","30","32","36","B","Number Series","Differences are 4, 6, 8, 10. 20 + 10 = 30."`;

  const filteredExams = selectedCategory === 'ALL'
    ? exams
    : exams.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar role="ADMIN" />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Exam & Question Bank Studio
                </h1>
                <Badge variant="primary">{exams.length} Seeded Exams</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Author new aptitude modules, configure negative marking & time limits, or bulk-import MCQs via CSV.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTargetExamForBulk(exams[0]);
                  setIsBulkOpen(true);
                }}
                leftIcon={<Upload className="w-4 h-4" />}
              >
                Bulk CSV Upload
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsCreateOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Exam
              </Button>
            </div>
          </div>

          {/* Categories filter */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['ALL', 'QUANT', 'LOGICAL', 'VERBAL', 'DATA_INT', 'TECH_CS', 'TECH_CORE'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {cat === 'ALL' ? 'All Categories' : cat.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Exam Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {loading ? (
              <div className="col-span-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              </div>
            ) : filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <Card key={exam.id} className="p-5 flex flex-col justify-between hover:shadow-soft-md transition-shadow">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge variant="primary" size="sm">
                        {exam.category}
                      </Badge>
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {exam.difficulty}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {exam.description || 'Full length comprehensive placement aptitude module.'}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-slate-400 text-[10px]">Questions</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {exam._count?.questions ?? exam.questions?.length ?? 15}
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Duration</p>
                        <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                          {exam.durationMinutes}m
                        </p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Penalty</p>
                        <p className="font-bold text-rose-600 dark:text-rose-400 mt-0.5">
                          -{exam.negativeMarkingRatio || 0.25}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTargetExamForQuestion(exam);
                        setIsAddQuestionOpen(true);
                      }}
                      className="text-xs flex-1"
                      leftIcon={<Plus className="w-3.5 h-3.5" />}
                    >
                      + MCQ
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTargetExamForBulk(exam);
                        setIsBulkOpen(true);
                      }}
                      className="text-xs flex-1"
                      leftIcon={<Upload className="w-3.5 h-3.5" />}
                    >
                      CSV
                    </Button>
                    <span className="text-[11px] text-slate-400">
                      {exam.isPublished ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12 text-slate-400">
                No exams found in this category.
              </div>
            )}
          </div>

          {/* Bulk CSV Upload Modal */}
          {isBulkOpen && (
            <Modal
              isOpen={isBulkOpen}
              onClose={() => {
                setIsBulkOpen(false);
                setCsvStatus({});
              }}
              title="Bulk Upload MCQs via CSV"
            >
              <form onSubmit={handleBulkUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Target Exam
                  </label>
                  <select
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
                    value={targetExamForBulk?.id}
                    onChange={(e) => {
                      const ex = exams.find((x) => x.id === e.target.value);
                      setTargetExamForBulk(ex);
                    }}
                  >
                    {exams.map((ex) => (
                      <option key={ex.id} value={ex.id}>
                        {ex.title} ({ex.category})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Paste CSV Content or Upload .csv
                    </label>
                    <button
                      type="button"
                      onClick={() => setCsvContent(sampleCsvTemplate)}
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Fill Sample Format
                    </button>
                  </div>
                  <textarea
                    rows={8}
                    className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="Prompt,OptionA,OptionB,OptionC,OptionD,CorrectOption,TopicTag,Explanation"
                    value={csvContent}
                    onChange={(e) => setCsvContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Upload CSV file</span>
                    <input
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  <span>Format: 8 columns, comma separated</span>
                </div>

                {csvStatus.success && (
                  <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {csvStatus.success}
                  </div>
                )}

                {csvStatus.error && (
                  <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    {csvStatus.error}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsBulkOpen(false);
                      setCsvStatus({});
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={submitting}
                    disabled={!csvContent.trim()}
                    leftIcon={<Upload className="w-4 h-4" />}
                  >
                    Process & Import
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Quick Add Single Question Modal */}
          {isAddQuestionOpen && (
            <Modal
              isOpen={isAddQuestionOpen}
              onClose={() => setIsAddQuestionOpen(false)}
              title={`Add Single MCQ to ${targetExamForQuestion?.title}`}
            >
              <form onSubmit={handleAddQuestionSubmit} className="space-y-4">
                <Input
                  label="Question Prompt"
                  placeholder="e.g. A shopkeeper sells an article at 20% profit..."
                  value={newQuestion.prompt}
                  onChange={(e) => setNewQuestion({ ...newQuestion, prompt: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Topic Tag"
                    placeholder="e.g. Profit and Loss"
                    value={newQuestion.topicTag}
                    onChange={(e) => setNewQuestion({ ...newQuestion, topicTag: e.target.value })}
                  />
                  <Input
                    label="Marks"
                    type="number"
                    min="1"
                    value={String(newQuestion.marks)}
                    onChange={(e) => setNewQuestion({ ...newQuestion, marks: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Option Choices
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-6 text-slate-500">A</span>
                      <input
                        type="text"
                        value={newQuestion.optionA}
                        onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                        placeholder="Option A text..."
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-6 text-slate-500">B</span>
                      <input
                        type="text"
                        value={newQuestion.optionB}
                        onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                        placeholder="Option B text..."
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-6 text-slate-500">C</span>
                      <input
                        type="text"
                        value={newQuestion.optionC}
                        onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                        placeholder="Option C text..."
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold w-6 text-slate-500">D</span>
                      <input
                        type="text"
                        value={newQuestion.optionD}
                        onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                        placeholder="Option D text..."
                        className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Correct Option
                    </label>
                    <select
                      value={newQuestion.correctOption}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: e.target.value })}
                      className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
                    >
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>

                  <Input
                    label="Explanation"
                    placeholder="Step-by-step mathematical reasoning..."
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsAddQuestionOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                    Add MCQ
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Create Exam Modal */}
          {isCreateOpen && (
            <Modal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              title="Create New Aptitude Exam"
            >
              <form onSubmit={handleCreateExam} className="space-y-4">
                <Input
                  label="Exam Title"
                  placeholder="e.g. Master Quantitative Aptitude: Advanced Ratios"
                  value={newExam.title}
                  onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
                    value={newExam.category}
                    onChange={(e) => setNewExam({ ...newExam, category: e.target.value })}
                  >
                    <option value="QUANT">Quantitative Aptitude</option>
                    <option value="LOGICAL">Logical Reasoning</option>
                    <option value="VERBAL">Verbal Ability</option>
                    <option value="DATA_INT">Data Interpretation</option>
                    <option value="TECH_CS">Computer Science Tech</option>
                    <option value="TECH_CORE">Core Engineering Tech</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Difficulty
                    </label>
                    <select
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
                      value={newExam.difficulty}
                      onChange={(e) => setNewExam({ ...newExam, difficulty: e.target.value })}
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HARD">Hard</option>
                    </select>
                  </div>

                  <Input
                    label="Duration (Minutes)"
                    type="number"
                    min="5"
                    max="180"
                    value={String(newExam.durationMinutes)}
                    onChange={(e) => setNewExam({ ...newExam, durationMinutes: Number(e.target.value) })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Passing Marks"
                    type="number"
                    min="1"
                    value={String(newExam.passingMarks)}
                    onChange={(e) => setNewExam({ ...newExam, passingMarks: Number(e.target.value) })}
                  />

                  <Input
                    label="Negative Mark Ratio"
                    type="number"
                    step="0.05"
                    min="0"
                    max="1"
                    value={String(newExam.negativeMarkingRatio)}
                    onChange={(e) =>
                      setNewExam({ ...newExam, negativeMarkingRatio: parseFloat(e.target.value) })
                    }
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    isLoading={submitting}
                  >
                    Save & Create
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};
