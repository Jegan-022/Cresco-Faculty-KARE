import React, { useState } from 'react';
import { FacultyLogin } from './views/FacultyLogin';
import { FacultyDashboardShell } from './views/FacultyDashboardShell';
import { FacultyModuleViews } from './views/FacultyModuleViews';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { FacultyUser, FacultyViewType } from './types';
import { LayoutDashboard, LogIn } from 'lucide-react';

export const App: React.FC = () => {
  // Initial state is Faculty Login as requested
  const [currentUser, setCurrentUser] = useState<FacultyUser | null>(null);
  const [activeView, setActiveView] = useState<FacultyViewType>('Dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLoginSuccess = (user: FacultyUser) => {
    setCurrentUser(user);
    setActiveView('Dashboard');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
  };

  // If not authenticated, render the iconic Faculty Login view
  if (!currentUser) {
    return (
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%' }}>
        <FacultyLogin
          onLoginSuccess={handleLoginSuccess}
          onExploreStudentPortal={() => window.open('https://cresco-cn-kare.vercel.app/', '_blank')}
        />

        {/* Quick Reviewer Toolbar: Allows rapid inspection of Dashboard Shell directly */}
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
            onClick={() =>
              handleLoginSuccess({
                id: 'KARE-FAC-0142',
                name: 'Dr. K. Ramesh',
                email: 'dr.ramesh@klu.ac.in',
                department: 'Computer Science & Engineering',
                designation: 'Professor & Coordinator',
                institution: 'Kalasalingam Academy of Research and Education',
                role: 'Course Coordinator',
                staffId: 'KARE-FAC-0142',
              })
            }
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
    );
  }

  // Once authenticated, render Faculty Dashboard Shell & Modules
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
        onSignOut={handleSignOut}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Floating Glassmorphic Drawer Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        activeView={activeView}
        onSelectView={setActiveView}
        user={currentUser}
      />

      {/* 3. Main Views */}
      <main style={{ flex: 1, paddingTop: '16px' }}>
        {activeView === 'Dashboard' ? (
          <FacultyDashboardShell
            user={currentUser}
            activeView={activeView}
            onSelectView={setActiveView}
            onSwitchToLogin={handleSignOut}
          />
        ) : (
          <FacultyModuleViews
            activeView={activeView}
            user={currentUser}
            onNavigate={setActiveView}
          />
        )}
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
          onClick={handleSignOut}
          title="Return to Faculty Login"
          className="btn-tactile-sky"
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

export default App;
