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
  Briefcase,
  Plus,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Trash2,
  CheckCircle2,
  Calendar,
  MapPin,
  Building,
} from 'lucide-react';

export const AdminJobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: 'Bengaluru / Hybrid',
    jobType: 'FULL_TIME',
    ctcSalary: '12 - 18 LPA',
    description: '',
    eligibility: 'B.Tech / B.E. (CSE, ISE, ECE) with 7.0+ CGPA',
    skills: 'Java, Spring Boot, React, SQL',
    applyUrl: '',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    source: 'Campus Placement Office Direct Drive',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.jobs.list();
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.admin.createJob({
        ...newJob,
        skills: newJob.skills.split(',').map((s) => s.trim()).filter(Boolean),
        deadline: new Date(newJob.deadline).toISOString(),
      });
      setIsCreateOpen(false);
      fetchJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to publish job.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure you want to delete this job listing?')) return;
    try {
      await api.admin.deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  const handleToggleVerified = async (job: any) => {
    try {
      const updated = await api.admin.updateJob(job.id, {
        isVerified: !job.isVerified,
      });
      setJobs((prev) =>
        prev.map((j) => (j.id === job.id ? { ...j, isVerified: !job.isVerified } : j))
      );
    } catch (err) {
      console.error('Failed to update verification status:', err);
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
                  Placement Drives & Job Link Verifier
                </h1>
                <Badge variant="success">Verified Badge Hub</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Post authorized campus drives, verify company portals, track candidate click-throughs, and review broken links.
              </p>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Post New Drive
            </Button>
          </div>

          {/* Job listings table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Role & Company</th>
                    <th className="px-4 py-3">Location / Type</th>
                    <th className="px-4 py-3">CTC / Stipend</th>
                    <th className="px-4 py-3">Verification</th>
                    <th className="px-4 py-3">Deadline</th>
                    <th className="px-4 py-3">Clicks</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                      </td>
                    </tr>
                  ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                      <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-slate-900 dark:text-white">{job.title}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" /> {job.company}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {job.location}
                          </span>
                          <span className="block text-[10px] text-brand-600 dark:text-brand-400">
                            {job.jobType}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                          {job.ctcSalary || 'As per norms'}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleToggleVerified(job)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                              job.isVerified
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : 'bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {job.isVerified ? 'Verified' : 'Unverified'}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          {new Date(job.deadline).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                          {job.clickCount || 0}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={job.applyUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Test Apply Link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No job postings found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Create Job Modal */}
          {isCreateOpen && (
            <Modal
              isOpen={isCreateOpen}
              onClose={() => setIsCreateOpen(false)}
              title="Post Verified Campus Placement Drive"
            >
              <form onSubmit={handleCreateJob} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Job / Role Title"
                    placeholder="e.g. Associate Software Engineer"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    required
                  />
                  <Input
                    label="Company Name"
                    placeholder="e.g. Microsoft India"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Opportunity Type
                    </label>
                    <select
                      className="w-full text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2"
                      value={newJob.jobType}
                      onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                    >
                      <option value="FULL_TIME">Full Time</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="INTERN_TO_FTE">Intern to FTE</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="CTC / Stipend"
                    placeholder="e.g. 14.5 LPA or 45,000/mo"
                    value={newJob.ctcSalary}
                    onChange={(e) => setNewJob({ ...newJob, ctcSalary: e.target.value })}
                  />
                  <Input
                    label="Application Deadline"
                    type="date"
                    value={newJob.deadline}
                    onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                  />
                </div>

                <Input
                  label="Application URL"
                  type="url"
                  placeholder="https://careers.company.com/apply/..."
                  value={newJob.applyUrl}
                  onChange={(e) => setNewJob({ ...newJob, applyUrl: e.target.value })}
                  required
                />

                <Input
                  label="Required Skills (Comma separated)"
                  placeholder="Java, Python, Algorithms, System Design"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                />

                <Input
                  label="Eligibility Criteria"
                  placeholder="B.E./B.Tech (CSE/ISE/ECE), CGPA >= 7.0, No active backlogs"
                  value={newJob.eligibility}
                  onChange={(e) => setNewJob({ ...newJob, eligibility: e.target.value })}
                />

                <Input
                  label="Verification Source"
                  placeholder="Direct HR Communication / TPO Portal"
                  value={newJob.source}
                  onChange={(e) => setNewJob({ ...newJob, source: e.target.value })}
                />

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={submitting}>
                    Verify & Publish Listing
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
