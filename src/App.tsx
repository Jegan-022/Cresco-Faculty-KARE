import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { FacultyLogin } from './views/FacultyLogin';
import { FacultyDashboardShell } from './views/FacultyDashboardShell';
import { FacultyModuleViews } from './views/FacultyModuleViews';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { FacultyUser } from './types';
import { LayoutDashboard, LogIn } from 'lucide-react';

// Default staging session user for seamless deep-linking & direct route refreshes
const DEFAULT_FACULTY_USER: FacultyUser = {
  id: 'FAC-COORD-4200',
  name: 'Course Coordinator',
  email: 'coordinator.cs4200@klu.ac.in',
  department: 'Computer Science & Engineering',
  designation: 'Professor & Chair',
  institution: 'Kalasalingam Academy of Research and Education',
  role: 'Course Coordinator',
  staffId: 'FAC-COORD-4200',
};

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

      {/* 3. Main Views */}
      <main style={{ flex: 1, paddingTop: '16px' }} role="main">
        {children}
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
  const navigate = useNavigate();

  // Restore session from localStorage or use default staging session
  const [currentUser, setCurrentUser] = useState<FacultyUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cresco_faculty_session');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Fall through
        }
      }
      // If directly refreshing a dashboard route, maintain coordinator session
      if (['/dashboard', '/students', '/courses', '/learning-levels', '/analytics', '/settings'].includes(window.location.pathname)) {
        return DEFAULT_FACULTY_USER;
      }
    }
    return null;
  });

  // Save session state to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('cresco_faculty_session', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  const handleLoginSuccess = (user: FacultyUser) => {
    setCurrentUser(user);
    localStorage.setItem('cresco_faculty_session', JSON.stringify(user));
    navigate('/dashboard');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('cresco_faculty_session');
    navigate('/login');
  };

  const activeUser = currentUser || DEFAULT_FACULTY_USER;

  return (
    <Routes>
      {/* Route: / -> redirects to /dashboard if logged in, else /login */}
      <Route
        path="/"
        element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
      />

      {/* Route: /login */}
      <Route
        path="/login"
        element={
          <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
            <FacultyLogin
              onLoginSuccess={handleLoginSuccess}
              onExploreStudentPortal={() => window.open('https://cresco-cn-kare.vercel.app/', '_blank')}
            />

            {/* Quick Reviewer Toolbar: Allows rapid direct opening of Dashboard */}
            <aside
              style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(15, 23, 42, 0.92)',
                border: '1px solid rgba(56, 189, 248, 0.35)',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: '#38bdf8',
                  fontWeight: 700,
                }}
              >
                FACULTY PREVIEW:
              </span>
              <button
                type="button"
                onClick={() => handleLoginSuccess(DEFAULT_FACULTY_USER)}
                className="interactive-scale"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#059669',
                  border: 'none',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 2px 0 0 #047857',
                }}
              >
                <LayoutDashboard size={12} />
                <span>Open Dashboard Shell</span>
              </button>
            </aside>
          </div>
        }
      />

      {/* Route: /dashboard */}
      <Route
        path="/dashboard"
        element={
          <ShellLayout currentUser={activeUser} onSignOut={handleSignOut}>
            <FacultyDashboardShell
              user={activeUser}
              activeView="Dashboard"
              onSwitchToLogin={() => navigate('/login')}
            />
          </ShellLayout>
        }
      />

      {/* Route: /students */}
      <Route
        path="/students"
        element={
          <ShellLayout currentUser={activeUser} onSignOut={handleSignOut}>
            <FacultyModuleViews
              activeView="Students"
              user={activeUser}
              onNavigate={(v) => {
                if (v === 'Dashboard') navigate('/dashboard');
                else if (v === 'Courses') navigate('/courses');
                else if (v === 'Learning Levels') navigate('/learning-levels');
                else if (v === 'Analytics') navigate('/analytics');
                else if (v === 'Settings') navigate('/settings');
              }}
            />
          </ShellLayout>
        }
      />

      {/* Route: /courses */}
      <Route
        path="/courses"
        element={
          <ShellLayout currentUser={activeUser} onSignOut={handleSignOut}>
            <FacultyModuleViews
              activeView="Courses"
              user={activeUser}
              onNavigate={(v) => {
                if (v === 'Dashboard') navigate('/dashboard');
                else if (v === 'Students') navigate('/students');
                else if (v === 'Learning Levels') navigate('/learning-levels');
                else if (v === 'Analytics') navigate('/analytics');
                else if (v === 'Settings') navigate('/settings');
              }}
            />
          </ShellLayout>
        }
      />

      {/* Route: /learning-levels */}
      <Route
        path="/learning-levels"
        element={
          <ShellLayout currentUser={activeUser} onSignOut={handleSignOut}>
            <FacultyModuleViews
              activeView="Learning Levels"
              user={activeUser}
              onNavigate={(v) => {
                if (v === 'Dashboard') navigate('/dashboard');
                else if (v === 'Students') navigate('/students');
                else if (v === 'Courses') navigate('/courses');
                else if (v === 'Analytics') navigate('/analytics');
                else if (v === 'Settings') navigate('/settings');
              }}
            />
          </ShellLayout>
        }
      />

      {/* Route: /analytics */}
      <Route
        path="/analytics"
        element={
          <ShellLayout currentUser={activeUser} onSignOut={handleSignOut}>
            <FacultyModuleViews
              activeView="Analytics"
              user={activeUser}
              onNavigate={(v) => {
                if (v === 'Dashboard') navigate('/dashboard');
                else if (v === 'Students') navigate('/students');
                else if (v === 'Courses') navigate('/courses');
                else if (v === 'Learning Levels') navigate('/learning-levels');
                else if (v === 'Settings') navigate('/settings');
              }}
            />
          </ShellLayout>
        }
      />

      {/* Route: /settings */}
      <Route
        path="/settings"
        element={
          <ShellLayout currentUser={activeUser} onSignOut={handleSignOut}>
            <FacultyModuleViews
              activeView="Settings"
              user={activeUser}
              onNavigate={(v) => {
                if (v === 'Dashboard') navigate('/dashboard');
                else if (v === 'Students') navigate('/students');
                else if (v === 'Courses') navigate('/courses');
                else if (v === 'Learning Levels') navigate('/learning-levels');
                else if (v === 'Analytics') navigate('/analytics');
              }}
            />
          </ShellLayout>
        }
      />

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
