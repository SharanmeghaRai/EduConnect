import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  Users,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Mail,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await api.admin.students({ search });
      setStudents(res.students || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      setLoadingDetails(true);
      const res = await api.admin.studentDetails(id);
      setSelectedStudent(res.student);
    } catch (err) {
      console.error('Failed to load student details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.admin.toggleStudentStatus(id, !currentStatus);
      setStudents((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus } : s))
      );
      if (selectedStudent && selectedStudent.id === id) {
        setSelectedStudent({ ...selectedStudent, isActive: !currentStatus });
      }
    } catch (err) {
      console.error('Failed to toggle student status:', err);
    }
  };

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      const csvData = await api.admin.exportCSV();
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `EduConnect_Student_Cohort_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
        <Sidebar role="ADMIN" />

        <main className="flex-1 min-w-0 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Student Cohort Directory
                </h1>
                <Badge variant="neutral">{total} Enrolled</Badge>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Monitor individual student readiness, mock exam records, and academic profiles.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/admin/performance">
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-soft-sm"
                  leftIcon={<Award className="w-4 h-4 text-white" />}
                >
                  Marks & Performance
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                isLoading={exporting}
                leftIcon={<Download className="w-4 h-4" />}
              >
                Export Cohort CSV
              </Button>
            </div>
          </div>

          {/* Search bar */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student by name, email, or USN / Roll number..."
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Students Table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-4 py-3">Student Name</th>
                    <th className="px-4 py-3">Roll / USN</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">CGPA</th>
                    <th className="px-4 py-3">Exams Taken</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600"></div>
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center shrink-0 text-xs">
                              {student.name?.charAt(0) || 'S'}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">{student.name}</p>
                              <p className="text-[11px] text-slate-400">{student.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600 dark:text-slate-400">
                          {student.studentProfile?.rollNumber || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                          {student.studentProfile?.department || 'Unassigned'}
                        </td>
                        <td className="px-4 py-3 font-semibold text-emerald-600 dark:text-emerald-400">
                          {student.studentProfile?.cgpa ? `${student.studentProfile.cgpa} / 10` : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {student._count?.attempts ?? student.attempts?.length ?? 0} attempts
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                              student.isActive
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300'
                            }`}
                          >
                            {student.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(student.id)}
                              leftIcon={<Eye className="w-3.5 h-3.5" />}
                            >
                              Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(student.id, student.isActive)}
                              className={student.isActive ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}
                            >
                              {student.isActive ? 'Suspend' : 'Activate'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400">
                        No students matching the query found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Student Details Modal */}
          {selectedStudent && (
            <Modal
              isOpen={Boolean(selectedStudent)}
              onClose={() => setSelectedStudent(null)}
              title="Student Performance Profile"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-brand-600 text-white font-bold text-lg flex items-center justify-center">
                    {selectedStudent.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedStudent.email}</p>
                    <span className="text-[11px] text-brand-600 font-mono">
                      USN: {selectedStudent.studentProfile?.rollNumber || 'Not set'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-slate-400">Department</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      {selectedStudent.studentProfile?.department || 'Not set'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-slate-400">Graduation Year</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5">
                      {selectedStudent.studentProfile?.graduationYear || 'Not set'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-slate-400">Current CGPA</p>
                    <p className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {selectedStudent.studentProfile?.cgpa ? `${selectedStudent.studentProfile.cgpa} / 10` : 'Not set'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                    <p className="text-slate-400">Target Roles</p>
                    <p className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                      {selectedStudent.studentProfile?.targetRoles || 'None specified'}
                    </p>
                  </div>
                </div>

                {selectedStudent.studentProfile?.resumeUrl && (
                  <a
                    href={selectedStudent.studentProfile.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" /> View Uploaded Candidate Resume
                  </a>
                )}

                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-2">
                    Recent Mock Exam Attempts ({selectedStudent.attempts?.length || 0})
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                    {selectedStudent.attempts?.length > 0 ? (
                      selectedStudent.attempts.map((att: any) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 text-xs"
                        >
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">{att.exam?.title}</p>
                            <p className="text-[11px] text-slate-400">
                              {new Date(att.submittedAt || att.startedAt).toLocaleDateString()} • {att.status}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-slate-900 dark:text-white">
                              {att.score?.toFixed(1)} pts
                            </span>
                            <p className="text-[10px] text-emerald-600">
                              {att.accuracyPercentage ? `${Math.round(att.accuracyPercentage)}% acc` : ''}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 py-3 text-center">No exams taken yet.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    to={`/admin/performance?search=${encodeURIComponent(
                      selectedStudent.studentProfile?.rollNumber || selectedStudent.name
                    )}`}
                  >
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white"
                      leftIcon={<Award className="w-3.5 h-3.5" />}
                    >
                      Inspect Test Marks
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={() => setSelectedStudent(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </Modal>
          )}
        </main>
      </div>
    </div>
  );
};
