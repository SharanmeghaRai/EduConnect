import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  BookCheck,
  Brain,
  Briefcase,
  BookOpen,
  FileText,
  MessageSquare,
  History,
  Trophy,
  Calendar,
  Bell,
  User,
  Shield,
  GraduationCap,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { WhatsAppIcon } from '../ui/WhatsAppButton.js';
import { APTITUDE_SIR_PHONE, APTITUDE_SIR_FORMATTED_PHONE } from '../../utils/whatsapp.js';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  unreadCount?: number;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  role,
  unreadCount = 0,
}) => {
  const location = useLocation();
  const { logout } = useAuth();

  // Close drawer on route change
  useEffect(() => {
    onClose();
  }, [location.pathname]);

  if (!isOpen) return null;

  const isAdmin = role === 'ADMIN' || role === 'FACULTY';

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/exams', label: 'Aptitude Exams', icon: BookCheck },
    { to: '/exam-history', label: 'Attempt History', icon: History },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/calendar', label: 'Placement Calendar', icon: Calendar },
    { to: '/jobs', label: 'Verified Jobs', icon: Briefcase },
    { to: '/materials', label: 'Study Hub', icon: BookOpen },
    { to: '/newsletter', label: 'Placement Digest', icon: FileText },
    { to: '/ai-newsletter', label: 'Daily AI Dispatch', icon: Brain },
    { to: '/chat', label: 'AI Mentor (RAG)', icon: MessageSquare },
    { to: '/notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { to: '/profile', label: 'Student Profile', icon: User },
  ];

  return (
    <div className="fixed inset-0 z-50 xl:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between p-4 z-10 animate-fade-in">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-soft-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="font-display font-black text-sm tracking-tight text-slate-900 dark:text-white">
                  Edu<span className="text-brand-600 dark:text-brand-400">Connect</span>
                </span>
                <span className="block text-[9px] uppercase tracking-wide text-slate-400 font-semibold">
                  Sahyadri Portal
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] pr-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-soft-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </span>
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {isAdmin && (
              <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <Link
                  to="/admin/performance"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Student Marks & Tests</span>
                </Link>
                <Link
                  to="/admin"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60"
                >
                  <Shield className="w-4 h-4" />
                  <span>Faculty Suite</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Aptitude Sir WhatsApp Doubt Support */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <a
            href={`https://wa.me/${APTITUDE_SIR_PHONE}?text=${encodeURIComponent(
              'Hello Aptitude Sir! 👋 I am a student on EduConnect and have a doubt regarding aptitude preparation.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
              <WhatsAppIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold">Ask Aptitude Sir</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-semibold">
                {APTITUDE_SIR_FORMATTED_PHONE}
              </p>
              <p className="text-[9px] text-slate-400">Direct WhatsApp Doubt Support</p>
            </div>
          </a>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
          <p className="font-semibold text-slate-500 dark:text-slate-400">Sahyadri Placement Cell</p>
          <p className="mt-0.5 text-[10px]">Mangalore, Karnataka</p>
        </div>
      </div>
    </div>
  );
};
