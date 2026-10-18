import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, Sparkles, ExternalLink, School, Radio } from 'lucide-react';
import { LiquidLinesCanvas } from '../components/LiquidLinesCanvas';
import { BrandLogo } from '../components/BrandLogo';
import { useFacultyAuth } from '../context/FacultyAuthContext';
import type { FacultyUser } from '../types';

interface FacultyLoginProps {
  onLoginSuccess?: (user: FacultyUser) => void;
  onExploreStudentPortal?: () => void;
}

export const FacultyLogin: React.FC<FacultyLoginProps> = ({
  onLoginSuccess,
  onExploreStudentPortal,
}) => {
  const { signIn } = useFacultyAuth();
  const [email, setEmail] = useState('coordinator.cs4200@klu.ac.in');
  const [password, setPassword] = useState('cresco@kare2026');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Staging Demo Accounts (clearly labelled as institutional credentials awaiting Gate 4 claim)
  const stagingPresets = [
    {
      title: 'Course Coordinator',
      email: 'coordinator.cs4200@klu.ac.in',
      role: 'Course Coordinator' as const,
      designation: 'Professor & Chair',
      staffId: 'FAC-COORD-4200',
      department: 'Computer Science & Engineering',
    },
    {
      title: 'Lab Instructor',
      email: 'lab.faculty@klu.ac.in',
      role: 'Lab Faculty' as const,
      designation: 'Associate Professor',
      staffId: 'FAC-LAB-4200',
      department: 'Computer Science & Engineering',
    },
  ];

  const handleSelectPreset = (preset: (typeof stagingPresets)[0]) => {
    setEmail(preset.email);
    setPassword('cresco@kare2026');
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMessage('Please enter your institutional faculty email or Staff ID.');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter your faculty security password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await signIn(email.trim(), password);
      setIsLoading(false);
      if (res.success) {
        if (onLoginSuccess) {
          // Will navigate to /dashboard
        }
      } else {
        setErrorMessage(res.error || 'Authentication rejected: Missing verified faculty authority.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      setErrorMessage(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="login-page-bg" role="main">
      {/* 1. Dynamic Canvas: LiquidLines neon cyan wave */}
      <div className="login-canvas-container" aria-hidden="true">
        <LiquidLinesCanvas color="#06c8d9" secondaryColor="#10b981" opacity={0.85} speed={0.35} />
      </div>

      {/* Cyber grid & radial vignette overlays */}
      <div className="login-grid-overlay" aria-hidden="true" />
      <div className="login-vignette" aria-hidden="true" />

      {/* 2. Fixed Escape Navigation (Top-left & Top-right) */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          pointerEvents: 'none',
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (onExploreStudentPortal) {
              onExploreStudentPortal();
            } else {
              window.open('https://cresco-cn-kare.vercel.app/', '_blank');
            }
          }}
          title="Open Student Portal"
          aria-label="Open Student Portal in new tab"
          style={{
            pointerEvents: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(14, 22, 38, 0.85)',
            border: '1px solid rgba(6, 182, 212, 0.35)',
            color: '#e2e8f0',
            borderRadius: '12px',
            padding: '8px 14px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor: 'pointer',
            transition: 'all 180ms ease',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateX(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateX(0)')}
        >
          <span>Student Portal</span>
          <ExternalLink size={13} style={{ color: '#06c8d9' }} />
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(14, 22, 38, 0.85)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6ee7b7',
            borderRadius: '9999px',
            padding: '6px 14px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          <span
            style={{
              width: '7px',
              height: '7px',
              borderRadius: '9999px',
              backgroundColor: '#10b981',
              boxShadow: '0 0 8px #10b981',
            }}
          />
          <span>KARE NODE • SECURE ACCESS</span>
        </div>
      </header>

      {/* 3. Main Glassmorphic Login Card */}
      <div
        className="card-login-cyber"
        style={{
          zIndex: 30,
          display: 'grid',
          gridTemplateColumns: '1fr',
          marginTop: '30px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto',
            width: '100%',
          }}
          className="login-card-inner-grid"
        >
          {/* Left Column (Form Controls & Auth - 66%) */}
          <div
            style={{
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            <div>
              {/* Brand Lockup */}
              <div style={{ marginBottom: '22px' }}>
                <BrandLogo size="md" subtitleText="FACULTY PORTAL • CS-4200" />
              </div>

              {/* Title & Eyebrow */}
              <div style={{ marginBottom: '20px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '6px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: '#a78bfa',
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    INSTRUCTOR CONSOLE
                  </span>
                  <span
                    style={{
                      fontSize: '10px',
                      fontFamily: 'var(--font-mono)',
                      color: '#64748b',
                    }}
                  >
                    KARE DEPT OF CSE
                  </span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '22px',
                    fontWeight: 800,
                    color: '#f8fafc',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Faculty Sign In
                </h1>
                <p
                  style={{
                    fontSize: '12.5px',
                    color: '#94a3b8',
                    marginTop: '2px',
                  }}
                >
                  Curriculum management, packet lab authoring, and evaluation console.
                </p>
              </div>

              {/* Error banner if present */}
              {errorMessage && (
                <div
                  role="alert"
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.35)',
                    color: '#fca5a5',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    fontSize: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span style={{ fontSize: '14px' }}>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Quick Preset Selector (Clearly labeled as staging presets) */}
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  border: '1px solid rgba(56, 189, 248, 0.2)',
                  borderRadius: '12px',
                  padding: '10px 12px',
                  marginBottom: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: '#38bdf8',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Sparkles size={12} />
                    STAGING DEMO ACCESS
                  </span>
                  <span style={{ fontSize: '10px', color: '#64748b' }}>Select role</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {stagingPresets.map((preset) => {
                    const isSelected = email === preset.email;
                    return (
                      <button
                        key={preset.staffId}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        style={{
                          textAlign: 'left',
                          padding: '7px 9px',
                          borderRadius: '8px',
                          backgroundColor: isSelected ? 'rgba(6, 182, 212, 0.18)' : 'rgba(30, 41, 59, 0.6)',
                          border: isSelected
                            ? '1px solid #06b6d4'
                            : '1px solid rgba(51, 65, 85, 0.6)',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: isSelected ? '#38bdf8' : '#e2e8f0',
                            fontFamily: 'var(--font-headline)',
                          }}
                        >
                          {preset.title}
                        </div>
                        <div
                          style={{
                            fontSize: '9.5px',
                            color: '#94a3b8',
                            fontFamily: 'var(--font-mono)',
                            marginTop: '2px',
                          }}
                        >
                          {preset.email.split('@')[0]}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label
                    htmlFor="faculty-email"
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#cbd5e1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      marginBottom: '6px',
                    }}
                  >
                    <Mail size={13} style={{ color: '#06b6d4' }} />
                    <span>Faculty Email or Staff ID</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="faculty-email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. coordinator.cs4200@klu.ac.in"
                      className="input-mono"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #334155',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        transition: 'border-color 200ms ease, box-shadow 200ms ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#06b6d4';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#334155';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <label
                      htmlFor="faculty-password"
                      style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        color: '#cbd5e1',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <Lock size={13} style={{ color: '#06b6d4' }} />
                      <span>Security Password</span>
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link will be sent to registered faculty email.');
                      }}
                      style={{
                        fontSize: '11px',
                        color: '#38bdf8',
                        textDecoration: 'none',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                      }}
                    >
                      Forgot password?
                    </a>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <input
                      id="faculty-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="input-mono"
                      style={{
                        width: '100%',
                        padding: '10px 40px 10px 14px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #334155',
                        color: '#f8fafc',
                        fontSize: '13px',
                        outline: 'none',
                        transition: 'border-color 200ms ease, box-shadow 200ms ease',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = '#06b6d4';
                        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(6, 182, 212, 0.25)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#334155';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide password' : 'Show password'}
                      aria-label="Toggle password visibility"
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '2px',
                  }}
                >
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '12px',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      userSelect: 'none',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      style={{
                        accentColor: '#06b6d4',
                        width: '14px',
                        height: '14px',
                        borderRadius: '4px',
                      }}
                    />
                    <span>Remember terminal session</span>
                  </label>
                  <span
                    style={{
                      fontSize: '10.5px',
                      color: '#10b981',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                    }}
                  >
                    256-Bit SSL
                  </span>
                </div>

                {/* Submit button with Tactile 3D affordance */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-tactile-sky interactive-scale"
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    fontSize: '13.5px',
                    marginTop: '8px',
                    opacity: isLoading ? 0.8 : 1,
                    position: 'relative',
                  }}
                >
                  {isLoading ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          border: '2px solid #ffffff',
                          borderTopColor: 'transparent',
                          borderRadius: '50%',
                          display: 'inline-block',
                          animation: 'spin 0.6s linear infinite',
                        }}
                      />
                      <span>Authenticating Credentials...</span>
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      <span>Sign In to Faculty Portal</span>
                      <ArrowRight size={15} />
                    </span>
                  )}
                </button>
              </form>
            </div>

            {/* Institutional Security Notice */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(51, 65, 85, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10.5px',
                color: '#64748b',
                fontFamily: 'var(--font-mono)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <School size={12} style={{ color: '#06b6d4' }} />
                <span>KARE CS-4200 Faculty Portal</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={12} style={{ color: '#10b981' }} />
                <span>Encrypted Hub</span>
              </div>
            </div>
          </div>

          {/* Right Column (Teacher Illustration & Telemetry - 34%, desktop) */}
          <div
            className="hidden-on-mobile"
            style={{
              width: '210px',
              backgroundColor: 'rgba(11, 19, 34, 0.65)',
              borderLeft: '1px solid rgba(56, 189, 248, 0.18)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px 16px',
              position: 'relative',
            }}
          >
            {/* Ambient teacher illustration */}
            <div
              className="animate-float"
              style={{
                width: '140px',
                height: '180px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <img
                src="/cresco-teacher.png"
                alt="Cresco Teacher Mascot"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 10px 24px rgba(6, 182, 212, 0.35))',
                }}
              />
            </div>

            {/* Real Institutional Metadata Cards without Fake Counters */}
            <div
              style={{
                marginTop: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '100%',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#6ee7b7' }}>
                  CURRICULUM
                </div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  CS-4200 Networks
                </div>
              </div>

              <div
                style={{
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(6, 182, 212, 0.25)',
                  borderRadius: '10px',
                  padding: '8px 10px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '9px', fontFamily: 'var(--font-mono)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Radio size={10} />
                  <span>BACKEND STATUS</span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#f8fafc',
                    fontFamily: 'var(--font-mono)',
                    marginTop: '2px',
                  }}
                >
                  Staging Mode
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 640px) {
          .login-card-inner-grid {
            grid-template-columns: 1fr !important;
          }
          .hidden-on-mobile {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
