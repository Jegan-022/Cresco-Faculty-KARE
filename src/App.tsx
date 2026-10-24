import React, { useState, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FacultyAuthProvider, useFacultyAuth, FacultyProtectedRoute, FacultyLoadingView } from './context/FacultyAuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FacultyIntroOverlay } from './components/FacultyIntroOverlay';
import type { FacultyUser, FacultyViewType } from './types';
import { LogIn } from 'lucide-react';

// Lazy-Loaded Views for optimized initial bundle footprint & instantaneous load
const FacultyLogin = React.lazy(() => import('./views/FacultyLogin').then(m => ({ default: m.FacultyLogin })));
const FacultyDashboardShell = React.lazy(() => import('./views/FacultyDashboardShell').then(m => ({ default: m.FacultyDashboardShell })));
const FacultyModuleViews = React.lazy(() => import('./views/FacultyModuleViews').then(m => ({ default: m.FacultyModuleViews })));
const TermsView = React.lazy(() => import('./views/TermsView').then(m => ({ default: m.TermsView })));
const PrivacyView = React.lazy(() => import('./views/PrivacyView').then(m => ({ default: m.PrivacyView })));

// Main Layout Shell for authenticated and deep-linked routes
interface ShellLayoutProps {
  currentUser: FacultyUser;
  onSignOut: () => void;
  children: React.ReactNode;
}

const ShellLayout: React.FC<ShellLayoutProps> = ({ currentUser, onSignOut, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background)',
        color: 'var(--text-primary)',
      }}
    >
      {/* 1. App Header / Top Navigation Bar */}
      <Navbar
        user={currentUser}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onSignOut={onSignOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Floating Glassmorphic Drawer Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={currentUser}
      />

      {/* 3. Main Views wrapped in ErrorBoundary */}
      <main style={{ flex: 1, paddingTop: '16px' }} role="main">
        <ErrorBoundary fallbackTitle="Faculty Workspace Exception">
          <Suspense fallback={<FacultyLoadingView />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Quick Return to Login Dock button */}
      <div
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 40,
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/login')}
          title="Return to Faculty Login"
          className="btn-tactile-sky interactive-scale"
          style={{
            fontSize: '12px',
            padding: '8px 14px',
            borderRadius: '9999px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <LogIn size={13} />
          <span>Faculty Login View</span>
        </button>
      </div>
    </div>
  );
};

// Internal router component with session handling
const AppRoutes: React.FC = () => {
  const { user, authInfo, signOut } = useFacultyAuth();
  const navigate = useNavigate();

  const handleNavigate = (v: FacultyViewType) => {
    switch (v) {
      case 'Dashboard': navigate('/dashboard'); break;
      case 'Students': navigate('/students'); break;
      case 'Courses': navigate('/courses'); break;
      case 'Learning Levels': navigate('/learning-levels'); break;
      case 'Assessment Review': navigate('/assessment-review'); break;
      case 'Live Classroom': navigate('/live-classroom'); break;
      case 'Analytics': navigate('/analytics'); break;
      case 'UDL Studio': navigate('/udl'); break;
      case 'Settings': navigate('/settings'); break;
    }
  };

  const activeUser = user || {
    id: 'FAC-STANDBY',
    name: 'Faculty Instructor',
    email: 'faculty@klu.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Faculty Member',
    institution: 'KARE',
    role: 'Course Coordinator',
    staffId: 'FAC-STANDBY'
  };

  return (
    <Routes>
      {/* Route: / -> redirects to /dashboard if logged in, else /login */}
      <Route
        path="/"
        element={user && authInfo?.isAuthorized ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      {/* Route: /login */}
      <Route
        path="/login"
        element={
          user && authInfo?.isAuthorized ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
              <Suspense fallback={<FacultyLoadingView />}>
                <FacultyLogin
                  onLoginSuccess={() => navigate('/dashboard')}
                  onExploreStudentPortal={() => window.open('https://cresco-cn-kare.vercel.app/', '_blank')}
                />
              </Suspense>
            </div>
          )
        }
      />

      {/* Route: /dashboard */}
      <Route
        path="/dashboard"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyDashboardShell
                user={activeUser}
                activeView="Dashboard"
                onSelectView={handleNavigate}
                onSwitchToLogin={() => navigate('/login')}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /students */}
      <Route
        path="/students"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Students"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /courses */}
      <Route
        path="/courses"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Courses"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /learning-levels */}
      <Route
        path="/learning-levels"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Learning Levels"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /assessment-review */}
      <Route
        path="/assessment-review"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Assessment Review"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /live-classroom */}
      <Route
        path="/live-classroom"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Live Classroom"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /analytics */}
      <Route
        path="/analytics"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Analytics"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /settings */}
      <Route
        path="/settings"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="Settings"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /udl (UDL Studio & Rubrics) */}
      <Route
        path="/udl"
        element={
          <FacultyProtectedRoute>
            <ShellLayout currentUser={activeUser} onSignOut={signOut}>
              <FacultyModuleViews
                activeView="UDL Studio"
                user={activeUser}
                onNavigate={handleNavigate}
              />
            </ShellLayout>
          </FacultyProtectedRoute>
        }
      />

      {/* Route: /admin (Redirect to dashboard - Faculty only sees Faculty portal) */}
      <Route
        path="/admin"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Route: /terms (Institutional Terms & Conditions) */}
      <Route
        path="/terms"
        element={
          <Suspense fallback={<FacultyLoadingView />}>
            <TermsView />
          </Suspense>
        }
      />

      {/* Route: /privacy (Student Data Privacy Policy) */}
      <Route
        path="/privacy"
        element={
          <Suspense fallback={<FacultyLoadingView />}>
            <PrivacyView />
          </Suspense>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  // Show intro loading screen each time the website is opened or refreshed
  const [introActive, setIntroActive] = useState(true);

  const handleIntroComplete = () => {
    try {
      sessionStorage.setItem('cresco_faculty_intro_seen', 'true');
    } catch {}
    setIntroActive(false);
  };

  return (
    <>
      {introActive && (
        <FacultyIntroOverlay onComplete={handleIntroComplete} />
      )}
      <BrowserRouter>
        <FacultyAuthProvider>
          <ErrorBoundary fallbackTitle="Faculty Portal Runtime Exception">
            <AppRoutes />
          </ErrorBoundary>
        </FacultyAuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
