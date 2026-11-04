import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  Mail,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2,
  Share2,
  RefreshCw,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { api } from '../services/api.js';
import { AiNewsletter, AiNewsletterResponse } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { WhatsAppShareButton } from '../components/ui/WhatsAppButton.js';
import { formatNewsletterShareText } from '../utils/whatsapp.js';

export const AiNewsletterPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<AiNewsletter[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<AiNewsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [countdownText, setCountdownText] = useState('');
  const [stats, setStats] = useState<AiNewsletterResponse['stats']>({
    totalRecentDays: 10,
    todayDate: '2026-11-04',
    latestDispatchTime: '',
    nextScheduledDispatch: 'Today at 08:00 AM IST',
    nextScheduledDispatchIso: '',
    cronSchedule: '0 8 * * *',
    updateFrequency: 'Everyday at 8:00 AM',
    timezone: 'Asia/Kolkata (IST)',
    isTodayEditionLive: false,
    secondsUntilNextDispatch: 0,
  });

  const fetchNewsletters = useCallback(async (quiet: boolean = false) => {
    try {
      if (!quiet) setLoading(true);
      const res = await api.aiNewsletters.listRecent();
      setNewsletters(res.newsletters);
      if (res.stats) {
        setStats(res.stats);
      }
      if (res.newsletters.length > 0) {
        setSelectedIssue((prev) => {
          if (!prev) return res.newsletters[0];
          // Keep current selection if still present, otherwise fallback to index 0
          const match = res.newsletters.find((nl) => nl.id === prev.id);
          return match || res.newsletters[0];
        });
      }
    } catch (err) {
      console.error('Failed to load 10-day AI newsletters:', err);
    } finally {
      if (!quiet) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewsletters();
  }, [fetchNewsletters]);

  // Live countdown ticker to next 08:00 AM IST dispatch
  useEffect(() => {
    if (!stats.nextScheduledDispatchIso) return;

    const tick = () => {
      const targetTime = new Date(stats.nextScheduledDispatchIso!).getTime();
      const now = Date.now();
      const diffMs = targetTime - now;

      if (diffMs <= 0) {
        setCountdownText('Updating 8:00 AM edition...');
        // Trigger background silent re-fetch when 8:00 AM arrives
        fetchNewsletters(true);
        return;
      }

      const totalSec = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;

      const pad = (n: number) => n.toString().padStart(2, '0');
      if (hours > 0) {
        setCountdownText(`${hours}h ${pad(minutes)}m ${pad(seconds)}s`);
      } else {
        setCountdownText(`${pad(minutes)}m ${pad(seconds)}s`);
      }
    };

    tick();
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [stats.nextScheduledDispatchIso, fetchNewsletters]);

  // Periodic heartbeat every 60s to keep recent 10 days synced
  useEffect(() => {
    const periodicSync = setInterval(() => {
      fetchNewsletters(true);
    }, 60000);
    return () => clearInterval(periodicSync);
  }, [fetchNewsletters]);

  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);
      await api.aiNewsletters.triggerDaily();
      await fetchNewsletters(true);
    } catch (err) {
      console.error('Error triggering daily 8 AM refresh:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleToggleSubscription = async () => {
    setSubscribing(true);
    const nextState = !isSubscribed;
    try {
      await api.aiNewsletters.subscribe(nextState);
      setIsSubscribed(nextState);
    } catch {
      alert('Subscription update failed.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Filtered newsletters based on search term
  const filteredNewsletters = useMemo(() => {
    if (!searchTerm.trim()) return newsletters;
    const term = searchTerm.toLowerCase();
    return newsletters.filter(
      (nl) =>
        nl.title.toLowerCase().includes(term) ||
        nl.summary.toLowerCase().includes(term) ||
        nl.category.toLowerCase().includes(term) ||
        nl.topics.some((t) => t.toLowerCase().includes(term))
    );
  }, [newsletters, searchTerm]);

  // Current issue index in full 10-day list for Next/Prev buttons
  const currentIndex = selectedIssue
    ? newsletters.findIndex((nl) => nl.id === selectedIssue.id)
    : 0;
  const prevIssue = currentIndex > 0 ? newsletters[currentIndex - 1] : null;
  const nextIssue =
    currentIndex < newsletters.length - 1 ? newsletters[currentIndex + 1] : null;

  // Format date helper: "Tuesday, Nov 03, 2026"
  const formatDateFull = (dateStr?: string) => {
    if (!dateStr) return 'Recent Edition';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Format short date helper: "Nov 03"
  const formatDateShort = (dateStr?: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Helper label for day position: "Today", "Yesterday", or "X days ago"
  const getDayRelativeLabel = (index: number) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Yesterday';
    return `${index} Days Ago`;
  };

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Top Header Hero */}
        <div className="p-6 sm:p-7 rounded-lg bg-slate-900 border border-slate-800 text-white shadow-soft-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Active 10-Day Rolling Archive</span>
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300 text-[11px] font-semibold">
                <Clock className="w-3 h-3 mr-1 text-slate-400" />
                <span>Updated Daily at 08:00 AM IST</span>
              </span>
              {countdownText && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>Next 8 AM: {countdownText}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white">
              AI Intelligence & Technology Placement Digest
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl">
              Curated daily intelligence on frontier reasoning models, LLM system architectures, GPU inference pipelines, and campus recruitment technical interview expectations.
            </p>
          </div>

          {/* Quick Schedule & Automation Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <div className="p-3.5 rounded-md bg-white/5 border border-white/10 text-xs space-y-1.5">
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Schedule:</span>
                <span className="font-bold text-slate-200 font-mono">08:00 AM IST Daily</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-400">Next Dispatch:</span>
                <span className="font-semibold text-emerald-400">{stats.nextScheduledDispatch}</span>
              </div>
              {countdownText && (
                <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10">
                  <span className="text-slate-400">Time to 8 AM:</span>
                  <span className="font-mono font-bold text-amber-300">{countdownText}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={isSubscribed ? 'secondary' : 'primary'}
                loading={subscribing}
                onClick={handleToggleSubscription}
                className="flex-1 text-xs font-semibold py-1.5 px-3 rounded-md"
              >
                {isSubscribed ? 'Subscribed (8 AM)' : 'Subscribe to 8 AM'}
              </Button>

              <Button
                size="sm"
                variant="outline"
                loading={refreshing}
                onClick={handleManualRefresh}
                title="Run today's 8:00 AM automated worker now"
                className="text-xs font-semibold py-1.5 px-3 text-slate-200 border-white/20 hover:bg-white/10 rounded-md"
              >
                <span>Refresh 8 AM</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 10-Day Interactive Timeline Selector Bar */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Recent 10 Days Timeline
              </h2>
              <Badge variant="neutral" className="text-[10px] rounded-md font-mono">
                {newsletters.length} Editions
              </Badge>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search topics, models, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Horizontal 10-Day Cards Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 overflow-x-auto pb-1">
            {newsletters.map((nl, idx) => {
              const isSelected = selectedIssue?.id === nl.id;
              const relativeLabel = getDayRelativeLabel(idx);

              return (
                <button
                  key={nl.id}
                  onClick={() => setSelectedIssue(nl)}
                  className={`p-2.5 rounded-md border text-left transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40 ring-1 ring-brand-600 shadow-soft-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="w-full">
                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`font-semibold px-1 py-0.5 rounded ${
                          idx === 0
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {relativeLabel}
                      </span>
                      <span className="font-mono text-slate-400 dark:text-slate-500 text-[10px]">
                        #{nl.editionNumber}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-900 dark:text-white mt-1 truncate">
                      {formatDateShort(nl.publishedAt)}
                    </p>
                  </div>

                  <p className="text-[9px] text-slate-500 dark:text-slate-400 line-clamp-1 truncate w-full">
                    {nl.category}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Layout: Active Edition Reader (8 cols) & 10-Day Archive Directory (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Article Reader (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <Card className="p-16 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-slate-500">Loading daily AI briefings...</p>
              </Card>
            ) : selectedIssue ? (
              <Card className="p-6 sm:p-10 border-slate-200 dark:border-slate-800 space-y-6">
                {/* Header Information */}
                <div className="border-b border-slate-100 dark:border-slate-800 pb-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="brand">Edition #{selectedIssue.editionNumber}</Badge>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-brand-600 dark:text-brand-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        8:00 AM Dispatch
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 dark:text-slate-400">
                        {selectedIssue.readingTimeMin} min read
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyLink}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
                      </button>

                      <WhatsAppShareButton
                        shareOptions={{
                          phone: null,
                          text: formatNewsletterShareText({
                            title: selectedIssue.title,
                            editionNumber: selectedIssue.editionNumber,
                            readingTimeMin: selectedIssue.readingTimeMin,
                          }),
                          url: window.location.href,
                        }}
                        variant="solid"
                        size="sm"
                        label="WhatsApp"
                        title="Share edition to WhatsApp study group"
                      />
                    </div>
                  </div>

                  <h1 className="text-xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
                    {selectedIssue.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-medium">Published:</span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {formatDateFull(selectedIssue.publishedAt)}
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">|</span>
                    <span className="text-xs text-slate-400 font-medium">Domain:</span>
                    <Badge variant="neutral">{selectedIssue.category}</Badge>
                  </div>

                  {/* Topic Pill Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    {selectedIssue.topics.map((t, i) => (
                      <span
                        key={i}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Takeaways Callout Card */}
                {selectedIssue.keyTakeaways && selectedIssue.keyTakeaways.length > 0 && (
                  <div className="p-5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
                    <div className="text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">
                      <span>Key Takeaways for Students</span>
                    </div>
                    <ul className="space-y-2">
                      {selectedIssue.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-brand-600 dark:text-brand-400 font-bold select-none shrink-0">•</span>
                          <span>{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Campus Interview Relevance Callout */}
                {selectedIssue.campusInterviewRelevance && (
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="block font-bold text-slate-900 dark:text-white mb-1 uppercase tracking-wider text-[11px]">
                      Recruiter Evaluation Perspective:
                    </strong>
                    <p className="leading-relaxed">{selectedIssue.campusInterviewRelevance}</p>
                  </div>
                )}

                {/* Rendered HTML Article Body */}
                <div
                  className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 space-y-4"
                  dangerouslySetInnerHTML={{ __html: selectedIssue.contentHtml }}
                />

                {/* Bottom Timeline Flipping Navigation */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                  {prevIssue ? (
                    <button
                      onClick={() => setSelectedIssue(prevIssue)}
                      className="w-full sm:w-auto flex items-center gap-2 p-2 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <div className="text-left">
                        <span className="block text-[10px] text-slate-400">Previous Day</span>
                        <span className="line-clamp-1">{prevIssue.title}</span>
                      </div>
                    </button>
                  ) : (
                    <div />
                  )}

                  {nextIssue ? (
                    <button
                      onClick={() => setSelectedIssue(nextIssue)}
                      className="w-full sm:w-auto flex items-center justify-end gap-2 p-2 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ml-auto"
                    >
                      <div className="text-right">
                        <span className="block text-[10px] text-slate-400">Next Day</span>
                        <span className="line-clamp-1">{nextIssue.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <div />
                  )}
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center text-slate-400 text-xs">
                Select an edition from the 10-day timeline above to begin reading.
              </Card>
            )}
          </div>

          {/* Right Sidebar: 10-Day Archive Directory & AI Preparation Links (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            {/* Daily Automated Worker Info Card */}
            <Card className="p-5 border-slate-200 dark:border-slate-800 space-y-3.5">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <span>Daily 08:00 AM Engine</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Automated background dispatch (<code>0 8 * * *</code>) runs every morning at <strong>8:00 AM IST</strong> to compile overnight AI discoveries into this 10-day archive.
              </p>

              <div className="p-3 rounded-md bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Daily Dispatch:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">08:00 AM IST</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Run:</span>
                  <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                    {countdownText || stats.nextScheduledDispatch}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Archive Window:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Recent 10 Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Catchup Safety:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">10m Heartbeat & Boot</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subscribers:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">1,540+ Registered</span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                loading={refreshing}
                onClick={handleManualRefresh}
                className="w-full text-xs font-semibold justify-center rounded-md"
              >
                <span>Trigger 8 AM Refresh Now</span>
              </Button>
            </Card>

            {/* 10-Day List Directory */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                <span>Recent 10 Days Archive</span>
                <span className="text-[11px] font-normal text-slate-400">
                  {filteredNewsletters.length} of 10
                </span>
              </h3>

              <div className="space-y-2">
                {filteredNewsletters.map((nl, idx) => {
                  const isSelected = selectedIssue?.id === nl.id;
                  return (
                    <Card
                      key={nl.id}
                      onClick={() => setSelectedIssue(nl)}
                      className={`p-3.5 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/30 shadow-soft-sm'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-bold text-brand-600 dark:text-brand-400">
                          #{nl.editionNumber} • {formatDateShort(nl.publishedAt)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          {getDayRelativeLabel(idx)}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                        {nl.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {nl.summary}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Link to Campus Placement Bulletin */}
            <Card className="p-4 border-slate-200 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                <span>Placement Cell Bulletins</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Official university test cutoffs, company recruitment drives, and interview frameworks are archived in the Placement Bulletin.
              </p>
              <a
                href="/newsletter"
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline pt-1"
              >
                Go to Placement Bulletin <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </Card>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
