import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Calendar,
  Users,
  CheckCircle2,
  ChevronRight,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Newsletter } from '../types/index.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { WhatsAppShareButton } from '../components/ui/WhatsAppButton.js';
import { formatNewsletterShareText } from '../utils/whatsapp.js';

export const NewsletterPage: React.FC = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Newsletter | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const res = await api.newsletters.list();
        setNewsletters(res.newsletters);
        if (res.newsletters.length > 0) {
          setSelectedIssue(res.newsletters[0]);
        }
      } catch (err) {
        console.error('Failed to load newsletters:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsletters();
  }, []);

  const handleToggleSubscription = async () => {
    setSubscribing(true);
    const nextState = !isSubscribed;
    try {
      await api.newsletters.subscribe(nextState);
      setIsSubscribed(nextState);
    } catch {
      alert('Subscription update failed.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in">
        {/* AI Newsletter Announcement Card */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-brand-500/10 border border-indigo-200 dark:border-indigo-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Daily AI Intelligence Dispatch</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                  UPDATES AT 8:00 AM
                </span>
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Explore the dedicated AI Newsletter featuring recent 10 days of frontier models, LLM systems, and campus interview questions.
              </p>
            </div>
          </div>
          <Link to="/ai-newsletter" className="shrink-0">
            <Button size="sm" className="text-xs font-semibold gap-1.5 shadow-soft-sm">
              <span>Open AI Newsletter</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>

        {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950 text-xs font-semibold text-amber-700 dark:text-amber-300 mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Official University Placement Bulletin</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
            Placement Strategy & Hiring Trends Newsletter
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            Weekly curated intelligence from campus placement directors on changing online test cutoffs, emerging tech stacks, and behavioral interview tips.
          </p>
        </div>

        {/* Subscribe Toggle Card */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col items-center gap-2 shrink-0 text-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Email Delivery
          </span>
          <p className="text-xs font-bold text-slate-900 dark:text-white">
            Official Placement Digest
          </p>
          <Button
            size="sm"
            variant={isSubscribed ? 'secondary' : 'primary'}
            loading={subscribing}
            onClick={handleToggleSubscription}
            className="text-xs font-semibold py-1 px-4"
          >
            {isSubscribed ? 'Subscribed (Active)' : 'Subscribe to Weekly Dispatch'}
          </Button>
          <span className="text-[10px] text-slate-400">Sent every Monday 9:00 AM</span>
        </div>
      </div>

      {/* Reader & Archive Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Article Reader (8 cols on desktop, top on mobile) */}
        <div className="lg:col-span-8 order-1 lg:order-2">
          {selectedIssue ? (
            <Card className="p-4 sm:p-8 lg:p-10 border-slate-200 dark:border-slate-800">
              {/* Header */}
              <div className="border-b border-slate-100 dark:border-slate-800 pb-6 mb-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-600 dark:text-brand-400">
                    <Badge variant="brand">Edition #{selectedIssue.editionNumber}</Badge>
                    <span>• Official Campus Dispatch</span>
                  </div>
                  <WhatsAppShareButton
                    shareOptions={{
                      phone: null,
                      text: formatNewsletterShareText({
                        title: selectedIssue.title,
                        editionNumber: selectedIssue.editionNumber,
                      }),
                      url: window.location.href,
                    }}
                    variant="outline"
                    size="sm"
                    label="Share on WhatsApp"
                  />
                </div>

                <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-900 dark:text-white leading-tight">
                  {selectedIssue.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedIssue.publishedAt
                      ? new Date(selectedIssue.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'Published'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {selectedIssue.targetAudience}
                  </span>
                </div>
              </div>

              {/* Rendered HTML Content */}
              <div
                className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-200 space-y-4"
                dangerouslySetInnerHTML={{ __html: selectedIssue.contentHtml }}
              />
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400 text-xs">
              Select an edition from the archive to read.
            </Card>
          )}
        </div>

        {/* Archive Directory (4 cols on desktop, secondary on mobile) */}
        <div className="lg:col-span-4 space-y-3 order-2 lg:order-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Past Dispatch Archives
          </h3>

          <div className="space-y-2">
            {newsletters.map((nl) => {
              const isSelected = selectedIssue?.id === nl.id;
              return (
                <Card
                  key={nl.id}
                  onClick={() => {
                    setSelectedIssue(nl);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-950/30 shadow-soft-sm'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      Issue #{nl.editionNumber}
                    </span>
                    <span>
                      {nl.publishedAt
                        ? new Date(nl.publishedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Published'}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
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
      </div>
    </div>
  </StudentLayout>
  );
};
