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
  FileText,
  Plus,
  Send,
  Eye,
  CheckCircle2,
  Calendar,
  Mail,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminNewslettersPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<any>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [newIssue, setNewIssue] = useState({
    title: '',
    slug: '',
    summary: '',
    contentHtml: '',
  });

  useEffect(() => {
    fetchNewsletters();
  }, []);

  const fetchNewsletters = async () => {
    try {
      setLoading(true);
      const res = await api.newsletters.list();
      setNewsletters(res.newsletters || []);
    } catch (err) {
      console.error('Failed to load newsletters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const slug =
        newIssue.slug || newIssue.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await api.admin.createNewsletter({
        ...newIssue,
        slug,
      });
      setIsComposeOpen(false);
      setNewIssue({ title: '', slug: '', summary: '', contentHtml: '' });
      fetchNewsletters();
    } catch (err: any) {
      alert(err.message || 'Failed to create newsletter');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePublishNow = async (id: string) => {
    if (!confirm('Publish this edition and send automated emails to all subscribed students?')) return;
    try {
      setPublishingId(id);
      await api.admin.publishNewsletter(id);
      alert('Newsletter published and dispatched to subscribed students!');
      fetchNewsletters();
    } catch (err: any) {
      alert(err.message || 'Publishing failed');
    } finally {
      setPublishingId(null);
    }
  };

  const sampleTemplate = `<h2>Placement Strategy Spotlight</h2>
<p>In this week's edition, we analyze how Tier-1 product companies evaluate System Design fundamentals and behavioral competencies during final rounds.</p>

<h3>Key Hiring Trends</h3>
<ul>
  <li><strong>Cloud & DevOps:</strong> 40% rise in demand for candidates knowledgeable in Docker & Kubernetes.</li>
  <li><strong>Aptitude Weightage:</strong> First-round cutoffs increased to 75% across major MNC drives.</li>
</ul>

<h3>Recommended Action</h3>
<p>Attempt this week's featured <strong>Logical Reasoning: Seating Arrangements</strong> exam and review the System Design cheat-sheets in the Study Hub.</p>`;

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
                  Placement Newsletter Editorial Studio
                </h1>
                <Badge variant="primary">node-cron + Nodemailer</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Compose weekly hiring market insights, schedule dispatches, and trigger instant student email broadcasts.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsComposeOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Compose New Edition
            </Button>
          </div>

          {/* Newsletters List */}
          <div className="space-y-4">
            {loading ? (
              <div className="h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
              </div>
            ) : newsletters.length > 0 ? (
              newsletters.map((issue) => (
                <Card key={issue.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral" size="sm">
                        Issue #{issue.editionNumber || 1}
                      </Badge>
                      <Badge
                        variant={issue.status === 'PUBLISHED' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {issue.status}
                      </Badge>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {issue.publishedAt
                          ? new Date(issue.publishedAt).toLocaleDateString()
                          : 'Draft Mode'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {issue.summary || 'Weekly career and aptitude prep roundup.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewItem(issue)}
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                    >
                      Preview
                    </Button>

                    {issue.status !== 'PUBLISHED' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handlePublishNow(issue.id)}
                        isLoading={publishingId === issue.id}
                        leftIcon={<Send className="w-3.5 h-3.5" />}
                      >
                        Publish & Send
                      </Button>
                    )}
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center text-slate-400">
                No newsletter editions created yet.
              </Card>
            )}
          </div>

          {/* Compose Modal */}
          {isComposeOpen && (
            <Modal
              isOpen={isComposeOpen}
              onClose={() => setIsComposeOpen(false)}
              title="Compose Newsletter Issue"
            >
              <form onSubmit={handleCreate} className="space-y-4">
                <Input
                  label="Newsletter Title"
                  placeholder="e.g. Edition #3: Mastering System Design & Off-Campus Drives"
                  value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                  required
                />

                <Input
                  label="Executive Summary (Appears in email preview & cards)"
                  placeholder="e.g. Tips on low-level design rounds, top 5 hiring companies this week, and aptitude mock schedule."
                  value={newIssue.summary}
                  onChange={(e) => setNewIssue({ ...newIssue, summary: e.target.value })}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-700 dark:text-slate-300">
                      Issue Body Content (HTML or rich text)
                    </label>
                    <button
                      type="button"
                      onClick={() => setNewIssue({ ...newIssue, contentHtml: sampleTemplate })}
                      className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Load Standard Layout
                    </button>
                  </div>
                  <textarea
                    rows={10}
                    className="w-full text-xs font-mono p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    placeholder="<p>Write your newsletter contents here...</p>"
                    value={newIssue.contentHtml}
                    onChange={(e) => setNewIssue({ ...newIssue, contentHtml: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsComposeOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                    Save as Draft
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* Preview Modal */}
          {previewItem && (
            <Modal
              isOpen={Boolean(previewItem)}
              onClose={() => setPreviewItem(null)}
              title={previewItem.title}
            >
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-xs text-slate-600 dark:text-slate-300">
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">Summary:</p>
                  <p>{previewItem.summary}</p>
                </div>

                <div
                  className="prose dark:prose-invert max-w-none text-xs leading-relaxed max-h-96 overflow-y-auto p-4 border rounded-xl border-slate-200 dark:border-slate-800"
                  dangerouslySetInnerHTML={{ __html: previewItem.contentHtml }}
                />

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => setPreviewItem(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};
