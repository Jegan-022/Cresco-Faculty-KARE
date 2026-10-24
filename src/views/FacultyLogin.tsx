import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, ExternalLink, School, Radio, X, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
  const { signIn, signInWithGoogle, sendPasswordReset } = useFacultyAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [forgotMessage, setForgotMessage] = useState('');

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
        if (onLoginSuccess && res.user) {
          onLoginSuccess(res.user);
        }
      } else {
        setErrorMessage(res.error || 'Authentication rejected: Missing verified faculty authority.');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/invalid-credential')) {
        setErrorMessage('Invalid faculty credentials. Please check your username and password.');
      } else {
        setErrorMessage(msg);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    try {
      const res = await signInWithGoogle();
      setIsGoogleLoading(false);
      if (res.success && res.user) {
        if (onLoginSuccess) {
          onLoginSuccess(res.user);
        }
      } else {
        setErrorMessage(res.error || 'Google sign-in completed, but this account lacks verified faculty authority.');
      }
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('auth/popup-closed-by-user')) {
        setErrorMessage('Google sign-in popup closed by user.');
      } else if (msg.includes('auth/cancelled-popup-request')) {
        setErrorMessage('Popup sign-in was cancelled.');
      } else {
        setErrorMessage(msg);
      }
    }
  };

  const handleSendPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setForgotStatus('error');
      setForgotMessage('Please enter your registered institutional email address.');
      return;
    }
    setForgotStatus('loading');
    setForgotMessage('');
    const res = await sendPasswordReset(forgotEmail.trim());
    if (res.success) {
      setForgotStatus('success');
      setForgotMessage('Password reset instructions sent. Please check your institutional inbox.');
    } else {
      setForgotStatus('error');
      setForgotMessage(res.error || 'Unable to process password reset. Please check the email address or contact KARE IT.');
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
                      placeholder="e.g. vijay.m@klu.ac.in"
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
                    <button
                      type="button"
                      onClick={() => {
                        setForgotEmail(email);
                        setForgotStatus('idle');
                        setForgotMessage('');
                        setShowForgotModal(true);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: 0,
                        fontSize: '11px',
                        color: '#38bdf8',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                      }}
                    >
                      Forgot password?
                    </button>
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
                  disabled={isLoading || isGoogleLoading}
                  className="btn-tactile-sky interactive-scale"
                  style={{
                    width: '100%',
                    padding: '12px 18px',
                    fontSize: '13.5px',
                    marginTop: '8px',
                    opacity: (isLoading || isGoogleLoading) ? 0.8 : 1,
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
                      <span>Sign In with Password</span>
                      <ArrowRight size={15} />
                    </span>
                  )}
                </button>

                {/* OR Divider */}
                <div style={{ display: 'flex', alignItems: 'center', margin: '4px 0', gap: '10px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(51, 65, 85, 0.6)' }} />
                  <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', color: '#64748b', fontWeight: 700 }}>OR</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(51, 65, 85, 0.6)' }} />
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  disabled={isLoading || isGoogleLoading}
                  onClick={handleGoogleSignIn}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#f8fafc',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: (isLoading || isGoogleLoading) ? 'not-allowed' : 'pointer',
                    transition: 'all 180ms ease',
                    opacity: (isLoading || isGoogleLoading) ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && !isGoogleLoading) {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.35)';
                      e.currentTarget.style.backgroundColor = 'rgba(30, 41, 59, 0.9)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                    e.currentTarget.style.backgroundColor = 'rgba(15, 23, 42, 0.9)';
                  }}
                >
                  <svg width="17" height="17" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span>{isGoogleLoading ? 'Connecting Google Account...' : 'Continue with Google'}</span>
                </button>
              </form>

              {/* Terms and Privacy Policy Links */}
              <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '11px', color: '#64748b' }}>
                <span>By continuing, you agree to CRESCO CN's </span>
                <Link to="/terms" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Terms & Conditions</Link>
                <span> and </span>
                <Link to="/privacy" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>.
              </div>
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

      {/* 4. Forgot Password Modal */}
      {showForgotModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-password-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(3, 7, 18, 0.75)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            padding: '16px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '440px',
              backgroundColor: 'rgba(15, 23, 42, 0.96)',
              border: '1px solid rgba(6, 182, 212, 0.35)',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(6, 182, 212, 0.15)',
              position: 'relative',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3
                  id="forgot-password-title"
                  style={{
                    fontSize: '18px',
                    fontWeight: 800,
                    color: '#f8fafc',
                    fontFamily: 'var(--font-headline)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Reset Faculty Password
                </h3>
                <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                  Enter your registered institutional email to receive official password reset instructions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                title="Close dialog"
                aria-label="Close dialog"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
              >
                <X size={18} />
              </button>
            </div>

            {/* Status alerts */}
            {forgotStatus === 'success' && (
              <div
                role="status"
                style={{
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  color: '#6ee7b7',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '12.5px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>{forgotMessage}</span>
              </div>
            )}

            {forgotStatus === 'error' && (
              <div
                role="alert"
                style={{
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.35)',
                  color: '#fca5a5',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  fontSize: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span style={{ fontSize: '14px' }}>⚠️</span>
                <span>{forgotMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSendPasswordReset} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label
                  htmlFor="reset-email-input"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#cbd5e1',
                    marginBottom: '6px',
                  }}
                >
                  Institutional Faculty Email
                </label>
                <input
                  id="reset-email-input"
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. vijay.m@klu.ac.in"
                  className="input-mono"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(11, 19, 34, 0.9)',
                    border: '1px solid #334155',
                    color: '#f8fafc',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#06b6d4')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#334155')}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #334155',
                    color: '#cbd5e1',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={forgotStatus === 'loading'}
                  className="btn-tactile-sky"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: forgotStatus === 'loading' ? 'not-allowed' : 'pointer',
                    opacity: forgotStatus === 'loading' ? 0.7 : 1,
                  }}
                >
                  {forgotStatus === 'loading' ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
