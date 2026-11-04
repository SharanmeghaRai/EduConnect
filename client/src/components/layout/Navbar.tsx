import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  User,
  Shield,
  Briefcase,
  BookOpen,
  MessageSquare,
  BookCheck,
  Brain,
  ChevronDown,
  Bell,
  Search,
  Menu,
  Trophy,
  CalendarDays,
  LayoutDashboard,
  History,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';
import { useTheme } from '../../context/ThemeContext.js';
import { api } from '../../services/api.js';
import { GlobalSearch } from '../ui/GlobalSearch.js';
import { MobileDrawer } from './MobileDrawer.js';
import { WhatsAppIcon } from '../ui/WhatsAppButton.js';
import { APTITUDE_SIR_PHONE, APTITUDE_SIR_FORMATTED_PHONE } from '../../utils/whatsapp.js';

export const Navbar: React.FC = () => {
  const { user, logout, loginDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'FACULTY';

  // Fetch unread notifications count if user is logged in
  useEffect(() => {
    if (user) {
      api.students.notifications
        .list()
        .then((res) => setUnreadCount(res.unreadCount || 0))
        .catch(() => {});
    }
  }, [user]);

  // Global Ctrl+K / Cmd+K keyboard shortcut for Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { to: '/exams', label: 'Exams', icon: BookCheck, iconColor: 'text-amber-500' },
    { to: '/jobs', label: 'Jobs', icon: Briefcase, iconColor: 'text-emerald-500' },
    { to: '/materials', label: 'Study Hub', icon: BookOpen, iconColor: 'text-sky-500' },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy, iconColor: 'text-yellow-500' },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays, iconColor: 'text-teal-500' },
    { to: '/ai-newsletter', label: 'AI Dispatch', icon: Brain, iconColor: 'text-brand-500' },
    { to: '/chat', label: 'AI Mentor', icon: MessageSquare, iconColor: 'text-indigo-500' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
        <div className="w-full max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 lg:gap-4">
          {/* Left: Mobile Hamburger + Brand Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Navigation Menu"
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-soft-sm group-hover:scale-105 transition-transform shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-extrabold text-base tracking-tight text-slate-900 dark:text-white block leading-tight">
                  Edu<span className="text-brand-600 dark:text-brand-400">Connect</span>
                </span>
                <span className="block text-[9px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500 leading-none mt-0.5">
                  Sahyadri Placement Portal
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Desktop Navigation Links (Clean, No-Wrap, Active States) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar shrink-0">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.to === '/exams'
                  ? location.pathname.startsWith('/exams')
                  : location.pathname === item.to;

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 dark:bg-brand-950/70 dark:text-brand-300 font-bold shadow-soft-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.iconColor} shrink-0`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ml-1 ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-soft-xs'
                    : 'text-rose-600 dark:text-rose-400 bg-rose-50/70 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 hover:bg-rose-100/80'
                }`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0" />
                <span>Faculty Suite</span>
              </Link>
            )}
          </nav>

          {/* Right: Controls (Search, Notifications, Theme, Role Pill, Profile) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Global Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Global Search"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700 transition-colors border border-slate-200/60 dark:border-slate-700/60 shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-xs font-semibold">Search</span>
              <kbd className="hidden md:inline-block text-[9px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Bell Button */}
            {user && (
              <Link
                to="/notifications"
                aria-label="Notifications"
                className="relative p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-sm">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Theme Switcher */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Direct WhatsApp Aptitude Sir Doubt Support Button */}
            <a
              href={`https://wa.me/${APTITUDE_SIR_PHONE}?text=${encodeURIComponent(
                'Hello Aptitude Sir! 👋 I am a student preparing on the EduConnect Placement Portal. I have a doubt regarding aptitude and would like your guidance.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0"
              title={`Chat directly with Aptitude Sir (${APTITUDE_SIR_FORMATTED_PHONE}) on WhatsApp`}
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
              <span className="hidden xl:inline">Ask Aptitude Sir</span>
              <span className="xl:hidden">Aptitude Sir</span>
            </a>

            {/* Quick Demo Switcher Pill (Visible on 2XL screens) */}
            <div className="hidden 2xl:flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
              <button
                onClick={() => loginDemo('student')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                  user?.role === 'STUDENT'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => loginDemo('admin')}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-lg transition-all ${
                  isAdmin
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Faculty
              </button>
            </div>

            {/* User Profile Menu */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                >
                  <img
                    src={
                      user.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366f1&color=fff`
                    }
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover border border-brand-300 dark:border-slate-700 shrink-0"
                  />
                  <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-lg shadow-soft-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-slide-up"
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-300 border border-brand-200/60 dark:border-brand-900/40">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    {/* Role Switcher in Menu (Available across all screen sizes) */}
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Switch Persona (Demo)
                      </p>
                      <div className="grid grid-cols-2 gap-1 bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-xl">
                        <button
                          onClick={() => {
                            loginDemo('student');
                            setShowUserMenu(false);
                          }}
                          className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                            user.role === 'STUDENT'
                              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Student
                        </button>
                        <button
                          onClick={() => {
                            loginDemo('admin');
                            setShowUserMenu(false);
                          }}
                          className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                            isAdmin
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                          }`}
                        >
                          Faculty
                        </button>
                      </div>
                    </div>

                    <div className="py-1">
                      <Link
                        to={isAdmin ? '/admin' : '/dashboard'}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/exam-history"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <History className="w-4 h-4 text-slate-400" />
                        <span>Attempt History</span>
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Student Profile</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Shield className="w-4 h-4" />
                          <span>Faculty Suite</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-soft-sm transition-all shrink-0"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Mobile Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        role={user?.role || 'STUDENT'}
        unreadCount={unreadCount}
      />
    </>
  );
};
