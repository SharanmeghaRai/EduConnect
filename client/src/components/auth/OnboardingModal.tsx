import React, { useState } from 'react';
import { Modal } from '../ui/Modal.js';
import { Button } from '../ui/Button.js';
import { Input } from '../ui/Input.js';
import { useAuth } from '../../context/AuthContext.js';
import { GraduationCap, Sparkles, CheckCircle2 } from 'lucide-react';

export const OnboardingModal: React.FC = () => {
  const { isOnboardingRequired, completeOnboarding } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: '',
    department: 'Computer Science & Engineering',
    graduationYear: '2026',
    targetRoles: 'Software Development Engineer, Full Stack Developer',
    cgpa: '8.5',
  });

  if (!isOnboardingRequired) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeOnboarding(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOnboardingRequired}
      onClose={() => {}} // required step on first login
      title={
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-brand-600" />
          <span>Student Profile Setup</span>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Welcome to EduConnect! Please configure your academic credentials to unlock customized exam recommendations and verified job eligibility.
        </p>

        <Input
          label="University USN / Roll Number"
          required
          placeholder="e.g. 1MS22CS104"
          value={formData.rollNumber}
          onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Department / Specialization
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          >
            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
            <option value="Information Science & Engineering">Information Science & Engineering</option>
            <option value="Electronics & Communication">Electronics & Communication</option>
            <option value="Electrical & Electronics">Electrical & Electronics</option>
            <option value="Mechanical & Robotics">Mechanical & Robotics</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Graduation Year"
            type="number"
            required
            value={formData.graduationYear}
            onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
          />
          <Input
            label="Cumulative CGPA"
            type="number"
            step="0.01"
            required
            value={formData.cgpa}
            onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
          />
        </div>

        <Input
          label="Target Roles"
          placeholder="e.g. SDE-1, Cloud Engineer, Product Analyst"
          value={formData.targetRoles}
          onChange={(e) => setFormData({ ...formData, targetRoles: e.target.value })}
          helperText="Used by CampusPrep AI to customize interview practice questions."
        />

        <div className="pt-2">
          <Button
            type="submit"
            loading={loading}
            className="w-full font-bold text-xs py-2.5"
          >
            Complete Onboarding & Enter Dashboard
          </Button>
        </div>
      </form>
    </Modal>
  );
};
