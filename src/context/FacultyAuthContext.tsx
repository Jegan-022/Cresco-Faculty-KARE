/**
 * CRESCO Production — Faculty Authentication & Authorization Context
 *
 * Implements Step 26: Trusted server-role gatekeeper for all Faculty views.
 *
 * Invariants:
 * 1. Never bypasses authorization using local storage or client flags.
 * 2. Renders clear loading, signed-out, unauthorized, and session-expired states.
 * 3. Prevents student accounts from gaining faculty privileges.
 * 4. Transparently surfaces institutional IT dependency for unprovisioned accounts.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  subscribeToFacultyAuth, 
  signInFacultyWithCredentials, 
  signOutFaculty,
  INSTITUTIONAL_IT_DEPENDENCY 
} from '../services/facultyAuthService';
import type { FacultyUser, FacultyAuthorizationInfo } from '../types';
import { ShieldAlert, LogOut, ExternalLink, RefreshCw, Lock } from 'lucide-react';
import { SkeletonCard } from '../components/SkeletonLoader';

interface FacultyAuthContextType {
  user: FacultyUser | null;
  authInfo: FacultyAuthorizationInfo | null;
  isLoading: boolean;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; user?: FacultyUser | null; error?: string }>;
  signOut: () => Promise<void>;
}

const FacultyAuthContext = createContext<FacultyAuthContextType | undefined>(undefined);

export const FacultyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FacultyUser | null>(null);
  const [authInfo, setAuthInfo] = useState<FacultyAuthorizationInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToFacultyAuth((updatedUser, updatedAuthInfo, loading) => {
      setUser(updatedUser);
      setAuthInfo(updatedAuthInfo);
      setIsLoading(loading);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const result = await signInFacultyWithCredentials(email, pass);
      setUser(result.user);
      setAuthInfo(result.authInfo);
      setIsLoading(false);
      if (result.user && result.authInfo.isAuthorized) {
        return { success: true, user: result.user };
      } else {
        return { 
          success: false, 
          error: result.authInfo.rejectionReason || 'Authentication failed. Account lacks faculty authority.' 
        };
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  };

  const signOut = async () => {
    await signOutFaculty();
    setUser(null);
    setAuthInfo(null);
  };

  return (
    <FacultyAuthContext.Provider value={{ user, authInfo, isLoading, signIn, signOut }}>
      {children}
    </FacultyAuthContext.Provider>
  );
};

export const useFacultyAuth = (): FacultyAuthContextType => {
  const context = useContext(FacultyAuthContext);
  if (!context) {
    throw new Error('useFacultyAuth must be used within a FacultyAuthProvider');
  }
  return context;
};

/**
 * Clean Shimmer Loading View while checking Firebase token claims
 */
export const FacultyLoadingView: React.FC = () => (
  <div style={{ maxWidth: '800px', margin: '80px auto', padding: '0 20px' }}>
    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', marginBottom: '8px' }}>
        <RefreshCw size={20} className="animate-spin" />
        <span style={{ fontFamily: 'var(--font-headline)', fontWeight: 700 }}>Verifying Server-Issued Faculty Claims...</span>
      </div>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Checking cryptographically signed token attributes (request.auth.token.role)</p>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  </div>
);

/**
 * Honest, Clear Unauthorized View for accounts lacking server faculty claims
 */
export const FacultyUnauthorizedView: React.FC<{ authInfo: FacultyAuthorizationInfo | null; onSignOut: () => void }> = ({
  authInfo,
  onSignOut,
}) => {
  const isStudentAccount = authInfo?.role === 'student';

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div
        className="card-standard"
        style={{
          maxWidth: '580px',
          width: '100%',
          padding: '36px',
          border: '1px solid #ef4444',
          boxShadow: '0 20px 40px rgba(239, 68, 68, 0.12)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldAlert size={24} />
          </div>
          <div>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 700 }}>
              SECURITY POLICY ENFORCEMENT
            </span>
            <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>
              {isStudentAccount ? 'Student Account Restricted' : 'Unauthorized Faculty Access'}
            </h2>
          </div>
        </div>

        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
          {authInfo?.rejectionReason || 'Your authenticated Firebase session does not possess the server-issued faculty custom claim.'}
        </p>

        {/* Institutional IT Dependency Notice */}
        <div
          style={{
            padding: '16px',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-container)',
            border: '1px solid var(--border)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Lock size={14} style={{ color: 'var(--warning)' }} />
            <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {INSTITUTIONAL_IT_DEPENDENCY.gate}
            </span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
            {authInfo?.dependencyNotice || INSTITUTIONAL_IT_DEPENDENCY.description}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onSignOut}
            className="btn-tactile-primary interactive-scale"
            style={{ flex: 1, padding: '10px 16px', fontSize: '13px' }}
          >
            <LogOut size={14} />
            <span>Sign Out & Switch Account</span>
          </button>
          {isStudentAccount && (
            <button
              type="button"
              onClick={() => window.open('https://cresco-cn.vercel.app', '_blank')}
              className="btn-outline interactive-scale"
              style={{ fontSize: '13px', padding: '10px 16px' }}
            >
              <ExternalLink size={14} />
              <span>Launch Student Portal</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Route guard wrapping all protected faculty views
 */
export const FacultyProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, authInfo, isLoading, signOut } = useFacultyAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <FacultyLoadingView />;
  }

  // Not signed in -> redirect to /login
  if (!user && !authInfo) {
    navigate('/login', { replace: true });
    return null;
  }

  // Signed in but unauthorized (e.g. Student account, or missing claims)
  if (!user || !authInfo?.isAuthorized) {
    return <FacultyUnauthorizedView authInfo={authInfo} onSignOut={signOut} />;
  }

  // Authorized faculty member
  return <>{children}</>;
};
