import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.js';
import { api } from '../services/api.js';
import { Navbar } from '../components/layout/Navbar.js';
import { Sidebar } from '../components/layout/Sidebar.js';
import { Card } from '../components/ui/Card.js';
import { Button } from '../components/ui/Button.js';
import { Input } from '../components/ui/Input.js';
import { Badge } from '../components/ui/Badge.js';
import { Modal } from '../components/ui/Modal.js';
import {
  User,
  Mail,
  Save,
  CheckCircle2,
  AlertCircle,
  Flame,
  Briefcase,
  Link as LinkIcon,
  Award,
  Target,
  Plus,
  X,
  Code,
  ShieldCheck,
  FileText,
  Radio,
  Calendar,
  Building2,
  ExternalLink,
  UploadCloud,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const isFaculty = user?.role === 'FACULTY' || user?.role === 'ADMIN';

  const [formData, setFormData] = useState({
    name: user?.name || '',
    rollNumber: user?.studentProfile?.rollNumber || '',
    department: user?.studentProfile?.department || '',
    graduationYear: user?.studentProfile?.graduationYear || new Date().getFullYear(),
    cgpa: user?.studentProfile?.cgpa ? String(user?.studentProfile?.cgpa) : '',
    targetRoles: user?.studentProfile?.targetRoles || '',
    resumeUrl: user?.studentProfile?.resumeUrl || '',
    preferredCompanies: user?.studentProfile?.preferredCompanies || '',
  });

  const [skillsList, setSkillsList] = useState<string[]>(() => {
    try {
      const raw = user?.studentProfile?.skills;
      if (!raw) return isFaculty ? ['DSA Mentoring', 'Quantitative Aptitude', 'System Design'] : ['Python', 'SQL', 'DSA'];
      return Array.isArray(JSON.parse(raw))
        ? JSON.parse(raw)
        : isFaculty
        ? ['DSA Mentoring', 'Quantitative Aptitude', 'System Design']
        : ['Python', 'SQL', 'DSA'];
    } catch {
      return ['Python', 'SQL', 'DSA'];
    }
  });

  const [newSkillInput, setNewSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Modals for Faculty Quick Actions
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // New Material Attachment State
  const [materialData, setMaterialData] = useState({
    title: '',
    category: 'APTITUDE',
    subCategory: 'QUANT',
    contentType: 'PDF',
    resourceUrl: '/reference-materials/TCS_Test_1.pdf',
    description: '',
    tags: 'placement prep, faculty-verified',
  });

  // Live Session / Broadcast State
  const [sessionData, setSessionData] = useState({
    title: 'TCS Digital Technical Interview & Mock Coding Masterclass',
    message: 'Mandatory technical coaching session covering past question patterns and recursion logic.',
    sessionDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    sessionTime: '02:30 PM',
    meetingUrl: 'https://meet.google.com/edu-connect-sahyadri',
    type: 'SESSION',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        rollNumber: user.studentProfile?.rollNumber || '',
        department: user.studentProfile?.department || '',
        graduationYear: user.studentProfile?.graduationYear || new Date().getFullYear(),
        cgpa: user.studentProfile?.cgpa ? String(user.studentProfile?.cgpa) : '',
        targetRoles: user.studentProfile?.targetRoles || '',
        resumeUrl: user.studentProfile?.resumeUrl || '',
        preferredCompanies: user.studentProfile?.preferredCompanies || '',
      });

      try {
        const raw = user.studentProfile?.skills;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) setSkillsList(parsed);
        }
      } catch {}
    }
  }, [user]);

  // Compute placement readiness score (0-100) for students
  const computeReadinessScore = () => {
    let score = 0;
    if (formData.name && formData.rollNumber) score += 20;
    if (formData.department && formData.graduationYear) score += 15;
    if (formData.cgpa) score += 15;
    if (formData.targetRoles) score += 15;
    if (formData.resumeUrl) score += 15;
    if (skillsList.length >= 3) score += 10;
    if (formData.preferredCompanies) score += 10;
    return Math.min(100, score);
  };

  const readinessScore = computeReadinessScore();

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !skillsList.includes(trimmed)) {
      setSkillsList([...skillsList, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.students.updateProfile({
        name: formData.name,
        rollNumber: isFaculty ? undefined : formData.rollNumber || undefined,
        department: formData.department || undefined,
        graduationYear: isFaculty ? undefined : formData.graduationYear ? Number(formData.graduationYear) : undefined,
        cgpa: isFaculty ? undefined : formData.cgpa ? parseFloat(formData.cgpa) : undefined,
        targetRoles: formData.targetRoles || undefined,
        resumeUrl: formData.resumeUrl || undefined,
        preferredCompanies: formData.preferredCompanies || undefined,
        skills: JSON.stringify(skillsList),
      });

      await refreshUser();
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  // Faculty: Attach Document/PDF
  const handleAttachMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await api.admin.createMaterial({
        title: materialData.title,
        category: materialData.category,
        subCategory: materialData.subCategory,
        contentType: materialData.contentType,
        resourceUrl: materialData.resourceUrl,
        description: materialData.description,
        tags: materialData.tags,
      });

      setIsAttachModalOpen(false);
      setSuccessMsg(`Material "${materialData.title}" attached and published successfully!`);
      setTimeout(() => setSuccessMsg(''), 4000);
      setMaterialData({
        title: '',
        category: 'APTITUDE',
        subCategory: 'QUANT',
        contentType: 'PDF',
        resourceUrl: '/reference-materials/TCS_Test_1.pdf',
        description: '',
        tags: 'placement prep, faculty-verified',
      });
    } catch (err: any) {
      alert(err.message || 'Failed to attach material.');
    } finally {
      setModalLoading(false);
    }
  };

  // Faculty: Broadcast Session Update
  const handleBroadcastSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      const res = await api.admin.broadcastSession({
        title: sessionData.title,
        message: sessionData.message,
        sessionDate: sessionData.sessionDate,
        sessionTime: sessionData.sessionTime,
        meetingUrl: sessionData.meetingUrl,
        type: sessionData.type,
      });

      setIsSessionModalOpen(false);
      setSuccessMsg(`Session update broadcasted to all ${res.broadcastCount} registered students!`);
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      alert(err.message || 'Failed to broadcast session.');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar role={isFaculty ? 'ADMIN' : 'STUDENT'} />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isFaculty ? 'Faculty & Placement Coordinator Profile' : 'Student Profile & Career Goals'}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isFaculty
                  ? 'Manage your coordinator profile, attach syllabus documents & PDFs, and start live recruitment sessions.'
                  : 'Keep your academic credentials, verified skills, and company targets up-to-date for recruitment drives.'}
              </p>
            </div>

            {isFaculty ? (
              <div className="flex items-center gap-2">
                <Link to="/admin/performance">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm"
                    leftIcon={<Award className="w-4 h-4 text-white" />}
                  >
                    Check Student Test Marks
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAttachModalOpen(true)}
                  leftIcon={<UploadCloud className="w-4 h-4 text-brand-600" />}
                >
                  Attach PDF / Material
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsSessionModalOpen(true)}
                  leftIcon={<Radio className="w-4 h-4 text-emerald-600" />}
                >
                  Broadcast Session Update
                </Button>
              </div>
            ) : user?.studentProfile?.prepStreakDays ? (
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 px-3.5 py-1.5 rounded-full self-start">
                <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                  {user.studentProfile.prepStreakDays} Day Study Streak
                </span>
              </div>
            ) : null}
          </div>

          {successMsg && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm animate-fade-in">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-rose-800 dark:text-rose-300 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Avatar & Specs */}
            <div className="lg:col-span-1 space-y-5">
              <Card className="p-6 flex flex-col items-center text-center space-y-4">
                <div className="relative">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-brand-500/20 shadow-md"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-[#111B3C] text-white font-bold text-3xl flex items-center justify-center border-4 border-brand-500/20 shadow-md">
                      {user?.name?.charAt(0) || 'F'}
                    </div>
                  )}
                  <Badge
                    variant={isFaculty ? 'error' : 'primary'}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px]"
                  >
                    {user?.role}
                  </Badge>
                </div>

                <div className="pt-2">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    {user?.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {user?.email}
                  </p>
                </div>

                {isFaculty ? (
                  /* Faculty Specific Quick Actions */
                  <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-left">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                      Coordinator Quick Controls
                    </span>
                    <Link
                      to="/admin/performance"
                      className="w-full p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-between transition-colors shadow-soft-sm block"
                    >
                      <span className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        Check Student Test Marks & Analytics
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setIsAttachModalOpen(true)}
                      className="w-full p-2.5 rounded-xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/20 hover:bg-brand-50 text-brand-700 dark:text-brand-300 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <UploadCloud className="w-4 h-4 text-brand-600" />
                      <span>Attach Document / PDF</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSessionModalOpen(true)}
                      className="w-full p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 hover:bg-emerald-50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Radio className="w-4 h-4 text-emerald-600" />
                      <span>Start / Broadcast Session</span>
                    </button>
                    <Link
                      to="/admin/materials"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-between transition-colors block"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-slate-500" />
                        Manage Materials Repository
                      </span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ) : (
                  /* Student Placement Gauge */
                  <div className="w-full pt-4 border-t border-slate-200 dark:border-slate-800 text-left">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-brand-500" />
                        Placement Readiness Score
                      </span>
                      <span className="font-black text-brand-600 dark:text-brand-400">
                        {readinessScore}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-600 to-emerald-500 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${readinessScore}%` }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* Right Column: Edit Profile Form */}
            <Card className="lg:col-span-2 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                  <User className="w-4 h-4 text-brand-600" />
                  {isFaculty ? 'Faculty Coordinator Information' : 'Academic & Contact Information'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />

                  <Input
                    label="Email Address"
                    value={user?.email || ''}
                    disabled
                    helperText="Official verified university email"
                  />

                  {isFaculty ? (
                    <>
                      <Input
                        label="Designation / Role"
                        placeholder="e.g. Placement Officer / Associate Professor"
                        value={formData.targetRoles}
                        onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                        helperText="Your official departmental or cell designation"
                      />
                      <Input
                        label="Cabin / Office Location"
                        placeholder="e.g. Academic Block 3, Room 204"
                        value={formData.preferredCompanies}
                        onChange={(e) => setFormData({ ...formData, preferredCompanies: e.target.value })}
                        helperText="Where students can locate your placement desk"
                      />
                    </>
                  ) : (
                    <>
                      <Input
                        label="University Roll / USN Number"
                        placeholder="e.g. 4SF22CS089"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                      />
                      <Input
                        label="Current CGPA (Out of 10)"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        placeholder="e.g. 8.75"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                      />
                    </>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Department / Division
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    >
                      <option value="">Select department</option>
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Information Science & Engineering">Information Science & Engineering</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Robotics & Automation">Robotics & Automation</option>
                      <option value="Department of Placement & Training">Department of Placement & Training</option>
                    </select>
                  </div>

                  {isFaculty ? (
                    <Input
                      label="Faculty Profile / LinkedIn URL"
                      type="url"
                      placeholder="https://linkedin.com/in/... or faculty page"
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                      helperText="Official university profile or LinkedIn link"
                    />
                  ) : (
                    <div>
                      <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Expected Graduation Year
                      </label>
                      <select
                        className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        value={formData.graduationYear}
                        onChange={(e) => setFormData({ ...formData, graduationYear: Number(e.target.value) })}
                      >
                        {[2024, 2025, 2026, 2027, 2028].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Skills or Areas of Expertise */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code className="w-4 h-4 text-brand-600" />
                    {isFaculty ? 'Areas of Mentorship & Specialization' : 'Technical Skills & Frameworks'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isFaculty
                      ? 'Add domains you supervise (e.g. Aptitude, DSA, Cloud, Mock Interviews).'
                      : 'Add languages, databases, or frameworks you are confident interviewing on.'}
                  </p>

                  <div className="flex flex-wrap gap-2 min-h-[36px] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                    {skillsList.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-soft-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-rose-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        placeholder="Add tag..."
                        className="text-xs bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none w-28 px-1"
                      />
                      <button
                        type="button"
                        onClick={handleAddSkill}
                        className="p-1 rounded-md text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {!isFaculty && (
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
                    <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-brand-600" /> Placement Aspirations
                    </h3>
                    <Input
                      label="Target Job Roles"
                      placeholder="e.g. SDE-1, Cloud Engineer, Full Stack Developer"
                      value={formData.targetRoles}
                      onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
                    />
                    <Input
                      label="Dream Recruiter Companies"
                      placeholder="e.g. TCS Digital, Infosys, Accenture, Microsoft"
                      value={formData.preferredCompanies}
                      onChange={(e) => setFormData({ ...formData, preferredCompanies: e.target.value })}
                    />
                    <Input
                      label="Resume / Portfolio Link"
                      type="url"
                      placeholder="https://drive.google.com/file/..."
                      value={formData.resumeUrl}
                      onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    />
                  </div>
                )}

                <div className="flex justify-end pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={saving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* FACULTY DEDICATED SECTION: STUDENT TEST PERFORMANCE & MARKS QUICK PORTAL */}
          {isFaculty && (
            <Card className="p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 shadow-soft-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="brand" className="text-[10px] font-bold uppercase tracking-wider">
                      Faculty Academic Portal
                    </Badge>
                    <span className="text-xs text-slate-400 font-semibold">• Sahyadri Evaluation Matrix</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-emerald-500" />
                    Student Test Performance & Marks Ledger
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
                    Review candidate scores in real-time across Sahyadri Placement Aptitude Drives 1, 2, 3 and Basic Japanese Language tests 1, 2. Inspect question-level answers, topic weak points, and export departmental marks to CSV.
                  </p>
                </div>

                <Link to="/admin/performance" className="shrink-0">
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm flex items-center gap-2"
                  >
                    <span>Open Full Marks Ledger</span>
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {/* Highlights 3-card preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  to="/admin/performance"
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 hover:shadow-soft-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                      <Award className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Aptitude Tests</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                    Sahyadri Placement Drives
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Accenture, TCS NQT, Infosys, Wipro, and Cognizant CTS company mock scores.
                  </p>
                </Link>

                <Link
                  to="/admin/performance"
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:shadow-soft-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">Japanese JLPT</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                    Language Proficiency Marks
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Basic Hiragana/Katakana and JLPT N5 workplace particle evaluations.
                  </p>
                </Link>

                <Link
                  to="/admin/performance"
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-purple-500 hover:shadow-soft-md transition-all group block"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                      <Target className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] font-bold text-purple-600 uppercase">Export & Audit</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-purple-600 transition-colors">
                    Official Placement CSV
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Download cohort marksheet with student USNs, accuracy %, and time logs.
                  </p>
                </Link>
              </div>
            </Card>
          )}

          {/* FACULTY MODAL 1: ATTACH DOCUMENT OR PDF */}
          {isAttachModalOpen && (
            <Modal
              isOpen={isAttachModalOpen}
              onClose={() => setIsAttachModalOpen(false)}
              title="Attach Document / PDF Study Material"
            >
              <form onSubmit={handleAttachMaterial} className="space-y-4">
                <Input
                  label="Document / Material Title"
                  placeholder="e.g. TCS Digital Coding & Aptitude Handbook 2026"
                  value={materialData.title}
                  onChange={(e) => setMaterialData({ ...materialData, title: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      value={materialData.category}
                      onChange={(e) => setMaterialData({ ...materialData, category: e.target.value })}
                    >
                      <option value="APTITUDE">Aptitude Preparation</option>
                      <option value="TECHNICAL">Technical Skills (CS/Core)</option>
                      <option value="INTERVIEW_PREP">Interview Preparation & HR</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Format / Type
                    </label>
                    <select
                      className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      value={materialData.contentType}
                      onChange={(e) => setMaterialData({ ...materialData, contentType: e.target.value })}
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="DOCUMENT">Handout / Word Document</option>
                      <option value="CHEATSHEET">Formula Cheat-sheet</option>
                      <option value="ARTICLE">Technical Guide</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Document Link or Campus PDF URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="/reference-materials/TCS_Test_1.pdf or https://drive.google.com/..."
                    value={materialData.resourceUrl}
                    onChange={(e) => setMaterialData({ ...materialData, resourceUrl: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3 py-2.5 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[10px] text-slate-400">Quick Attach Campus PDFs:</span>
                    <button
                      type="button"
                      onClick={() => setMaterialData({ ...materialData, title: 'TCS Test 1 Question Paper', resourceUrl: '/reference-materials/TCS_Test_1.pdf' })}
                      className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200"
                    >
                      TCS_Test_1.pdf
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialData({ ...materialData, title: 'Accenture Test 1 Blueprint', resourceUrl: '/reference-materials/Accenture_Test_1.pdf' })}
                      className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200"
                    >
                      Accenture_Test_1.pdf
                    </button>
                    <button
                      type="button"
                      onClick={() => setMaterialData({ ...materialData, title: 'Infosys Specialist Test 3', resourceUrl: '/reference-materials/Infosys_Test_3.pdf' })}
                      className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-600 border border-brand-200"
                    >
                      Infosys_Test_3.pdf
                    </button>
                  </div>
                </div>

                <Input
                  label="Description / Syllabus Details"
                  placeholder="Summary of formulas, questions, and concepts covered..."
                  value={materialData.description}
                  onChange={(e) => setMaterialData({ ...materialData, description: e.target.value })}
                />

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsAttachModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Attach & Publish Resource
                  </Button>
                </div>
              </form>
            </Modal>
          )}

          {/* FACULTY MODAL 2: START / BROADCAST SESSION UPDATE */}
          {isSessionModalOpen && (
            <Modal
              isOpen={isSessionModalOpen}
              onClose={() => setIsSessionModalOpen(false)}
              title="Start / Broadcast Live Placement Session or Drive Update"
            >
              <form onSubmit={handleBroadcastSession} className="space-y-4">
                <Input
                  label="Session / Update Title"
                  placeholder="e.g. TCS Digital Mock Coding Masterclass & Live Q&A"
                  value={sessionData.title}
                  onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Scheduled Date"
                    type="date"
                    value={sessionData.sessionDate}
                    onChange={(e) => setSessionData({ ...sessionData, sessionDate: e.target.value })}
                    required
                  />
                  <Input
                    label="Scheduled Time"
                    placeholder="e.g. 02:30 PM IST"
                    value={sessionData.sessionTime}
                    onChange={(e) => setSessionData({ ...sessionData, sessionTime: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Virtual Meeting Link or Campus Hall"
                  placeholder="https://meet.google.com/... or Auditorium 2"
                  value={sessionData.meetingUrl}
                  onChange={(e) => setSessionData({ ...sessionData, meetingUrl: e.target.value })}
                />

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Announcement Message to Students
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide agenda, preparation requirements, and session instructions..."
                    value={sessionData.message}
                    onChange={(e) => setSessionData({ ...sessionData, message: e.target.value })}
                    className="w-full text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white p-3 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-300">
                  ⚡ Broadcasting will instantly dispatch an in-app notification to all registered students with the session details.
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                  <Button variant="ghost" size="sm" onClick={() => setIsSessionModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" size="sm" isLoading={modalLoading}>
                    Broadcast Session Update
                  </Button>
                </div>
              </form>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};
