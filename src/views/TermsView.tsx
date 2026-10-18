import React from 'react';
import { ArrowLeft, FileText, Shield, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TermsView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-primary)', padding: '32px 20px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '18px', borderBottom: '1px solid var(--border)', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
              <FileText size={20} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '22px', fontWeight: 800, margin: 0, color: '#f8fafc' }}>
                Terms &amp; Conditions
              </h1>
              <p style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'var(--font-mono)', margin: '2px 0 0 0' }}>
                CRESCO Faculty Portal • Kalasalingam Academy of Research and Education • Version 1.0
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
              <Shield size={16} style={{ color: '#06b6d4' }} />
              1. Institutional Faculty Usage Agreement
            </h2>
            <p>
              Access to this Faculty Portal is restricted to authorized teaching faculty, lab instructors,
              and academic administrators of the Department of Computer Science &amp; Engineering.
              Role access is governed by server-validated custom claims (<code style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>token.role == 'faculty'</code>).
            </p>
          </section>

          <section style={{ backgroundColor: 'rgba(15, 23, 42, 0.75)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle size={16} style={{ color: '#06b6d4' }} />
              2. Curriculum &amp; Evaluation Governance
            </h2>
            <p>
              Instructors agree to apply deterministic grading rubrics objectively to subjective Wireshark
              and packet analysis submissions, maintaining student grading parity across all active sections
              (CS-4200-A, CS-4200-B).
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

export default TermsView;
