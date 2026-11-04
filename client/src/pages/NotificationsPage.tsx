import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  CheckCircle2,
  Clock,
  Briefcase,
  GraduationCap,
  FileText,
  ExternalLink,
  ChevronRight,
  Filter,
  CheckCheck,
  Inbox,
  AlertCircle,
} from 'lucide-react';
import { api } from '../services/api.js';
import { NotificationItem } from '../types/index.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNREAD' | 'EXAM' | 'JOB' | 'NEWSLETTER'>('ALL');

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.students.notifications.list();
      setNotifications(res.notifications || []);
    } catch (err) {
      console.error('Failed to load notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.students.notifications.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.students.notifications.markAllRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'EXAM':
        return <GraduationCap className="w-4 h-4 text-brand-500" />;
      case 'JOB':
        return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case 'NEWSLETTER':
        return <FileText className="w-4 h-4 text-amber-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-indigo-500" />;
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeFilter === 'UNREAD') return !item.isRead;
    if (activeFilter === 'EXAM') return item.type === 'EXAM';
    if (activeFilter === 'JOB') return item.type === 'JOB';
    if (activeFilter === 'NEWSLETTER') return item.type === 'NEWSLETTER';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Top Header Card */}
        <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <Bell className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Placement Center Dispatch
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Notifications & Alerts
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Stay updated with campus recruitment announcements, verified drive deadlines, mock exam scores, and weekly strategies.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllRead}
                  className="text-xs gap-1.5 shrink-0"
                >
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                  Mark all as read ({unreadCount})
                </Button>
              )}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
            {[
              { id: 'ALL', label: `All (${notifications.length})` },
              { id: 'UNREAD', label: `Unread (${unreadCount})` },
              { id: 'EXAM', label: 'Exams' },
              { id: 'JOB', label: 'Job Drives' },
              { id: 'NEWSLETTER', label: 'Newsletters' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeFilter === f.id
                    ? 'bg-brand-600 text-white shadow-soft-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="min-h-[40vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <Card className="p-12 text-center">
            <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">No notifications</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You are all caught up! New job postings, exam results, and weekly strategy updates will appear here.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (!item.isRead) handleMarkAsRead(item.id);
                }}
                className={`p-4 sm:p-5 rounded-lg border transition-all cursor-pointer relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  item.isRead
                    ? 'bg-white dark:bg-slate-900/60 border-slate-200/80 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-900'
                    : 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800/80 shadow-soft-sm'
                }`}
              >
                {!item.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-brand-500" />
                )}

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-soft-sm">
                    {getIconForType(item.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {item.title}
                      </h4>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-brand-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      {item.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      <span className="uppercase font-semibold tracking-wide text-[9px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {item.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.link && (
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/50 transition-colors"
                    >
                      <span>View</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                  {!item.isRead && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(item.id);
                      }}
                      title="Mark as read"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};
