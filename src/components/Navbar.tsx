import React from 'react';
import { Search, Bell, Menu, X, LogOut, Database } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { ThemeToggle } from './ThemeToggle';
import type { FacultyUser } from '../types';

interface NavbarProps {
  user: FacultyUser;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onSignOut: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  isSidebarOpen,
  onToggleSidebar,
  onSignOut,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header
      role="banner"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 35,
        width: '100%',
        height: '64px',
        backgroundColor: 'var(--surface-container-lowest)',
        borderBottom: '1px solid var(--border-neutral)',
        boxShadow: '0 1px 8px rgba(0, 0, 0, 0.04)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        transition: 'background-color 200ms ease, border-color 200ms ease',
      }}
    >
      {/* Left: Drawer Trigger + Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? 'Close Navigation Drawer' : 'Open Navigation Drawer'}
          className="interactive-scale"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-container)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            transition: 'all 150ms ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-container-high)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface-container)')}
        >
          {isSidebarOpen ? <X size={19} /> : <Menu size={19} />}
        </button>

        <BrandLogo size="sm" subtitleText="FACULTY HUB • KARE" />
      </div>

      {/* Center: Quick Search Pill */}
      <div
        className="navbar-search-container"
        role="search"
        style={{
          flex: '1',
          maxWidth: '420px',
          margin: '0 20px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Search
          size={15}
          style={{
            position: 'absolute',
            left: '12px',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search curriculum modules, syllabi..."
          aria-label="Search curriculum modules and syllabi"
          style={{
            width: '100%',
            height: '36px',
            padding: '0 48px 0 34px',
            borderRadius: '12px',
            fontSize: '12.5px',
            fontFamily: 'var(--font-body)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'all 150ms ease',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = 'var(--primary)';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8px',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--text-muted)',
            backgroundColor: 'var(--surface-container)',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            padding: '1px 5px',
            pointerEvents: 'none',
          }}
        >
          ⌘K
        </div>
      </div>

      {/* Right Controls: Theme Toggle, Database Status, Notifications, Faculty Pill */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Real-time DB Status Pill (Accurately reflects un-connected state) */}
        <div
          className="navbar-status-pill"
          title="Firebase Firestore connection is pending"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 10px',
            borderRadius: '9999px',
            backgroundColor: 'var(--surface-container)',
            border: '1px solid var(--border)',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            color: 'var(--text-secondary)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '9999px',
              backgroundColor: '#f59e0b',
              boxShadow: '0 0 6px #f59e0b',
            }}
          />
          <Database size={11} />
          <span>DB: STANDBY</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <button
          type="button"
          title="Instructor Notifications"
          aria-label="Notifications (No unread messages)"
          className="interactive-scale"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '10px',
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
          }}
        >
          <Bell size={16} />
        </button>

        {/* Instructor Profile Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '4px 8px 4px 5px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-container)',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              backgroundColor: '#8b5cf6',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-headline)',
              fontWeight: 800,
              fontSize: '12px',
              boxShadow: '0 0 0 2px var(--surface-container-lowest)',
            }}
          >
            {user.name.charAt(0)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }} className="navbar-user-text">
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-headline)',
              }}
            >
              {user.name}
            </span>
            <span
              style={{
                fontSize: '10px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
              }}
            >
              {user.role}
            </span>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            title="Sign out of Faculty Portal"
            aria-label="Sign out"
            className="interactive-scale"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              marginLeft: '4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .navbar-search-container {
            display: none !important;
          }
          .navbar-status-pill {
            display: none !important;
          }
          .navbar-user-text {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
