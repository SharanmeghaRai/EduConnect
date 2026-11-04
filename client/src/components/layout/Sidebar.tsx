import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  BookCheck,
  Brain,
  Briefcase,
  BookOpen,
  FileText,
  MessageSquare,
  Users,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  History,
  Trophy,
  Calendar,
  Bell,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { WhatsAppIcon } from '../ui/WhatsAppButton.js';
import { APTITUDE_SIR_PHONE, APTITUDE_SIR_FORMATTED_PHONE } from '../../utils/whatsapp.js';

interface NavItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

export const Sidebar: React.FC<{ role?: 'STUDENT' | 'ADMIN' }> = ({ role = 'STUDENT' }) => {
  const { user } = useAuth();
  const isAdmin = role === 'ADMIN' || user?.role === 'ADMIN' || user?.role === 'FACULTY';

  const studentLinks: NavItem[] = [
    { to: '/dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { to: '/ai-newsletter', label: 'Daily AI Dispatch', icon: <Brain className="w-4 h-4 text-brand-500" /> },
    { to: '/exams', label: 'Aptitude Exams', icon: <BookCheck className="w-4 h-4" /> },
    { to: '/exam-history', label: 'Attempt History', icon: <History className="w-4 h-4" /> },
    { to: '/leaderboard', label: 'Cohort Leaderboard', icon: <Trophy className="w-4 h-4 text-amber-500" /> },
    { to: '/calendar', label: 'Placement Calendar', icon: <Calendar className="w-4 h-4" /> },
    { to: '/jobs', label: 'Verified Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/materials', label: 'Study Hub', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/newsletter', label: 'Placement Bulletin', icon: <FileText className="w-4 h-4" /> },
    { to: '/notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { to: '/chat', label: 'CampusPrep AI', icon: <MessageSquare className="w-4 h-4" /> },
  ];

  const adminLinks: NavItem[] = [
    { to: '/admin', label: 'Cohort Analytics', icon: <LayoutDashboard className="w-4 h-4" />, end: true },
    { to: '/admin/performance', label: 'Student Marks & Tests', icon: <Award className="w-4 h-4 text-emerald-500" /> },
    { to: '/admin/students', label: 'Student Directory', icon: <Users className="w-4 h-4" /> },
    { to: '/admin/exams', label: 'Exams & Bulk CSV', icon: <BookCheck className="w-4 h-4" /> },
    { to: '/admin/jobs', label: 'Jobs Verifier', icon: <Briefcase className="w-4 h-4" /> },
    { to: '/admin/materials', label: 'Study Resources', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/admin/newsletters', label: 'Newsletter Studio', icon: <FileText className="w-4 h-4" /> },
    { to: '/admin/audit', label: 'Audit Trail Logs', icon: <FileSpreadsheet className="w-4 h-4" /> },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <aside className="w-64 shrink-0 hidden md:block min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4">
      <div className="mb-4 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          {isAdmin ? 'Faculty Administration' : 'Preparation Workspace'}
        </p>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">
          {user?.name || 'Authorized User'}
        </p>
      </div>

      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 shadow-soft-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`
            }
          >
            <span className="shrink-0">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Direct WhatsApp Aptitude Doubt Support Card */}
      <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800">
        <a
          href={`https://wa.me/${APTITUDE_SIR_PHONE}?text=${encodeURIComponent(
            'Hello Aptitude Sir! 👋 I am a student preparing on EduConnect Placement Portal. I have a doubt regarding aptitude and would like your guidance.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-800/60 transition-all group shadow-soft-sm active:scale-95"
          title={`Chat with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
        >
          <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            <WhatsAppIcon className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-100">Aptitude Sir</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-semibold">
              {APTITUDE_SIR_FORMATTED_PHONE}
            </p>
            <p className="text-[9px] text-slate-400 dark:text-slate-500">Ask Doubts on WhatsApp</p>
          </div>
        </a>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
        <NavLink
          to="/profile"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <Settings className="w-4 h-4" />
          Profile Settings
        </NavLink>
        <a
          href="mailto:placements@educonnect.ac.in"
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          <HelpCircle className="w-4 h-4" />
          Contact Placement Cell
        </a>
      </div>
    </aside>
  );
};
