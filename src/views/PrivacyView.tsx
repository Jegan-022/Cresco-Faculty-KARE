import React from 'react';
import { ArrowLeft, Lock, ShieldCheck, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PrivacyView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-primary)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '18px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
              <Lock size={20} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)', margin: '2px 0 0 0' }}>
                CRESCO Faculty Portal • Student Data Privacy &amp; Academic Security
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-tactile-sky interactive-scale"
            style={{ fontSize: '12px', padding: '6px 14px' }}
          >
            <ArrowLeft size={14} />
            <span>Return</span>
          </button>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '13.5px', lineHeight: 1.6, color: '#cbd5e1' }}>
          <section style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={16} style={{ color: '#10b981' }} />
              1. Student Privacy Protection
            </h2>
            <p>
              Faculty instructors have access to student progress, packet lab submissions, and quiz telemetry
              solely for academic coaching, remediation, and official rubric evaluation. Individual student records
              are never exported or exposed to non-authorized third parties.
            </p>
          </section>

          <section style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={16} style={{ color: '#10b981' }} />
              2. Faculty Credential Security
            </h2>
            <p>
              Faculty accounts authenticate via Google Workspace SSO or encrypted Firebase sessions.
              Passwords and session tokens are never logged or stored in client-side documents.
            </p>
          </section>

          <footer style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center', fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
            Effective Date: October 2026 • Kalasalingam Academy of Research and Education
          </footer>
        </div>
      </div>
    </div>
  );
};

export default PrivacyView;
