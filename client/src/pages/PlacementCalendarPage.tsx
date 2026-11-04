import React, { useEffect, useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  Clock,
  ExternalLink,
  MapPin,
  CalendarCheck,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { api } from '../services/api.js';
import { JobListing, Exam } from '../types/index.js';
import { StudentLayout } from '../components/layout/StudentLayout.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

interface CalendarEvent {
  id: string;
  type: 'JOB' | 'EXAM' | 'NEWSLETTER';
  title: string;
  subtitle?: string;
  link?: string;
  dateStr: string; // YYYY-MM-DD
}

export const PlacementCalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDayEvents, setSelectedDayEvents] = useState<CalendarEvent[]>([]);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [jobsRes, examsRes] = await Promise.all([
          api.jobs.list(),
          api.exams.list(),
        ]);
        setJobs(jobsRes.jobs || []);
        setExams(examsRes.exams || []);
      } catch (err) {
        console.error('Failed to load calendar events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Build events map by date string YYYY-MM-DD
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    // 1. Job deadlines
    for (const job of jobs) {
      if (job.deadline) {
        const d = new Date(job.deadline).toISOString().slice(0, 10);
        if (!map.has(d)) map.set(d, []);
        map.get(d)!.push({
          id: `job-${job.id}`,
          type: 'JOB',
          title: `${job.companyName} Application Deadline`,
          subtitle: `${job.roleTitle} • ${job.salaryRange}`,
          link: '/jobs',
          dateStr: d,
        });
      }
    }

    // 2. Weekly Monday newsletter schedule
    for (let day = 1; day <= daysInMonth; day++) {
      const dObj = new Date(year, month, day);
      if (dObj.getDay() === 1) { // Monday
        const dStr = dObj.toISOString().slice(0, 10);
        if (!map.has(dStr)) map.set(dStr, []);
        map.get(dStr)!.push({
          id: `nl-${dStr}`,
          type: 'NEWSLETTER',
          title: 'EduConnect Weekly Placement Strategy Dispatch',
          subtitle: 'Curated technical interview blueprints & company alerts',
          link: '/newsletter',
          dateStr: dStr,
        });
      }
    }

    return map;
  }, [jobs, year, month, daysInMonth]);

  // Handle day click
  const handleSelectDay = (dayNum: number) => {
    const dateStr = new Date(year, month, dayNum).toISOString().slice(0, 10);
    setSelectedDateStr(dateStr);
    setSelectedDayEvents(eventsByDate.get(dateStr) || []);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <StudentLayout>
      <div className="space-y-6 animate-fade-in pb-12">
        {/* Header */}
        <div className="p-6 sm:p-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <CalendarIcon className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Recruitment Schedules & Deadlines
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 dark:text-white">
                Placement Event Calendar
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Track verified drive closing deadlines, weekly strategy dispatches, and scheduled assessment windows at a glance.
              </p>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-3 text-xs shrink-0">
              <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Job Deadlines
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                Weekly Digest
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Grid + Selected Day Inspector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar Master (2 columns) */}
          <div className="lg:col-span-2 p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm">
            {/* Month Nav */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={prevMonth}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Day of Week Header */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Padding blanks for first week */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`blank-${i}`} className="min-h-[70px] sm:min-h-[85px] p-2 rounded-lg bg-slate-50/50 dark:bg-slate-950/20" />
              ))}

              {/* Month Days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = new Date(year, month, dayNum).toISOString().slice(0, 10);
                const dayEvents = eventsByDate.get(dateStr) || [];
                const isSelected = selectedDateStr === dateStr;
                const isToday =
                  new Date().toISOString().slice(0, 10) === dateStr;

                return (
                  <div
                    key={`day-${dayNum}`}
                    onClick={() => handleSelectDay(dayNum)}
                    className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/40 dark:bg-brand-950/40 ring-2 ring-brand-500/20'
                        : isToday
                        ? 'border-indigo-300 dark:border-indigo-700 bg-indigo-50/20 dark:bg-indigo-950/20'
                        : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center ${
                          isToday
                            ? 'bg-brand-600 text-white'
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    {/* Event indicators */}
                    <div className="space-y-1 mt-1">
                      {dayEvents.slice(0, 2).map((ev) => (
                        <div
                          key={ev.id}
                          className={`text-[9px] font-semibold truncate px-1.5 py-0.5 rounded-md ${
                            ev.type === 'JOB'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                              : 'bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300'
                          }`}
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <p className="text-[9px] text-slate-400 font-bold">
                          +{dayEvents.length - 2} more
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Event Drawer (1 column) */}
          <div className="p-6 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-soft-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Selected Schedule
                  </p>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                    {new Date(selectedDateStr).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </h3>
                </div>
                <Badge variant="primary" size="sm">
                  {selectedDayEvents.length} Events
                </Badge>
              </div>

              {selectedDayEvents.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <CalendarCheck className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                  <p className="text-xs font-semibold">No deadlines on this date</p>
                  <p className="text-[11px] mt-1 text-slate-400">
                    Select a date marked with event badges on the calendar grid.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDayEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            ev.type === 'JOB' ? 'bg-emerald-500' : 'bg-indigo-500'
                          }`}
                        />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          {ev.type === 'JOB' ? 'Drive Deadline' : 'Placement Digest'}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {ev.title}
                      </h4>
                      {ev.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          {ev.subtitle}
                        </p>
                      )}
                      {ev.link && (
                        <a
                          href={ev.link}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 dark:text-brand-400 mt-2 hover:underline"
                        >
                          <span>Go to resource</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Campus placement deadlines are verified by faculty placement coordinators daily.
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};
