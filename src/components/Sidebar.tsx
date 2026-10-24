import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Layers,
  BarChart3,
  Settings,
  X,
  ExternalLink,
  Activity,
  ClipboardCheck,
  Radio,
  ShieldCheck,
} from 'lucide-react';
import type { FacultyViewType, FacultyUser } from '../types';
import { BrandLogo } from './BrandLogo';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  user: FacultyUser;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation items with routes
  const navItems: {
    index: string;
    label: FacultyViewType;
    path: string;
    icon: React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>;
    badge?: string;
  }[] = [
    { index: '01', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { index: '02', label: 'Students', path: '/students', icon: Users },
    { index: '03', label: 'Courses', path: '/courses', icon: BookOpen, badge: 'CS-4200' },
    { index: '04', label: 'Learning Levels', path: '/learning-levels', icon: Layers },
    { index: '05', label: 'Assessment Review', path: '/assessment-review', icon: ClipboardCheck, badge: '2 Pending' },
    { index: '06', label: 'Live Classroom', path: '/live-classroom', icon: Radio },
    { index: '07', label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { index: '08', label: 'UDL Studio', path: '/udl', icon: Activity, badge: 'Live Rubric' },
    { index: '09', label: 'Settings', path: '/settings', icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          backgroundColor: 'rgba(6, 16, 12, 0.45)',
          backdropFilter: 'blur(3px)',
          WebkitBackdropFilter: 'blur(3px)',
          animation: 'fadeIn 200ms ease-out',
        }}
        aria-hidden="true"
      />

      {/* Floating Glassmorphic Drawer Body (Rounded-3xl, 24px radius) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Faculty Navigation Drawer"
        style={{
          position: 'fixed',
          top: '12px',
          bottom: '12px',
          left: '14px',
          zIndex: 60,
          width: '320px',
          maxWidth: 'calc(100vw - 28px)',
          borderRadius: '24px',
          backgroundColor: 'var(--surface-container-lowest)',
          border: '1px solid var(--border)',
          boxShadow: '0 25px 65px -10px rgba(6, 36, 25, 0.28)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 18px',
          overflowY: 'auto',
          animation: 'scaleUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Top: Header & Brand Lockup */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              paddingBottom: '14px',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <BrandLogo size="sm" subtitleText="FACULTY DRAWER" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Navigation Drawer"
              className="interactive-scale"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav aria-label="Main menu" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
              const IconComp = item.icon;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => {
                    navigate(item.path);
                    onClose();
                  }}
                  className="interactive-scale"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '16px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 160ms ease',
                    textAlign: 'left',
                    backgroundColor: isActive
                      ? 'rgba(16, 185, 129, 0.15)'
                      : 'transparent',
                    borderLeft: isActive
                      ? '3px solid var(--primary)'
                      : '3px solid transparent',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--surface-container)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        width: '18px',
                      }}
                    >
                      {item.index}
                    </span>
                    <IconComp
                      size={18}
                      strokeWidth={isActive ? 2.5 : 2}
                      style={{
                        color: isActive ? 'var(--primary)' : 'currentColor',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '13.5px',
                        fontWeight: isActive ? 700 : 500,
                        fontFamily: 'var(--font-headline)',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  {item.badge && (
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 7px',
                        borderRadius: '9999px',
                        backgroundColor: isActive
                          ? 'rgba(16, 185, 129, 0.25)'
                          : 'var(--surface-container)',
                        color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Student Portal Ecosystem Bridge */}
          <div
            style={{
              marginTop: '28px',
              padding: '14px',
              borderRadius: '16px',
              backgroundColor: 'var(--surface-container-low)',
              border: '1px solid var(--border)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '6px',
              }}
            >
              <span
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 800,
                  color: 'var(--accent)',
                  textTransform: 'uppercase',
                }}
              >
                Ecosystem Bridge
              </span>
              <Activity size={12} style={{ color: 'var(--accent)' }} />
            </div>
            <p
              style={{
                fontSize: '11.5px',
                color: 'var(--text-secondary)',
                marginBottom: '10px',
              }}
            >
              Open student perspective to test quizzes and network packet simulator.
            </p>
            <a
              href="https://cresco-cn-kare.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-scale"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11.5px',
                fontFamily: 'var(--font-headline)',
                fontWeight: 700,
                color: 'var(--primary)',
                textDecoration: 'none',
              }}
            >
              <span>Launch Student Portal</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </div>

        {/* Bottom: Faculty Node Status */}
        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
            }}
          >
            <ShieldCheck size={13} style={{ color: 'var(--primary)' }} />
            <span>KARE CAMPUS CLUSTER 01</span>
          </div>
          <div
            style={{
              fontSize: '10px',
              color: 'var(--text-muted)',
            }}
          >
            Faculty Console: {user.name} ({user.staffId})
          </div>
        </div>
      </aside>
    </>
  );
};
