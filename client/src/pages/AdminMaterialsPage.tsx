import React, { useEffect, useState } from 'react';
import { api } from '../services/api.js';
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import {
  BookOpen,
  Plus,
  Trash2,
  ExternalLink,
  FileText,
  Video,
  FileCode,
  Tag,
  CheckCircle2,
  FileCheck,
  Download,
  Sparkles,
} from 'lucide-react';

export const AdminMaterialsPage: React.FC = () => {
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const campusPdfPresets = [
    { label: 'TCS Ninja & Digital Test Series 1 (PDF)', url: '/reference-materials/TCS_Test_1.pdf', category: 'APTITUDE', sub: 'QUANT' },
    { label: 'TCS Advanced Quantitative Test 2 (PDF)', url: '/reference-materials/TCS_Test_2.pdf', category: 'APTITUDE', sub: 'QUANT' },
    { label: 'Accenture Cognitive & Technical Test 1 (PDF)', url: '/reference-materials/Accenture_Test_1.pdf', category: 'TECHNICAL', sub: 'CS_CORE' },
    { label: 'Accenture Critical Reasoning Test 3 (PDF)', url: '/reference-materials/Accenture_Test_3.pdf', category: 'APTITUDE', sub: 'LOGICAL' },
    { label: 'Infosys Specialist & SE Test 3 (PDF)', url: '/reference-materials/Infosys_Test_3.pdf', category: 'APTITUDE', sub: 'LOGICAL' },
    { label: 'Cognizant CTS GenC Next Drive (PDF)', url: '/reference-materials/CTS_Test_3.pdf', category: 'TECHNICAL', sub: 'CS_CORE' },
    { label: 'Wipro Elite NTH Test 1 (PDF)', url: '/reference-materials/Wipro_Test_1.pdf', category: 'APTITUDE', sub: 'VERBAL' },
    { label: 'Wipro Automata Fundamentals Test 2 (PDF)', url: '/reference-materials/Wipro_Test_2.pdf', category: 'TECHNICAL', sub: 'CS_CORE' },
  ];

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    category: 'APTITUDE', // APTITUDE | TECHNICAL | INTERVIEW_PREP
    subCategory: 'QUANT',
    contentType: 'PDF', // PDF | DOCUMENT | VIDEO | ARTICLE | CHEATSHEET
    resourceUrl: '/reference-materials/TCS_Test_1.pdf',
    description: '',
    tags: 'formulas, placement prep, verified',
    difficulty: 'INTERMEDIATE',
    estimatedMinutes: 20,
  });

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await api.materials.list();
      setMaterials(res.materials || []);
    } catch (err) {
      console.error('Failed to load materials:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.admin.createMaterial({
        title: newMaterial.title,
        category: newMaterial.category,
        subCategory: newMaterial.subCategory,
        contentType: newMaterial.contentType,
        resourceUrl: newMaterial.resourceUrl,
        description: newMaterial.description,
        tags: newMaterial.tags,
        difficulty: newMaterial.difficulty,
        estimatedMinutes: Number(newMaterial.estimatedMinutes) || 15,
      });

      setIsCreateOpen(false);
      setSuccessToast(`"${newMaterial.title}" attached successfully!`);
      setTimeout(() => setSuccessToast(''), 4000);

      setNewMaterial({
        title: '',
        category: 'APTITUDE',
        subCategory: 'QUANT',
        contentType: 'PDF',
        resourceUrl: '/reference-materials/TCS_Test_1.pdf',
        description: '',
        tags: 'formulas, placement prep, verified',
        difficulty: 'INTERMEDIATE',
        estimatedMinutes: 20,
      });
      fetchMaterials();
    } catch (err: any) {
      alert(err.message || 'Failed to create resource.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this study resource?')) return;
    try {
      await api.admin.deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
      setSuccessToast('Material deleted successfully.');
      setTimeout(() => setSuccessToast(''), 3000);
    } catch (err) {
      console.error('Failed to delete material:', err);
    }
  };

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
                  Study Materials & Knowledge Repository
                </h1>
                <Badge variant="primary">{materials.length} Resources</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Upload and attach official company question blueprints, formula PDFs, and lecture documents for students.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Attach New Resource / PDF
            </Button>
          </div>

          {successToast && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[#159B75] dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Quick PDF Presets Bar */}
          <Card className="p-4 bg-gradient-to-r from-brand-50/50 via-white to-indigo-50/50 dark:from-slate-900 dark:to-brand-950/30 border border-brand-100 dark:border-brand-900/40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[#111B3C] dark:text-slate-200 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-brand-600" />
                Verified Sahyadri Campus Question Papers (Quick-Attach Available)
              </span>
              <span className="text-[11px] text-slate-400">8 Official Drive PDFs</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {campusPdfPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => {
                    setNewMaterial({
                      ...newMaterial,
                      title: preset.label.replace(' (PDF)', ''),
                      resourceUrl: preset.url,
                      category: preset.category,
                      subCategory: preset.sub,
                      contentType: 'PDF',
                      description: `Official Sahyadri recruitment question paper for campus placement preparation.`,
                    });
                    setIsCreateOpen(true);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:text-brand-600 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1 shadow-soft-sm"
                >
                  <Download className="w-3 h-3 text-brand-500" />
                  <span>{preset.label.split(' (')[0]}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Materials Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Resource Title</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Resource Link</th>
                    <th className="px-4 py-3">Difficulty</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                      </td>
                    </tr>
                  ) : materials.length > 0 ? (
                    materials.map((mat) => {
                      const linkUrl = mat.resourceUrl || mat.externalUrl;
                      const format = mat.contentType || mat.resourceType || 'DOCUMENT';
                      return (
                        <tr key={mat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-900 dark:text-white">{mat.title}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs">{mat.description || 'No description'}</p>
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant="neutral" size="sm">
                              {mat.category}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-mono text-[11px] font-bold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                              {format}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {linkUrl ? (
                              <a
                                href={linkUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 font-medium truncate max-w-[200px]"
                              >
                                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{linkUrl}</span>
                              </a>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">
                              {mat.difficulty || 'INTERMEDIATE'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {linkUrl && (
                                <a
                                  href={linkUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                  title="View / Download Material"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                onClick={() => handleDelete(mat.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Delete Resource"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400">
                        No materials found. Click "Attach New Resource / PDF" above to add one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Create Modal */}
          {isCreateOpen && (
            <Modal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              title="Attach Placement Resource or PDF Document"
            >
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Resource Title"
                  placeholder="e.g. TCS Digital Advanced Coding & Quantitative Paper 2026"
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      value={newMaterial.category}
                      onChange={(e) => setNewMaterial({ ...newMaterial, category: e.target.value })}
                    >
                      <option value="APTITUDE">Aptitude Preparation</option>
                      <option value="TECHNICAL">Technical Skills (CS/Core)</option>
                      <option value="INTERVIEW_PREP">Interview Preparation & HR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Format / Type
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      value={newMaterial.contentType}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, contentType: e.target.value })
                      }
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="DOCUMENT">Handout / Word Document</option>
                      <option value="CHEATSHEET">Formula Cheat-sheet</option>
                      <option value="ARTICLE">Technical Article / Guide</option>
                      <option value="VIDEO">Video Playlist / Lecture</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Document Link or Campus PDF URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/reference-materials/TCS_Test_1.pdf or https://drive.google.com/..."
                    value={newMaterial.resourceUrl}
                    onChange={(e) => setNewMaterial({ ...newMaterial, resourceUrl: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Tip: Enter an external PDF/Drive link, or choose from campus reference PDFs above.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      value={newMaterial.difficulty}
                      onChange={(e) => setNewMaterial({ ...newMaterial, difficulty: e.target.value })}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Estimated Read/Prep (Minutes)
                    </label>
                    <input
                      type="number"
                      value={newMaterial.estimatedMinutes}
                      onChange={(e) => setNewMaterial({ ...newMaterial, estimatedMinutes: Number(e.target.value) })}
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>
                </div>

                <Input
                  label="Description / Syllabus Coverage"
                  placeholder="Concise overview of what concepts and problem types this resource covers..."
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                />

                <Input
                  label="Tags (Comma separated)"
                  placeholder="formulas, tcs-digital, quantitative, leetcode"
                  value={newMaterial.tags}
                  onChange={(e) => setNewMaterial({ ...newMaterial, tags: e.target.value })}
                />

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                    Attach & Publish Resource
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
