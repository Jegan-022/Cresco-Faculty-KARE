import React, { useState } from 'react';
import {
  Users,
  Layers,
  Clock,
  PlusCircle,
  FileSpreadsheet,
  Network,
  Cpu,
  Radio,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Inbox,
  Database,
  BookOpen,
} from 'lucide-react';
import type { FacultyUser, FacultyViewType } from '../types';
import { EmptyState } from '../components/EmptyState';
import { SkeletonCard } from '../components/SkeletonLoader';

import { useNavigate } from 'react-router-dom';

interface FacultyDashboardShellProps {
  user: FacultyUser;
  activeView?: FacultyViewType;
  onSelectView?: (view: FacultyViewType) => void;
  onSwitchToLogin?: () => void;
}

export const FacultyDashboardShell: React.FC<FacultyDashboardShellProps> = ({
  user,
  activeView = 'Dashboard',
  onSelectView,
  onSwitchToLogin,
}) => {
  const navigate = useNavigate();
  const [showSkeletonPreview, setShowSkeletonPreview] = useState(false);

  const tabPaths: Record<FacultyViewType, string> = {
    Dashboard: '/dashboard',
    Students: '/students',
    Courses: '/courses',
    'Learning Levels': '/learning-levels',
    Analytics: '/analytics',
    Settings: '/settings',
  };

  const handleTabClick = (tab: FacultyViewType) => {
    if (onSelectView) onSelectView(tab);
    navigate(tabPaths[tab]);
  };

  // Production-grade metric cards adhering to strict DATA RULE (no fabricated counts)
  const metrics = [
    {
      title: 'Enrolled Students',
      value: '—',
      statusText: 'No student data synced',
      statusColor: 'var(--text-muted)',
      caption: 'Awaiting Firestore database connection',
      accentColor: '#10b981',
      shadowColor: '#bbf7d0',
      icon: Users,
    },
    {
      title: 'Cohort Average Mastery',
      value: '—',
      statusText: 'Awaiting submissions',
      statusColor: 'var(--text-muted)',
      caption: 'Calculates after packet labs are completed',
      accentColor: '#06b6d4',
      shadowColor: '#a5f3fc',
      icon: TrendingUp,
    },
    {
      title: 'Curriculum Units',
      value: '5 Defined',
      statusText: 'CS-4200 Syllabus',
      statusColor: 'var(--success)',
      caption: 'Physical, Data Link, IP, Transport, Application',
      accentColor: '#8b5cf6',
      shadowColor: '#ddd6fe',
      icon: Network,
    },
    {
      title: 'Pending Lab Reviews',
      value: '0',
      statusText: 'Inbox clear',
      statusColor: 'var(--text-muted)',
      caption: 'No submissions awaiting instructor grading',
      accentColor: '#f59e0b',
      shadowColor: '#fde68a',
      icon: Clock,
    },
  ];

  // Official CS-4200 Curriculum modules (real syllabus, empty cohort progression)
  const learningLevels = [
    { level: 'Level 1', name: 'Physical & Data Link Layer Fundamentals', status: 'Curriculum Ready', icon: Radio },
    { level: 'Level 2', name: 'IPv4 / IPv6 Addressing & Subnetting (CIDR & VLSM)', status: 'Curriculum Ready', icon: Cpu },
    { level: 'Level 3', name: 'Routing Protocols (RIP, OSPF, BGP Convergence)', status: 'Curriculum Ready', icon: Network },
    { level: 'Level 4', name: 'Transport Layer Protocols & TCP Flow Control', status: 'Curriculum Ready', icon: Layers },
    { level: 'Level 5', name: 'Application Protocols & Web Performance (HTTP/3, DNS)', status: 'Curriculum Ready', icon: BookOpen },
  ];

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px 20px 60px 20px',
      }}
    >
      {/* View Sub-Navigation Bar */}
      <nav
        aria-label="Faculty sub-navigation"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '24px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto' }}>
          {(['Dashboard', 'Students', 'Courses', 'Learning Levels', 'Analytics', 'Settings'] as FacultyViewType[]).map((tab) => {
            const isActive = activeView === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className="interactive-scale"
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  fontFamily: 'var(--font-headline)',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                  backgroundColor: isActive ? 'var(--surface-container-high)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  transition: 'all 150ms ease',
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowSkeletonPreview(!showSkeletonPreview)}
            className="btn-outline interactive-scale"
            style={{ fontSize: '12px', padding: '7px 12px' }}
          >
            {showSkeletonPreview ? 'Hide Skeletons' : 'Preview Shimmer Skeletons'}
          </button>
          <button
            type="button"
            onClick={onSwitchToLogin || (() => navigate('/login'))}
            className="btn-outline interactive-scale"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            ← View Faculty Login
          </button>
          <button
            type="button"
            onClick={() => alert('New assignment authoring dialog.')}
            className="btn-tactile-primary interactive-scale"
            style={{ fontSize: '12.5px', padding: '9px 18px' }}
          >
            <PlusCircle size={15} />
            <span>Create Assignment</span>
          </button>
        </div>
      </nav>

      {/* Main Grid: Asymmetric 68% / 32% (XL screen) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '28px',
        }}
        className="faculty-main-grid"
      >
        {/* Main Left Content Area (68%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* 1. 3D Hero Banner (Conic / Deep Emerald Gradient) */}
          <section
            aria-label="Course Overview Banner"
            style={{
              borderRadius: '24px',
              padding: '30px 32px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
              color: '#ffffff',
              boxShadow: '0 12px 36px -6px rgba(16, 185, 129, 0.35)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Background cyan radial glow */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '45%',
                backgroundImage:
                  'radial-gradient(circle at right, rgba(6, 182, 212, 0.28) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  marginBottom: '14px',
                  letterSpacing: '0.04em',
                }}
              >
                <Database size={12} style={{ color: '#6ee7b7' }} />
                <span>CS-4200 COMPUTER NETWORKS • KARE FACULTY CONSOLE</span>
              </div>

              <h1
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '28px',
                  fontWeight: 900,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.2,
                  marginBottom: '8px',
                }}
              >
                Welcome back, {user.name}
              </h1>

              <p
                style={{
                  fontSize: '14px',
                  opacity: 0.9,
                  lineHeight: 1.5,
                  marginBottom: '22px',
                  maxWidth: '580px',
                }}
              >
                Kalasalingam Academy of Research and Education • Department of Computer Science & Engineering.
                The 5 syllabus levels are defined and ready for class enrollment.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => handleTabClick('Learning Levels')}
                  className="btn-tactile-primary interactive-scale"
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#064e3b',
                    boxShadow: '0 4px 0 0 #d1fae5, 0 8px 16px rgba(0, 0, 0, 0.12)',
                    fontSize: '13px',
                    padding: '10px 20px',
                  }}
                >
                  <Layers size={15} />
                  <span>Curriculum Blueprint</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleTabClick('Students')}
                  className="btn-outline interactive-scale"
                  style={{
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '13px',
                    padding: '10px 18px',
                  }}
                >
                  <FileSpreadsheet size={15} />
                  <span>Import Cohort Roster</span>
                </button>
              </div>
            </div>
          </section>

          {/* 2. Tactile Stat Metric Cards (Empty / Real States) */}
          <section aria-label="Course Telemetry Metrics">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
              }}
            >
              <h2
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '18px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                Course Telemetry & Metrics
              </h2>
              <span
                style={{
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-muted)',
                  fontWeight: 700,
                }}
              >
                STATUS: STANDBY (UNSYNCED)
              </span>
            </div>

            {showSkeletonPreview ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '16px',
                }}
              >
                {metrics.map((m) => {
                  const IconComp = m.icon;
                  return (
                    <div
                      key={m.title}
                      className="card-standard interactive-scale"
                      style={{
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        boxShadow: `0 4px 0 0 ${m.shadowColor}`,
                      }}
                    >
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              color: 'var(--text-secondary)',
                              fontFamily: 'var(--font-headline)',
                            }}
                          >
                            {m.title}
                          </span>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '10px',
                              backgroundColor: 'var(--surface-container)',
                              color: m.accentColor,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <IconComp size={16} />
                          </div>
                        </div>

                        <div
                          style={{
                            fontFamily: 'var(--font-headline)',
                            fontSize: '26px',
                            fontWeight: 900,
                            color: 'var(--text-primary)',
                            lineHeight: 1.1,
                            marginBottom: '6px',
                          }}
                        >
                          {m.value}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            fontFamily: 'var(--font-mono)',
                            color: m.statusColor,
                            marginBottom: '4px',
                          }}
                        >
                          <span>{m.statusText}</span>
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--text-muted)',
                            lineHeight: 1.3,
                          }}
                        >
                          {m.caption}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* 3. Learning Levels / Curriculum Progression */}
          <section className="card-standard" style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '17px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                  }}
                >
                  Curriculum Learning Levels
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                  Interactive packet units taught in accordance with KARE CS-4200 syllabus.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleTabClick('Learning Levels')}
                className="btn-outline interactive-scale"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <span>Manage Levels</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {learningLevels.map((lvl) => {
                const IconComp = lvl.icon;

                return (
                  <div
                    key={lvl.level}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '14px',
                      backgroundColor: 'var(--surface-container-low)',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--surface-container)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--primary)',
                        }}
                      >
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontFamily: 'var(--font-mono)',
                              fontSize: '11px',
                              fontWeight: 700,
                              color: 'var(--accent)',
                            }}
                          >
                            {lvl.level}
                          </span>
                          <span
                            style={{
                              fontFamily: 'var(--font-headline)',
                              fontSize: '14px',
                              fontWeight: 700,
                              color: 'var(--text-primary)',
                            }}
                          >
                            {lvl.name}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          Status: {lvl.status} • Awaiting cohort enrollment
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--surface-container)',
                          color: 'var(--text-secondary)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        No student data yet
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Tactical Rail / Analytics Sidebar (32% on desktop) */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Instructor Quick Card */}
          <div className="card-standard" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  backgroundColor: '#8b5cf6',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-headline)',
                  fontWeight: 900,
                  fontSize: '22px',
                  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                }}
              >
                {user.name.charAt(0)}
              </div>
              <div>
                <h3
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '16px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  {user.name}
                </h3>
                <span
                  style={{
                    fontSize: '11px',
                    color: '#8b5cf6',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                  }}
                >
                  {user.designation}
                </span>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{user.department}</div>
              </div>
            </div>

            <div
              style={{
                padding: '10px 12px',
                borderRadius: '12px',
                backgroundColor: 'var(--surface-container)',
                border: '1px solid var(--border)',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Staff ID</span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                }}
              >
                {user.staffId}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleTabClick('Settings')}
              className="btn-outline interactive-scale"
              style={{ width: '100%', fontSize: '12.5px' }}
            >
              Manage Instructor Profile
            </button>
          </div>

          {/* Submissions Feed - High-fidelity Empty State adhering to DATA RULE */}
          <div className="card-standard" style={{ padding: '22px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-headline)',
                  fontSize: '16px',
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                }}
              >
                Recent Submissions
              </h3>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: '#94a3b8',
                  }}
                />
                STANDBY
              </span>
            </div>

            <EmptyState
              icon={Inbox}
              badgeText="AWAITING SUBMISSIONS"
              title="No submissions yet"
              description="Student submissions for Wireshark captures, TCP handshakes, and packet routing labs will appear here once submitted."
              style={{ padding: '28px 16px', border: '1px dashed var(--border)' }}
            />
          </div>

          {/* Student Portal Cross-Reference Alert */}
          <div
            style={{
              padding: '18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
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
                fontFamily: 'var(--font-headline)',
                fontWeight: 700,
                fontSize: '13px',
                color: 'var(--accent)',
              }}
            >
              <Network size={16} />
              <span>Cresco CN Ecosystem</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              The Student Portal (`cresco-cn-kare.vercel.app`) shares the exact visual design system
              and Firestore schemas for real-time interaction.
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
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: '#0284c7',
                marginTop: '4px',
                textDecoration: 'none',
              }}
            >
              <span>Verify Student Portal Live</span>
              <ExternalLink size={12} />
            </a>
          </div>
        </aside>
      </div>

      <style>{`
        @media (min-width: 1280px) {
          .faculty-main-grid {
            grid-template-columns: minmax(0, 8fr) minmax(0, 4fr) !important;
          }
        }
      `}</style>
    </div>
  );
};
