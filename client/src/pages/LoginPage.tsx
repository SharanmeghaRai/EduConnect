import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Mail,
  Lock,
  User as UserIcon,
  Building2,
  FileBadge,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { Card } from '../components/ui/Card.js';

export const LoginPage: React.FC = () => {
  const { loginDemo, loginWithEmail, registerWithEmail } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
  const [regDepartment, setRegDepartment] = useState('Computer Science & Engineering');
  const [regRollNumber, setRegRollNumber] = useState('');

  const departments = [
    'Computer Science & Engineering',
    'Information Science & Engineering',
    'Artificial Intelligence & Data Science',
    'Electronics & Communication Engineering',
    'Mechanical Engineering',
    'Robotics & Automation',
    'Department of Placement & Training',
  ];

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await loginWithEmail(loginEmail, loginPassword);
      setSuccessMsg('Login successful! Redirecting...');
      setTimeout(() => {
        navigate(user.role === 'ADMIN' || user.role === 'FACULTY' ? '/admin' : '/dashboard');
      }, 500);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await registerWithEmail({
        name: regName,
        email: regEmail,
        password: regPassword,
        role: regRole,
        department: regDepartment,
        rollNumber: regRole === 'STUDENT' ? regRollNumber : undefined,
      });

      setSuccessMsg('Account created successfully! Welcome to EduConnect.');
      setTimeout(() => {
        navigate(user.role === 'ADMIN' || user.role === 'FACULTY' ? '/admin' : '/dashboard');
      }, 600);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please verify your details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (type: 'student' | 'admin') => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginDemo(type);
      navigate(type === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setErrorMsg(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#F7F8FC] dark:bg-[#0B0F19] transition-colors">
      <div className="w-full max-w-md animate-slide-up py-8">
        {/* Institutional Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#111B3C] dark:bg-[#5146CD] text-white shadow-md mb-3 ring-1 ring-white/10 group">
            <GraduationCap className="w-7 h-7 text-[#8175FF] dark:text-white group-hover:scale-105 transition-transform" />
          </Link>
          <h2 className="text-2xl font-display font-bold text-[#111B3C] dark:text-white">
            Sahyadri Placement Portal
          </h2>
          <p className="text-xs text-[#737B91] dark:text-slate-400 mt-1">
            EduConnect Campus Career Development System
          </p>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl flex mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-[#111B3C] dark:text-white shadow-sm'
                : 'text-[#737B91] dark:text-slate-400 hover:text-[#111B3C] dark:hover:text-white'
            }`}
          >
            Sign In with Email
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-lg transition-all text-center ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-[#111B3C] dark:text-white shadow-sm'
                : 'text-[#737B91] dark:text-slate-400 hover:text-[#111B3C] dark:hover:text-white'
            }`}
          >
            Create New Account
          </button>
        </div>

        <Card className="p-6 sm:p-7 shadow-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[#159B75] dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'signin' ? (
            /* SIGN IN FORM */
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="student@sahyadri.edu.in or your email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign In to Portal'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* CREATE ACCOUNT FORM */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Kavya Shenoy"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="kavya.cs@sahyadri.edu.in"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create your secure password"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1">
                  I am registering as:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('STUDENT')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      regRole === 'STUDENT'
                        ? 'border-[#5146CD] bg-[#5146CD]/10 text-[#5146CD] dark:text-[#8175FF]'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Student</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegRole('FACULTY')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      regRole === 'FACULTY'
                        ? 'border-[#111B3C] bg-[#111B3C]/10 text-[#111B3C] dark:border-white dark:bg-white/10 dark:text-white'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Faculty / Admin</span>
                  </button>
                </div>
              </div>

              {/* Department */}
              <div>
                <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={regDepartment}
                    onChange={(e) => setRegDepartment(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {regRole === 'STUDENT' && (
                <div>
                  <label className="block text-xs font-semibold text-[#111B3C] dark:text-slate-300 mb-1">
                    USN / Roll Number (Optional)
                  </label>
                  <div className="relative">
                    <FileBadge className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regRollNumber}
                      onChange={(e) => setRegRollNumber(e.target.value)}
                      placeholder="e.g. 4SF22CS089"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[#20283A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#5146CD]"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#5146CD] hover:bg-[#4338CA] shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : 'Create Account & Start Exploring'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {/* Quick Demo Personas */}
          <div className="relative flex items-center justify-center pt-2">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider shrink-0">
              Instant Demo Access
            </span>
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('student')}
              disabled={loading}
              className="p-2.5 rounded-xl border border-[#5146CD]/30 bg-[#5146CD]/5 hover:bg-[#5146CD]/10 text-left transition-all group"
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[#5146CD] dark:text-[#8175FF] shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-[#111B3C] dark:text-white group-hover:text-[#5146CD]">
                    Student Demo
                  </h4>
                  <p className="text-[10px] text-slate-500">Aarav Patel (CSE)</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => handleDemo('admin')}
              disabled={loading}
              className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 hover:bg-rose-100/50 text-left transition-all group"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-rose-600 shrink-0" />
                <div>
                  <h4 className="text-[11px] font-bold text-[#111B3C] dark:text-white group-hover:text-rose-600">
                    Faculty Demo
                  </h4>
                  <p className="text-[10px] text-slate-500">Dr. Sharma (Dean)</p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* Institutional Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[11px] text-[#737B91] dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#159B75]" />
            Faculty Verified
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#159B75]" />
            Secure JWT Auth
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#159B75]" />
            Direct Drive Access
          </span>
        </div>
      </div>
    </div>
  );
};
