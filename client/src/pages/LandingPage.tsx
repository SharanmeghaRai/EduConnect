import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Award,
  ArrowRight,
  CheckCircle2,
  Users,
  MapPin,
  Building2,
  Timer,
  ChevronRight,
  TrendingUp,
  Brain,
  Target,
  Layers,
  Briefcase,
  Star,
  Sun,
  Moon,
  Menu,
  X,
  Compass,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

export const LandingPage: React.FC = () => {
  const { user, loginDemo } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for sticky navbar shadow transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const recruiterCompanies = [
    { name: 'TCS Digital / Ninja', batch: '2025-26', category: 'Enterprise IT' },
    { name: 'Infosys DSE / SE', batch: '2025-26', category: 'Global Systems' },
    { name: 'Accenture ASE / FSE', batch: '2025-26', category: 'Consulting' },
    { name: 'Cognizant (CTS)', batch: '2025-26', category: 'Digital Engineering' },
    { name: 'Wipro Elite NTH', batch: '2025-26', category: 'Technology Services' },
    { name: 'Atlassian & Tier-1', batch: 'Product', category: 'Product Innovation' },
  ];

  const companyTracks = [
    {
      company: 'Accenture',
      title: 'Cognitive & Technical Series',
      description:
        'Critical reasoning, abstract logic, technical MCQs (pseudo-code, networking, cloud), and verbal grammar.',
      testCount: 'Tests 1 to 3',
      badge: 'Cognitive + Technical',
      badgeStyle: 'bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF] border-[#5146CD]/20',
      accentColor: 'from-[#5146CD] to-[#8175FF]',
    },
    {
      company: 'TCS',
      title: 'Ninja & Digital Recruitment Series',
      description:
        'Numerical ability, statistics, advanced quantitative reasoning, logical deduction, and verbal comprehension.',
      testCount: 'Tests 1 & 2',
      badge: 'NQT Pattern',
      badgeStyle: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      accentColor: 'from-blue-600 to-indigo-600',
    },
    {
      company: 'Infosys',
      title: 'Specialist & SE Assessment',
      description:
        'Mathematical reasoning, spatial aptitude, data interpretation, cryptarithmetic, and verbal grammar test modules.',
      testCount: 'Test 3 + Mock',
      badge: 'DSE & SE Track',
      badgeStyle: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      accentColor: 'from-sky-600 to-blue-600',
    },
    {
      company: 'Cognizant (CTS)',
      title: 'GenC & GenC Next Drive',
      description:
        'Analytical reasoning, code debugging concepts, data sufficiency, and reading comprehension passages.',
      testCount: 'Test 3 Series',
      badge: 'GenC Pattern',
      badgeStyle: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      accentColor: 'from-teal-600 to-emerald-600',
    },
    {
      company: 'Wipro',
      title: 'Elite National Talent Hunt',
      description:
        'Quantitative aptitude, logical deduction, verbal ability, and Automata coding fundamentals.',
      testCount: 'Tests 1 & 2',
      badge: 'NTH Track',
      badgeStyle: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      accentColor: 'from-amber-600 to-orange-600',
    },
    {
      company: 'International',
      title: 'Japanese Global Recruitment Drives',
      description:
        'Full Kanji, Hiragana, Katakana, and business vocabulary tests prepared for students participating in Japanese overseas campus recruitments.',
      testCount: '2 Specialty Exams',
      badge: 'JLPT N5 / N4 Track',
      badgeStyle: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      accentColor: 'from-indigo-600 to-[#5146CD]',
      isSpecial: true,
    },
  ];

  const statMetrics = [
    {
      value: '20',
      label: 'Full-Length Mock Exams',
      desc: '300+ Verified MCQs with realistic negative marking',
      icon: Timer,
      accent: 'text-[#5146CD] dark:text-[#8175FF]',
      borderHover: 'hover:border-[#5146CD]/40',
      bgIcon: 'bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF]',
    },
    {
      value: '100%',
      label: 'Faculty-Verified Assets',
      desc: 'Direct application links authenticated daily by placement cell',
      icon: ShieldCheck,
      accent: 'text-[#159B75] dark:text-emerald-400',
      borderHover: 'hover:border-[#159B75]/40',
      bgIcon: 'bg-[#159B75]/10 text-[#159B75] dark:bg-emerald-950/40 dark:text-emerald-400',
    },
    {
      value: '24/7',
      label: 'Campus Placement AI Mentor',
      desc: 'Step-by-step formula derivations & STAR coaching',
      icon: Brain,
      accent: 'text-[#5146CD] dark:text-[#8175FF]',
      borderHover: 'hover:border-[#5146CD]/40',
      bgIcon: 'bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF]',
    },
    {
      value: '₹40 LPA',
      label: 'Highest Campus Package',
      desc: 'Sahyadri engineering graduate recruitment record',
      icon: Award,
      accent: 'text-[#111B3C] dark:text-white',
      borderHover: 'hover:border-[#111B3C]/40',
      bgIcon: 'bg-slate-100 dark:bg-slate-800 text-[#111B3C] dark:text-white',
    },
  ];

  const successStories = [
    {
      name: 'Kavya Shenoy',
      dept: 'Computer Science (2025 Batch)',
      role: 'Placed at TCS Digital',
      package: '₹9.0 LPA',
      quote:
        'The TCS NQT mocks with negative marking prepared me for the exact pressure of the actual campus drive. The AI explanations for permutation problems were eye-opening!',
      initials: 'KS',
    },
    {
      name: 'Nikhil Poojary',
      dept: 'Information Science (2025 Batch)',
      role: 'Placed at Accenture FSE',
      package: '₹6.5 LPA',
      quote:
        'Accessing the 8 Sahyadri aptitude past-papers inside the platform gave me full clarity on recurring reasoning patterns. Best resource built for our campus!',
      initials: 'NP',
    },
    {
      name: 'Tanvi Rai',
      dept: 'Electronics & Communication (2025 Batch)',
      role: 'Placed at Infosys Specialist',
      package: '₹9.5 LPA',
      quote:
        'The JLPT N5 tests combined with the aptitude hub enabled me to crack both global drives and tier-1 Indian product evaluations without extra tuition.',
      initials: 'TR',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F8FC] dark:bg-[#0B0F19] text-[#20283A] dark:text-slate-100 selection:bg-[#5146CD] selection:text-white antialiased">
      {/* 1. Institutional Top Announcement Bar */}
      <div className="bg-[#111B3C] text-white py-2 px-4 text-xs font-medium tracking-wide border-b border-white/10">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-[#159B75] animate-pulse" />
            <span>
              <strong className="text-white">Sahyadri Placement Drive Season 2026</strong> is active. 20 Full-Length Company Mocks and Verified Drives are live!
            </span>
          </div>
          <Link
            to="/exams"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-[#8175FF] hover:text-white transition-colors"
          >
            <span>Start Practicing</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Redesigned Sticky Navigation Bar */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#111B3C]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800'
            : 'bg-white/80 dark:bg-[#111B3C]/80 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo & College Identity */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#111B3C] dark:bg-[#5146CD] flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5 text-[#8175FF] dark:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-display font-bold text-lg tracking-tight text-[#111B3C] dark:text-white">
                  Edu<span className="text-[#5146CD] dark:text-[#8175FF]">Connect</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#111B3C]/5 dark:bg-white/10 text-[#737B91] dark:text-slate-300">
                  Autonomous
                </span>
              </div>
              <span className="block text-[11px] font-medium text-[#737B91] dark:text-slate-400 leading-tight mt-0.5">
                Sahyadri College of Engg. & Mgmt.
              </span>
            </div>
          </Link>

          {/* Clean Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1.5 font-medium text-sm text-[#737B91] dark:text-slate-300">
            <a
              href="#placement-architecture"
              className="px-3.5 py-2 rounded-lg hover:text-[#111B3C] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
            >
              Placement Preparation
            </a>
            <a
              href="#company-blueprints"
              className="px-3.5 py-2 rounded-lg hover:text-[#111B3C] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
            >
              Company Blueprints
            </a>
            <Link
              to="/exams"
              className="px-3.5 py-2 rounded-lg hover:text-[#111B3C] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
            >
              Mock Exams
            </Link>
            <a
              href="#about"
              className="px-3.5 py-2 rounded-lg hover:text-[#111B3C] dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition-colors"
            >
              About
            </a>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl text-[#737B91] hover:text-[#111B3C] dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Auth CTAs */}
            {user ? (
              <Link
                to={user.role === 'ADMIN' || user.role === 'FACULTY' ? '/admin' : '/dashboard'}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] shadow-sm transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loginDemo('student')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#20283A] dark:text-slate-200 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-soft-sm transition-all"
                >
                  <Users className="w-3.5 h-3.5 text-[#5146CD] dark:text-[#8175FF]" />
                  <span>Demo</span>
                </button>

                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] shadow-sm transition-all"
                >
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="lg:hidden p-2 rounded-xl text-[#737B91] hover:text-[#111B3C] dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111B3C] px-4 py-4 space-y-2 shadow-lg animate-fade-in">
            <a
              href="#placement-architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#20283A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Placement Preparation
            </a>
            <a
              href="#company-blueprints"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#20283A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Company Blueprints
            </a>
            <Link
              to="/exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#20283A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Mock Exams
            </Link>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-[#20283A] dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              About Sahyadri Placement Cell
            </a>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {!user && (
                <>
                  <button
                    onClick={() => {
                      loginDemo('student');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-[#20283A] dark:text-slate-200"
                  >
                    Quick Student Demo Login
                  </button>
                  <button
                    onClick={() => {
                      loginDemo('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center px-4 py-2.5 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                  >
                    Faculty / Admin Portal
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* 3. Hero Section – Highest Priority */}
      <section className="relative overflow-hidden pt-10 pb-16 lg:pt-16 lg:pb-24">
        {/* Subtle architectural ambient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F7F8FC] via-white to-[#F7F8FC] dark:from-[#0B0F19] dark:via-[#111B3C]/40 dark:to-[#0B0F19] -z-10 pointer-events-none" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-[#5146CD]/5 dark:bg-[#5146CD]/10 blur-[140px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Institutional Badge Cluster */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#111B3C] border border-slate-200 dark:border-slate-700/80 text-[#111B3C] dark:text-slate-200 text-xs font-semibold mb-6 shadow-sm">
            <span className="flex items-center gap-1.5 text-[#5146CD] dark:text-[#8175FF]">
              <Award className="w-4 h-4 shrink-0" />
              <span>Sahyadri College of Engineering & Management</span>
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">•</span>
            <span className="hidden sm:inline text-[#737B91] dark:text-slate-400 font-medium">
              Placement & Career Development Cell
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#159B75]/10 text-[#159B75] dark:bg-emerald-950/40 dark:text-emerald-400 text-[10px] font-bold">
              Autonomous
            </span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-[#111B3C] dark:text-white max-w-5xl mx-auto leading-[1.1] sm:leading-[1.1]">
            Master Campus Drives with{' '}
            <span className="text-[#5146CD] dark:text-[#8175FF]">
              Structured Confidence
            </span>
          </h1>

          {/* Clear, Compelling Subtitle */}
          <p className="mt-5 text-base sm:text-lg lg:text-xl text-[#737B91] dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            Sahyadri's official placement readiness portal: 20 full-length company-pattern timed mock exams, 100% faculty-verified placement drives, comprehensive company archives, and an AI mentor grounded in campus recruitment standards.
          </p>

          {/* Two Professionally Styled CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            {user ? (
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group"
              >
                <span>Go to Student Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                to="/exams"
                className="px-6 py-3 rounded-xl text-sm font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 group"
              >
                <span>Explore Aptitude Exams</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )}

            <button
              onClick={() => loginDemo('student')}
              className="px-5 py-3 rounded-xl text-sm font-semibold text-[#20283A] dark:text-slate-200 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all inline-flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#5146CD] dark:text-[#8175FF]" />
              <span>Instant Student Demo</span>
            </button>

            <button
              onClick={() => loginDemo('admin')}
              className="px-4 py-3 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 hover:bg-rose-100/70 dark:hover:bg-rose-900/40 transition-all inline-flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              <span>Faculty Portal</span>
            </button>
          </div>

          {/* HERO CENTERPIECE: The Actual Sahyadri Campus Photograph */}
          <div className="mt-12 max-w-6xl mx-auto">
            <div className="relative rounded-2xl lg:rounded-3xl p-2 sm:p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden group">
              <div className="relative rounded-xl lg:rounded-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-slate-900 shadow-inner">
                <img
                  src="/campus-hero.png"
                  alt="Sahyadri College of Engineering & Management, Adyar Mangalore - Riverfront Campus"
                  className="w-full h-full object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                />

                {/* Subtle gradient vignette at top and bottom for overlay legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#111B3C]/80 via-transparent to-[#111B3C]/30 pointer-events-none" />

                {/* Clean Top-Left Institutional Pill (Does not obstruct image) */}
                <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-[#111B3C]/85 backdrop-blur-md border border-white/20 text-white text-xs font-medium shadow-md">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-semibold">Sahyadri Campus</span>
                  <span className="text-white/40 hidden sm:inline">•</span>
                  <span className="text-slate-200 hidden sm:inline">Adyar, Mangalore</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#159B75]/20 text-emerald-300 border border-[#159B75]/30 text-[10px] font-bold ml-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#159B75] animate-pulse" />
                    Riverfront Hub
                  </span>
                </div>

                {/* Clean Top-Right Accreditation Pill */}
                <div className="absolute top-3 right-3 sm:top-5 sm:right-5 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#111B3C]/85 backdrop-blur-md border border-white/20 text-white text-xs font-semibold shadow-md">
                  <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Autonomous • NAAC 'A' Grade</span>
                </div>

                {/* Clean Bottom Overlay Bar: Unobtrusive, Elegant & Functional */}
                <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 sm:py-3 rounded-xl bg-[#111B3C]/90 backdrop-blur-md border border-white/15 text-white shadow-lg text-left">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-8 h-8 rounded-lg bg-[#5146CD]/30 border border-[#5146CD]/40 flex items-center justify-center text-[#8175FF] shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        Sahyadri Placement & Career Development Cell
                      </h2>
                      <p className="text-[11px] text-slate-300">
                        250+ Tier-1 Recruiters • Official Exam & Recruitment Infrastructure
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                    <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5" />
                      93.8% Cohort Placed
                    </span>
                    <Link
                      to="/exams"
                      className="text-xs font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] px-3.5 py-1 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>20 Mocks</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recruiter Marquee / Target Recruiter Badges */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 text-xs text-[#737B91] dark:text-slate-400">
              <span className="font-semibold text-[#111B3C] dark:text-slate-200 text-xs mr-1">
                Target Recruiters:
              </span>
              {recruiterCompanies.map((rec) => (
                <span
                  key={rec.name}
                  className="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[#20283A] dark:text-slate-300 font-medium text-xs shadow-soft-sm hover:border-[#5146CD]/40 dark:hover:border-[#8175FF]/40 transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5146CD]" />
                  {rec.name}
                </span>
              ))}
            </div>
          </div>

          {/* 4. Statistics Section (Preserving exact 4 metrics, styled with high contrast and clarity) */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto text-left">
            {statMetrics.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm ${stat.borderHover} transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-9 h-9 rounded-xl ${stat.bgIcon} flex items-center justify-center`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#737B91] dark:text-slate-400">
                        Official Metric
                      </span>
                    </div>
                    <span className={`text-3xl sm:text-4xl font-display font-black tracking-tight ${stat.accent} block mb-1.5`}>
                      {stat.value}
                    </span>
                    <h3 className="text-sm font-bold text-[#111B3C] dark:text-white leading-snug">
                      {stat.label}
                    </h3>
                  </div>
                  <p className="text-xs text-[#737B91] dark:text-slate-400 mt-2.5 leading-relaxed pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    {stat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Company-Specific Recruitment Blueprints */}
      <section
        id="company-blueprints"
        className="py-16 lg:py-20 bg-white dark:bg-[#0E1526] border-t border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF] text-xs font-semibold mb-3">
                <Target className="w-3.5 h-3.5" />
                <span>Sahyadri Aptitude Practice Tracks</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#111B3C] dark:text-white">
                Company-Specific Recruitment Blueprints
              </h2>
              <p className="text-[#737B91] dark:text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                Practiced by thousands of Sahyadri aspirants. Exact duration, section splits, and negative marking configured to match official placement screenings.
              </p>
            </div>
            <Link to="/exams" className="shrink-0">
              <button className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#111B3C] dark:text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-sm transition-all">
                <span>View All 20 Exams</span>
                <ChevronRight className="w-4 h-4 text-[#5146CD]" />
              </button>
            </Link>
          </div>

          {/* 3-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companyTracks.map((track) => (
              <div
                key={track.company}
                className="p-6 rounded-2xl bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800/90 shadow-sm hover:shadow-md hover:border-[#5146CD]/30 dark:hover:border-[#8175FF]/30 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#737B91] dark:text-slate-400">
                      {track.company}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${track.badgeStyle}`}>
                      {track.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#111B3C] dark:text-white mb-2 group-hover:text-[#5146CD] dark:group-hover:text-[#8175FF] transition-colors">
                    {track.title}
                  </h3>
                  <p className="text-xs text-[#737B91] dark:text-slate-400 leading-relaxed mb-6">
                    {track.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#737B91] dark:text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#5146CD]" />
                    {track.testCount}
                  </span>
                  <Link
                    to="/exams"
                    className="text-xs font-bold text-[#5146CD] dark:text-[#8175FF] hover:text-[#4338CA] dark:hover:text-white inline-flex items-center gap-1 group/btn"
                  >
                    <span>{track.isSpecial ? 'Explore Japanese' : 'Start Mock'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. End-to-End Placement Architecture */}
      <section
        id="placement-architecture"
        className="py-16 lg:py-20 bg-[#F7F8FC] dark:bg-[#0B0F19] border-t border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/80 dark:bg-slate-800 text-[#111B3C] dark:text-slate-200 text-xs font-bold mb-3">
              <Compass className="w-3.5 h-3.5 text-[#5146CD]" />
              <span>Full Preparation Lifecycle</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#111B3C] dark:text-white">
              End-to-End Placement Architecture
            </h2>
            <p className="text-[#737B91] dark:text-slate-400 text-sm mt-2 leading-relaxed">
              Everything required to progress from fundamental formulas to dream product company offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Architecture Card 1: Assessment */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF] flex items-center justify-center mb-4">
                  <Timer className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146CD] dark:text-[#8175FF] block mb-1.5">
                  Assessment System
                </span>
                <h3 className="text-lg font-bold text-[#111B3C] dark:text-white mb-2.5">
                  20 Timed Aptitude Exams
                </h3>
                <p className="text-xs text-[#737B91] dark:text-slate-400 leading-relaxed mb-5">
                  Quantitative (Speed-Time, Percentages, Probability), Logical (Seating, Syllogisms), Verbal Grammar, and Technical CS MCQs with realistic negative marking.
                </p>
                <ul className="text-xs space-y-2.5 text-[#737B91] dark:text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Countdown timer & auto-submit</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Question palette & review flags</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Peer percentile benchmarks</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/exams"
                className="pt-4 border-t border-slate-100 dark:border-slate-800 inline-flex items-center justify-between text-xs font-bold text-[#5146CD] dark:text-[#8175FF] hover:underline"
              >
                <span>Launch Aptitude Exams</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Architecture Card 2: Recruitment Board */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#159B75]/10 text-[#159B75] flex items-center justify-center mb-4">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#159B75] block mb-1.5">
                  Recruitment Board
                </span>
                <h3 className="text-lg font-bold text-[#111B3C] dark:text-white mb-2.5">
                  Verified Career Opportunities
                </h3>
                <p className="text-xs text-[#737B91] dark:text-slate-400 leading-relaxed mb-5">
                  Curated drives from Google, Microsoft, Atlassian, and TCS Digital authenticated by university faculty with direct application tracking and link health monitors.
                </p>
                <ul className="text-xs space-y-2.5 text-[#737B91] dark:text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>"Verified" provenance badge</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Role & batch eligibility filters</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Deadlines & application tracker</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/jobs"
                className="pt-4 border-t border-slate-100 dark:border-slate-800 inline-flex items-center justify-between text-xs font-bold text-[#159B75] hover:underline"
              >
                <span>Explore Verified Drives</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Architecture Card 3: Intelligent Mentorship */}
            <div className="p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF] flex items-center justify-center mb-4">
                  <Brain className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146CD] dark:text-[#8175FF] block mb-1.5">
                  Intelligent Mentorship
                </span>
                <h3 className="text-lg font-bold text-[#111B3C] dark:text-white mb-2.5">
                  AI Placement Mentor (RAG)
                </h3>
                <p className="text-xs text-[#737B91] dark:text-slate-400 leading-relaxed mb-5">
                  Trained and strictly scoped to campus recruitment. Provides step-by-step mathematical derivations, STAR behavioral coaching, and links directly to portal tests.
                </p>
                <ul className="text-xs space-y-2.5 text-[#737B91] dark:text-slate-400 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>"Explain this question" post-exam review</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Strict placement-only guardrails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#159B75] shrink-0" />
                    <span>Streaming token typewriter response</span>
                  </li>
                </ul>
              </div>

              <Link
                to="/chat"
                className="pt-4 border-t border-slate-100 dark:border-slate-800 inline-flex items-center justify-between text-xs font-bold text-[#5146CD] dark:text-[#8175FF] hover:underline"
              >
                <span>Consult AI Mentor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Institutional Profile & Campus Overview (Anchor #about) */}
      <section
        id="about"
        className="py-16 lg:py-20 bg-white dark:bg-[#0E1526] border-t border-slate-200/80 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF] text-xs font-semibold mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>About Sahyadri Placement Cell</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#111B3C] dark:text-white leading-tight">
                An Ecosystem Designed to Elevate Engineering Careers
              </h2>
              <p className="mt-4 text-sm text-[#737B91] dark:text-slate-300 leading-relaxed">
                Located on the tranquil banks of the Netravati River in Adyar, Mangalore, Sahyadri College of Engineering & Management is an Autonomous institution accredited with an 'A' grade by NAAC. The Department of Placement and Career Development serves as the bridge between technical academia and global enterprise hiring.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xl font-display font-bold text-[#111B3C] dark:text-white block">
                    250+ Recruiters
                  </span>
                  <span className="text-xs text-[#737B91] dark:text-slate-400 mt-1 block">
                    Global IT, product engineering & core firms
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xl font-display font-bold text-[#159B75] block">
                    93.8% Success
                  </span>
                  <span className="text-xs text-[#737B91] dark:text-slate-400 mt-1 block">
                    Average eligible cohort placement rate
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="p-5 rounded-2xl bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#5146CD]/10 text-[#5146CD] dark:bg-[#8175FF]/20 dark:text-[#8175FF] flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111B3C] dark:text-white">
                    Faculty-Authenticated Curriculum
                  </h4>
                  <p className="text-xs text-[#737B91] dark:text-slate-400 mt-1 leading-relaxed">
                    Test questions and study materials are reviewed directly by department coordinators to mirror updated company evaluation blueprints.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#159B75]/10 text-[#159B75] flex items-center justify-center shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111B3C] dark:text-white">
                    Simulated Negative Marking Environment
                  </h4>
                  <p className="text-xs text-[#737B91] dark:text-slate-400 mt-1 leading-relaxed">
                    Timed sectionals, negative scoring flags (-0.25), and percentile breakdowns teach accurate pacing under real recruitment constraints.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F7F8FC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#111B3C]/10 dark:bg-white/10 text-[#111B3C] dark:text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#111B3C] dark:text-white">
                    AI-Driven Targeted Remediation
                  </h4>
                  <p className="text-xs text-[#737B91] dark:text-slate-400 mt-1 leading-relaxed">
                    Instant step-by-step breakdowns for missed quantitative and reasoning questions help students overcome specific concept blind spots.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Placement Success Stories */}
      <section className="py-16 lg:py-20 bg-[#F7F8FC] dark:bg-[#0B0F19] border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5146CD] dark:text-[#8175FF]">
              Campus Placement Success Stories
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-[#111B3C] dark:text-white mt-1">
              Engineered for Sahyadri Placement Offers
            </h2>
            <p className="text-[#737B91] dark:text-slate-400 text-sm mt-2">
              Hear how regular practice with company mock test series translated to day-1 dream offers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map((t) => (
              <div
                key={t.name}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#159B75]/10 text-[#159B75] border border-[#159B75]/20">
                      Verified Offer
                    </span>
                  </div>
                  <p className="text-xs text-[#20283A] dark:text-slate-300 leading-relaxed italic mb-6">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#111B3C] dark:bg-[#5146CD] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#111B3C] dark:text-white leading-tight">
                      {t.name}
                    </h4>
                    <p className="text-[11px] text-[#5146CD] dark:text-[#8175FF] font-semibold">
                      {t.role} <span className="text-[#159B75]">({t.package})</span>
                    </p>
                    <p className="text-[10px] text-[#737B91] dark:text-slate-400">
                      {t.dept}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Institutional Call-to-Action Banner */}
      <section className="py-14 bg-[#111B3C] text-white border-t border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#5146CD]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold">
            Accelerate Your Campus Placement Journey Today
          </h2>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
            Take timed mocks, study verified past patterns, and track faculty-approved jobs right here on the official Sahyadri placement portal.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/exams"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#5146CD] hover:bg-[#4338CA] text-white shadow-sm transition-all inline-flex items-center gap-1.5"
            >
              <span>Start Timed Mock Exam</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => loginDemo('student')}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
            >
              Instant Student Demo
            </button>
          </div>
        </div>
      </section>

      {/* 10. University Institutional Footer */}
      <footer className="py-12 bg-[#111B3C] text-slate-400 text-xs border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10">
            <div className="flex items-center gap-3 text-white font-bold">
              <div className="w-10 h-10 rounded-xl bg-[#5146CD] flex items-center justify-center text-white shadow-sm shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-base font-display font-extrabold text-white">
                  Edu<span className="text-[#8175FF]">Connect</span>
                </span>
                <p className="text-[11px] text-slate-400 font-normal">
                  Sahyadri College of Engineering & Management • Placement Cell
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 font-medium">
              <Link to="/exams" className="hover:text-white transition-colors">Aptitude Exams</Link>
              <Link to="/jobs" className="hover:text-white transition-colors">Verified Drives</Link>
              <Link to="/materials" className="hover:text-white transition-colors">Study Hub</Link>
              <Link to="/newsletter" className="hover:text-white transition-colors">Placement Digest</Link>
              <Link to="/chat" className="hover:text-white transition-colors">AI Mentor</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
            <p>© 2026 Sahyadri College of Engineering & Management • Autonomous • NAAC 'A' Grade • Affiliated to VTU. All rights reserved.</p>
            <p className="flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>Adyar, Mangalore, Karnataka 575007</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
