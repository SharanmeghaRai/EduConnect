import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  Bookmark,
  ExternalLink,
  ShieldCheck,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertOctagon,
  Clock,
  X,
} from 'lucide-react';
import { api } from '../services/api.js';
import { JobListing } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge, VerifiedBadge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { WhatsAppShareButton } from '../components/ui/WhatsAppButton.js';
import { formatJobShareText } from '../utils/whatsapp.js';

export const JobsPage: React.FC = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState<'ALL' | 'FULL_TIME' | 'INTERNSHIP'>('ALL');
  const [onlySaved, setOnlySaved] = useState(false);

  // Applied tracking set in localStorage
  const [appliedIds, setAppliedIds] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('educonnect_applied_jobs');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Report broken link modal
  const [reportingJobId, setReportingJobId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('404 Page Not Found or Expired Form');
  const [reportSuccess, setReportSuccess] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await api.jobs.list({
        jobType: jobTypeFilter !== 'ALL' ? jobTypeFilter : undefined,
        search: search || undefined,
      });
      setJobs(res.jobs);
    } catch (err) {
      console.error('Failed to load job listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [jobTypeFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const toggleBookmark = async (id: string) => {
    try {
      await api.jobs.toggleBookmark(id);
      setJobs((prev) =>
        prev.map((j) => (j.id === id ? { ...j, isBookmarked: !j.isBookmarked } : j))
      );
    } catch (err) {
      console.error('Bookmark toggle failed:', err);
    }
  };

  const toggleApplied = (id: string) => {
    setAppliedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem('educonnect_applied_jobs', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const handleApplyClick = async (job: JobListing) => {
    try {
      await api.jobs.trackClick(job.id);
    } catch {
      // ignore track telemetry failure
    }
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportingJobId) return;

    try {
      await api.jobs.report(reportingJobId, reportReason);
      setReportSuccess(true);
      setTimeout(() => {
        setReportSuccess(false);
        setReportingJobId(null);
      }, 1500);
    } catch (err) {
      alert('Failed to submit link report.');
    }
  };

  const displayedJobs = jobs.filter((j) => {
    if (onlySaved && !j.isBookmarked) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    const companyMatch = j.companyName.toLowerCase().includes(q);
    const roleMatch = j.roleTitle.toLowerCase().includes(q);
    const skillsMatch = (j.requiredSkills || '').toLowerCase().includes(q);
    const locMatch = (j.location || '').toLowerCase().includes(q);
    return companyMatch || roleMatch || skillsMatch || locMatch;
  });

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Faculty Verified Placement Drives</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Verified Campus Recruitment & Internships
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Every opportunity is vetted by the University Placement Board for legitimate eligibility, compensation transparency, and direct corporate application links.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
        >
          {/* Job Type Toggle Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {(['ALL', 'FULL_TIME', 'INTERNSHIP'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setJobTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  jobTypeFilter === type
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-soft-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {type === 'ALL' ? 'All Roles' : type === 'FULL_TIME' ? 'Full-Time (SDE)' : 'Internships'}
              </button>
            ))}
          </div>

          {/* Search Input & Saved filter */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search company, skills, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOnlySaved(!onlySaved)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                onlySaved
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${onlySaved ? 'fill-brand-600' : ''}`} />
              <span>Saved Only</span>
            </button>
          </div>
        </form>
      </div>

      {/* Listings List */}
      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : displayedJobs.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No opportunities match criteria</h3>
          <p className="text-xs text-slate-400 mt-1">Check back soon or broaden your search filter.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayedJobs.map((job) => {
            const isApplied = appliedIds.has(job.id);
            const daysLeft = Math.ceil(
              (new Date(job.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
            );

            return (
              <Card
                key={job.id}
                hoverEffect
                className="p-5 sm:p-6 border-slate-200/90 dark:border-slate-800"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Company & Role Details */}
                  <div className="flex items-start gap-4">
                    <img
                      src={
                        job.companyLogo ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyName)}&background=0f172a&color=fff`
                      }
                      alt={job.companyName}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {job.companyName}
                        </span>

                        {/* Special Verified Badge with hover metadata */}
                        {job.isVerified && (
                          <VerifiedBadge
                            source={job.verificationSource}
                            verifiedAt={job.verifiedAt}
                          />
                        )}

                        <Badge variant={job.jobType === 'INTERNSHIP' ? 'info' : 'brand'} size="sm">
                          {job.jobType.replace('_', ' ')}
                        </Badge>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {job.roleTitle}
                      </h3>

                      {/* Metadata Chips: Location, CTC, Deadline */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-2">
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {daysLeft > 0 ? `Closes in ${daysLeft} days` : 'Closing today'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center shrink-0">
                    {/* Mark as Applied Toggle */}
                    <button
                      onClick={() => toggleApplied(job.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isApplied
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300'
                          : 'border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isApplied ? 'text-emerald-600 fill-emerald-100' : ''}`} />
                      <span>{isApplied ? 'Applied' : 'Track Application'}</span>
                    </button>

                    {/* Bookmark Toggle */}
                    <button
                      onClick={() => toggleBookmark(job.id)}
                      className={`p-2 rounded-lg border transition-colors ${
                        job.isBookmarked
                          ? 'border-brand-500 bg-brand-50 dark:bg-brand-950 text-brand-600'
                          : 'border-slate-300 dark:border-slate-700 text-slate-400 hover:text-slate-600'
                      }`}
                      title={job.isBookmarked ? 'Remove Bookmark' : 'Bookmark Job'}
                    >
                      <Bookmark className={`w-4 h-4 ${job.isBookmarked ? 'fill-brand-600' : ''}`} />
                    </button>

                    {/* WhatsApp Share Button */}
                    <WhatsAppShareButton
                      shareOptions={{
                        phone: null,
                        text: formatJobShareText({
                          companyName: job.companyName,
                          roleTitle: job.roleTitle,
                          jobType: job.jobType,
                          location: job.location,
                          salaryRange: job.salaryRange,
                          deadline: job.deadline,
                          applyUrl: job.applyUrl,
                        }),
                      }}
                      variant="outline"
                      size="sm"
                      label="Share"
                      title="Share this verified job alert on WhatsApp placement group"
                    />

                    {/* Official Apply Link Button */}
                    <Button
                      size="sm"
                      onClick={() => handleApplyClick(job)}
                      className="bg-brand-600 hover:bg-brand-700 text-xs font-bold gap-1 shadow-soft-sm"
                    >
                      <span>Apply Official</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Eligibility Criteria & Skills Strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                    <strong className="text-slate-900 dark:text-white">Eligibility:</strong>{' '}
                    {job.eligibilityCriteria}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px] text-slate-400">
                      Skills: <strong className="text-slate-700 dark:text-slate-300">{job.requiredSkills}</strong>
                    </span>

                    {/* Report broken link */}
                    <button
                      onClick={() => setReportingJobId(job.id)}
                      className="text-[11px] text-slate-400 hover:text-rose-500 underline transition-colors"
                    >
                      Report link issue
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Report Broken Link Modal */}
      <Modal
        isOpen={!!reportingJobId}
        onClose={() => setReportingJobId(null)}
        title="Report Opportunity Link Issue"
      >
        <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300">
            Our automated link health engine checks listings daily. If you encountered a 404 error, expired registration, or broken URL, notify the placement cell below:
          </p>

          <div>
            <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Reason / Observed Issue
            </label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2 text-xs"
            >
              <option value="404 Page Not Found or Expired Form">404 Page Not Found or Expired Form</option>
              <option value="Application Form Closed Ahead of Deadline">Application Form Closed Ahead of Deadline</option>
              <option value="Incorrect Job Description or Eligibility">Incorrect Job Description or Eligibility</option>
              <option value="Suspicious or Third-Party Intermediary">Suspicious or Third-Party Intermediary</option>
            </select>
          </div>

          {reportSuccess ? (
            <p className="text-emerald-600 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Thank you! Report submitted to Placement Cell.
            </p>
          ) : (
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" type="button" onClick={() => setReportingJobId(null)}>
                Cancel
              </Button>
              <Button variant="danger" size="sm" type="submit">
                Submit Report
              </Button>
            </div>
          )}
        </form>
      </Modal>
    </div>
  </StudentLayout>
  );
};
