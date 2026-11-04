import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { ExamCatalogPage } from './pages/ExamCatalogPage';
import { ExamRoomPage } from './pages/ExamRoomPage';
import { ExamResultPage } from './pages/ExamResultPage';
import { JobsPage } from './pages/JobsPage';
import { StudyMaterialsPage } from './pages/StudyMaterialsPage';
import { NewsletterPage } from './pages/NewsletterPage';
import { AiNewsletterPage } from './pages/AiNewsletterPage';
import { ChatPage } from './pages/ChatPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminStudentsPage } from './pages/AdminStudentsPage';
import { AdminExamsPage } from './pages/AdminExamsPage';
import { AdminJobsPage } from './pages/AdminJobsPage';
import { AdminMaterialsPage } from './pages/AdminMaterialsPage';
import { AdminNewslettersPage } from './pages/AdminNewslettersPage';
import { AdminAuditPage } from './pages/AdminAuditPage';
import { AdminPerformancePage } from './pages/AdminPerformancePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ExamHistoryPage } from './pages/ExamHistoryPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { PlacementCalendarPage } from './pages/PlacementCalendarPage';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { FloatingChatWidget } from './components/chat/FloatingChatWidget';

// Route Guard for authenticated users
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Route Guard for Admin/Faculty roles
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'ADMIN' && user.role !== 'FACULTY') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Chat Widget Layout Wrapper: hide on distraction-free exam room and dedicated full chat page
const AppContent: React.FC = () => {
  const location = useLocation();
  const isExamRoom = /^\/exams\/[^/]+$/.test(location.pathname);
  const isDedicatedChat = location.pathname === '/chat';
  const showFloatingChat = !isExamRoom && !isDedicatedChat;

  return (
    <>
      <OnboardingModal />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Student Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <ExamCatalogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams/:id"
          element={
            <ProtectedRoute>
              <ExamRoomPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams/attempts/:id/review"
          element={
            <ProtectedRoute>
              <ExamResultPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <JobsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/materials"
          element={
            <ProtectedRoute>
              <StudyMaterialsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/newsletter"
          element={
            <ProtectedRoute>
              <NewsletterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-newsletter"
          element={
            <ProtectedRoute>
              <AiNewsletterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={<ChatPage />}
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam-history"
          element={
            <ProtectedRoute>
              <ExamHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <PlacementCalendarPage />
            </ProtectedRoute>
          }
        />

        {/* Admin & Faculty Protected Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/performance"
          element={
            <AdminRoute>
              <AdminPerformancePage />
            </AdminRoute>
          }
        />
        <Route
          path="/faculty/marks"
          element={
            <AdminRoute>
              <AdminPerformancePage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/students"
          element={
            <AdminRoute>
              <AdminStudentsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/exams"
          element={
            <AdminRoute>
              <AdminExamsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <AdminRoute>
              <AdminJobsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/materials"
          element={
            <AdminRoute>
              <AdminMaterialsPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/newsletters"
          element={
            <AdminRoute>
              <AdminNewslettersPage />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/audit"
          element={
            <AdminRoute>
              <AdminAuditPage />
            </AdminRoute>
          }
        />

        {/* Catch-all 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showFloatingChat && <FloatingChatWidget />}
    </>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;
