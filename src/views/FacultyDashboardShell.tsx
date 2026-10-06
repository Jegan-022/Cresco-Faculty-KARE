import React from 'react';
import {
  Users,
  BookOpen,
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
} from 'lucide-react';
import type { FacultyUser, FacultyViewType } from '../types';

interface FacultyDashboardShellProps {
  user: FacultyUser;
  activeView: FacultyViewType;
  onSelectView: (view: FacultyViewType) => void;
  onSwitchToLogin: () => void;
}

export const FacultyDashboardShell: React.FC<FacultyDashboardShellProps> = ({
  user,
  activeView,
  onSelectView,
  onSwitchToLogin,
}) => {
  // Stat Metric Cards
  const metrics = [
    {
      title: 'Enrolled Students',
      value: '452',
      change: '+18 this week',
      isPositive: true,
      caption: 'Across 4 Class Sections (A, B, C, D)',
      accentColor: '#10b981',
      shadowColor: '#bbf7d0',
      icon: Users,
    },
    {
      title: 'Average Mastery',
      value: '78.4%',
      change: '+4.2% vs midterm',
      isPositive: true,
      caption: 'Benchmark against KARE curriculum',
      accentColor: '#06b6d4',
      shadowColor: '#a5f3fc',
      icon: TrendingUp,
    },
    {
      title: 'Packet Lab Scenarios',
      value: '14 Active',
      change: '2 new drafts',
      isPositive: true,
      caption: 'TCP/IP 3-Way Handshake, Subnetting',
      accentColor: '#8b5cf6',
      shadowColor: '#ddd6fe',
      icon: Network,
    },
    {
      title: 'Pending Lab Reviews',
      value: '18',
      change: 'Due within 24h',
      isPositive: false,
      caption: 'Wireshark packet capture submissions',
      accentColor: '#f59e0b',
      shadowColor: '#fde68a',
      icon: Clock,
    },
  ];

  // Learning Levels in Cresco CN
  const learningLevels = [
    { level: 'Level 1', name: 'Physical & Data Link Layer', status: 'Published', studentsPassed: 412, total: 452, icon: Radio },
    { level: 'Level 2', name: 'IP Addressing & Subnetting', status: 'Published', studentsPassed: 388, total: 452, icon: Cpu },
    { level: 'Level 3', name: 'Routing Protocols (RIP, OSPF, BGP)', status: 'Live Testing', studentsPassed: 320, total: 452, icon: Network },
    { level: 'Level 4', name: 'Transport Layer & TCP Flow Control', status: 'In Review', studentsPassed: 215, total: 452, icon: Layers },
    { level: 'Level 5', name: 'Application Protocols (DNS, HTTP/3, TLS)', status: 'Draft', studentsPassed: 0, total: 452, icon: BookOpen },
  ];

  // Recent student activity feed
  const recentActivities = [
    { student: 'K. Sai Varun', regNo: '9921004128', action: 'Completed Subnetting Lab #4', score: '95/100', time: '12m ago' },
    { student: 'M. Ananya Rao', regNo: '9921004189', action: 'Submitted Wireshark Capture #2', score: 'Pending', time: '28m ago' },
    { student: 'R. Vignesh', regNo: '9921004204', action: 'Achieved Level 3 Routing Master', score: '100/100', time: '45m ago' },
    { student: 'P. Sneha', regNo: '9921004245', action: 'Requested Review on TCP Windowing', score: 'Help Req', time: '1h ago' },
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
      <div
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
                onClick={() => onSelectView(tab)}
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

        {/* Quick action buttons for faculty */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="btn-outline"
            style={{ fontSize: '12px', padding: '7px 14px' }}
          >
            ← View Faculty Login
          </button>
          <button
            type="button"
            onClick={() => alert('New Computer Networks lab creation dialog triggered.')}
            className="btn-tactile-primary"
            style={{ fontSize: '12.5px', padding: '9px 18px' }}
          >
            <PlusCircle size={15} />
            <span>Create Assignment</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Asymmetric 68% / 32% (XL screen) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          gap: '28px',
        }}
        className="faculty-main-grid"
      >
        {/* Main Left Content Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
          {/* 1. 3D Hero Banner (Conic / Deep Emerald Gradient) */}
          <div
            style={{
              borderRadius: '24px',
              padding: '28px 32px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 50%, #064e3b 100%)',
              color: '#ffffff',
              boxShadow: '0 12px 36px -6px rgba(16, 185, 129, 0.35)',
              position: 'relative',
              overflow: 'hidden',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Subtle background circuit aesthetic */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                width: '40%',
                backgroundImage:
                  'radial-gradient(circle at right, rgba(6, 182, 212, 0.25) 0%, transparent 70%)',
                pointerEvents: 'none',
              }}
            />

            <div style={{ position: 'relative', zIndex: 2, maxWidth: '720px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(8px)',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  marginBottom: '14px',
                  letterSpacing: '0.04em',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: '#34d399',
                    boxShadow: '0 0 6px #34d399',
                  }}
                />
                <span>KARE CS-4200 • COMPUTER NETWORKS CURRICULUM</span>
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
                  marginBottom: '20px',
                  maxWidth: '560px',
                }}
              >
                Live synchronization is active with 452 enrolled students. Cohorts are currently
                navigating OSI Layer 3 (Routing Protocols & Subnetting).
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => onSelectView('Learning Levels')}
                  className="btn-tactile-primary"
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
                  onClick={() => alert('Exporting full class gradebook CSV...')}
                  className="btn-outline"
                  style={{
                    color: '#ffffff',
                    borderColor: 'rgba(255, 255, 255, 0.4)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: '13px',
                    padding: '10px 18px',
                  }}
                >
                  <FileSpreadsheet size={15} />
                  <span>Export Gradebook</span>
                </button>
              </div>
            </div>
          </div>

          {/* 2. Tactile Stat Metric Cards */}
          <div>
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
                SYNCED: JUST NOW
              </span>
            </div>

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
                    className="card-standard"
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
                          color: m.isPositive ? 'var(--success)' : 'var(--warning)',
                          marginBottom: '4px',
                        }}
                      >
                        <span>{m.change}</span>
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
          </div>

          {/* 3. Learning Levels / Curriculum Progression */}
          <div className="card-standard" style={{ padding: '24px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px',
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
                onClick={() => onSelectView('Learning Levels')}
                className="btn-outline"
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                <span>Manage Levels</span>
                <ChevronRight size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {learningLevels.map((lvl) => {
                const percentage = Math.round((lvl.studentsPassed / lvl.total) * 100);
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
                          Status: {lvl.status} • {lvl.studentsPassed} of {lvl.total} Students Qualified
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with Gradient */}
                    <div style={{ width: '160px' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '10.5px',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 700,
                          marginBottom: '4px',
                          color: 'var(--text-secondary)',
                        }}
                      >
                        <span>Completion</span>
                        <span>{percentage}%</span>
                      </div>
                      <div
                        style={{
                          width: '100%',
                          height: '8px',
                          borderRadius: '9999px',
                          backgroundColor: 'var(--surface-container)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                            borderRadius: '9999px',
                            transition: 'width 600ms ease',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tactical Rail / Analytics Sidebar (approx 32% on desktop) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
              onClick={() => onSelectView('Settings')}
              className="btn-outline"
              style={{ width: '100%', fontSize: '12.5px' }}
            >
              Manage Instructor Profile
            </button>
          </div>

          {/* Live Student Submissions Feed */}
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
                  color: 'var(--success)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '9999px',
                    backgroundColor: '#10b981',
                  }}
                />
                LIVE
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recentActivities.map((act) => (
                <div
                  key={act.regNo}
                  style={{
                    paddingBottom: '10px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {act.student}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {act.time}
                    </span>
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                    {act.action}
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '2px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        color: 'var(--text-muted)',
                      }}
                    >
                      {act.regNo}
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: act.score.includes('100') || act.score.includes('95')
                          ? 'var(--success)'
                          : act.score === 'Pending'
                          ? 'var(--warning)'
                          : 'var(--accent)',
                      }}
                    >
                      {act.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => onSelectView('Students')}
              className="btn-outline"
              style={{ width: '100%', marginTop: '14px', fontSize: '12px' }}
            >
              <span>View All 452 Students</span>
              <ChevronRight size={13} />
            </button>
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
        </div>
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
