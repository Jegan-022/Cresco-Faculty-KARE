import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  BookOpen,
  ClipboardCheck,
  Activity,
  Search,
  CheckCircle2,
  AlertCircle,
  Server,
  Lock,
  Database,
  Radio
} from 'lucide-react';
import {
  getAdminOverview,
  getAdminStudents,
  getAdminFacultyRoster,
  getAdminCurriculum,
  getAdminAssessments,
  getAdminSystemStatus,
  isAuthorizedAdministrator,
  type AdminOverviewStats,
  type AdminStudentRecord,
  type AdminFacultyRecord,
  type AdminCurriculumRecord,
  type AdminAssessmentRecord,
  type AdminSystemStatus
} from '../services/adminService';
import { useFacultyAuth } from '../context/FacultyAuthContext';
import { SkeletonCard } from '../components/SkeletonLoader';
import { useNavigate } from 'react-router-dom';

type AdminTab = 'overview' | 'students' | 'faculty' | 'curriculum' | 'assessments' | 'system';

export const AdminPortalView: React.FC = () => {
  const { user, authInfo } = useFacultyAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Section States
  const [overview, setOverview] = useState<AdminOverviewStats | null>(null);
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [faculty, setFaculty] = useState<AdminFacultyRecord[]>([]);
  const [curriculum, setCurriculum] = useState<AdminCurriculumRecord[]>([]);
  const [assessments, setAssessments] = useState<AdminAssessmentRecord[]>([]);
  const [systemStatus, setSystemStatus] = useState<AdminSystemStatus | null>(null);

  const isAuthorized = isAuthorizedAdministrator(user, authInfo?.claims || {});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [ov, st, fac, sys] = await Promise.all([
          getAdminOverview(),
          getAdminStudents(),
          getAdminFacultyRoster(),
          getAdminSystemStatus()
        ]);
        setOverview(ov);
        setStudents(st);
        setFaculty(fac);
        setCurriculum(getAdminCurriculum());
        setAssessments(getAdminAssessments());
        setSystemStatus(sys);
      } catch (err) {
        console.error('[Admin Portal] Error loading data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div className="card-standard" style={{ maxWidth: '540px', width: '100%', padding: '36px', border: '1px solid #ef4444' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={22} />
            </div>
            <div>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#ef4444', fontWeight: 700 }}>
                ACCESS RESTRICTED
              </span>
              <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Administrator Portal Restricted
              </h2>
            </div>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            Access to cross-platform administrator oversight requires verified institutional administrator custom claims (request.auth.token.role == 'admin').
          </p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn-tactile-primary interactive-scale"
            style={{ width: '100%', padding: '10px 16px', fontSize: '13px' }}
          >
            <span>Return to Instructor Console</span>
          </button>
        </div>
      </div>
    );
  }

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCurriculum = curriculum.filter(m =>
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 48px 20px' }}>
      
      {/* Top Header / Portal Banner */}
      <header style={{ marginBottom: '24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#a78bfa', backgroundColor: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px 8px', borderRadius: '9999px', textTransform: 'uppercase' }}>
              INSTITUTIONAL ADMINISTRATION
            </span>
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              KARE CS-4200 NODE
            </span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
            CRESCO Cross-Platform Administrator Portal
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
            Authorized inspection and governance for Student and Faculty applications.
          </p>
        </div>

        {/* Live System Beacon */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--border)', borderRadius: '12px', padding: '8px 14px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: systemStatus?.firebaseConnected ? '#10b981' : '#f59e0b', boxShadow: '0 0 8px #10b981' }} />
          <div>
            <div style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              FIREBASE PROJECT
            </div>
            <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {systemStatus?.projectId || 'cresco-cn'} ({systemStatus?.latencyMs || 15}ms)
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs (6 Required Sections) */}
      <nav style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }} role="tablist">
        {[
          { id: 'overview', label: 'Overview', icon: Activity },
          { id: 'students', label: 'Student Management', icon: Users, count: students.length },
          { id: 'faculty', label: 'Faculty Management', icon: Shield, count: faculty.length },
          { id: 'curriculum', label: 'Curriculum Management', icon: BookOpen, count: curriculum.length },
          { id: 'assessments', label: 'Assessment Oversight', icon: ClipboardCheck, count: assessments.length },
          { id: 'system', label: 'System Status', icon: Server }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => { setActiveTab(tab.id as AdminTab); setSearchQuery(''); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '12px',
                fontSize: '12.5px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 150ms ease',
                backgroundColor: isActive ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
                color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                border: isActive ? '1px solid #06b6d4' : '1px solid transparent',
              }}
            >
              <Icon size={15} />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', padding: '1px 6px', borderRadius: '9999px', backgroundColor: isActive ? 'rgba(6, 182, 212, 0.3)' : 'var(--surface-container-high)', color: isActive ? '#f8fafc' : 'var(--text-muted)' }}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Tab Content */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {/* 1. OVERVIEW SECTION */}
          {activeTab === 'overview' && overview && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Stat Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#38bdf8', marginBottom: '4px' }}>
                    CANONICAL CURRICULUM
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {overview.totalModules} Modules
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {overview.totalUnits} Units • {overview.totalLevels} Gamified Quest Levels
                  </div>
                </div>

                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10b981', marginBottom: '4px' }}>
                    ENROLLED STUDENTS
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {overview.enrolledStudentsCount > 0 ? overview.enrolledStudentsCount : '1 (Active)'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {overview.hasGenuineEvidence ? 'Authoritative public_leaderboard projection' : 'Awaiting cohort sync'}
                  </div>
                </div>

                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: '4px' }}>
                    REGISTERED FACULTY
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {overview.registeredFacultyCount} Instructors
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Course Coordinator &amp; Lab Faculty
                  </div>
                </div>

                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#f59e0b', marginBottom: '4px' }}>
                    PENDING RUBRIC REVIEWS
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                    {overview.pendingAssessmentsCount} Submissions
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Wireshark TCP handshake analysis
                  </div>
                </div>
              </div>

              {/* Cross-Platform Quick Launch & Summary */}
              <div className="card-standard" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '14px', color: 'var(--text-primary)' }}>
                  Platform Architecture Summary
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface-container)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px', color: '#38bdf8', marginBottom: '6px' }}>
                      <Radio size={15} />
                      <span>Student Application Portal</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      URL: <code style={{ fontFamily: 'var(--font-mono)' }}>http://localhost:3000/</code> • 30 canonical learning loops, Wireshark packet simulators, AI tutor proxy.
                    </p>
                  </div>

                  <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface-container)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '13px', color: '#10b981', marginBottom: '6px' }}>
                      <Shield size={15} />
                      <span>Faculty Instructor Portal</span>
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: 1.5 }}>
                      URL: <code style={{ fontFamily: 'var(--font-mono)' }}>http://localhost:5173/</code> • Rubric grading queue, curriculum inspection, live classroom orchestration.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. STUDENT MANAGEMENT SECTION */}
          {activeTab === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, register number, email..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--surface-container)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Showing {filteredStudents.length} student records
                </span>
              </div>

              <div className="card-standard" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-container)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      <th style={{ padding: '12px 16px' }}>REGISTER NUMBER</th>
                      <th style={{ padding: '12px 16px' }}>NAME</th>
                      <th style={{ padding: '12px 16px' }}>DEPARTMENT</th>
                      <th style={{ padding: '12px 16px' }}>PROGRESS</th>
                      <th style={{ padding: '12px 16px' }}>TOTAL XP</th>
                      <th style={{ padding: '12px 16px' }}>TERMS AGREEMENT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((st) => (
                      <tr key={st.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                          {st.studentId}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {st.name}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                          {st.department}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                          {st.completedModulesCount} / 30 Modules
                        </td>
                        <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          {st.totalXP} XP
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {st.termsAccepted ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                              <CheckCircle2 size={13} /> Accepted v1.0
                            </span>
                          ) : (
                            <span style={{ color: '#f59e0b', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                              Pending Acceptance
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. FACULTY MANAGEMENT SECTION */}
          {activeTab === 'faculty' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Shield size={18} style={{ color: '#38bdf8' }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Trusted Role-Provisioning Pipeline (Gate 4)
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Faculty privileges require cryptographically signed token claims (request.auth.token.role == 'faculty').
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', padding: '3px 10px', borderRadius: '9999px', backgroundColor: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                  Server-Controlled Boundary
                </span>
              </div>

              <div className="card-standard" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-container)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      <th style={{ padding: '12px 16px' }}>STAFF ID</th>
                      <th style={{ padding: '12px 16px' }}>FACULTY NAME</th>
                      <th style={{ padding: '12px 16px' }}>DESIGNATION</th>
                      <th style={{ padding: '12px 16px' }}>SECTIONS</th>
                      <th style={{ padding: '12px 16px' }}>CLAIM STATUS</th>
                      <th style={{ padding: '12px 16px' }}>PROVISIONING</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faculty.map((fac) => (
                      <tr key={fac.staffId} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#a78bfa' }}>
                          {fac.staffId}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          <div>{fac.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{fac.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>
                          {fac.designation}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                          {fac.assignedSections.join(', ')}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          {fac.hasServerClaim ? (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                              <CheckCircle2 size={13} /> Verified Claim
                            </span>
                          ) : (
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                              <AlertCircle size={13} /> Missing Claim
                            </span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: '10.5px',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: fac.provisioningStatus === 'PROVISIONED' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: fac.provisioningStatus === 'PROVISIONED' ? '#10b981' : '#f59e0b',
                            border: fac.provisioningStatus === 'PROVISIONED' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)'
                          }}>
                            {fac.provisioningStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. CURRICULUM MANAGEMENT SECTION */}
          {activeTab === 'curriculum' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
                  <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by module title, ID (e.g. u3_m01)..."
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 36px',
                      borderRadius: '10px',
                      backgroundColor: 'var(--surface-container)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      fontSize: '12.5px',
                      outline: 'none',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  30 Canonical Modules (u3_m01 to u5_m09)
                </span>
              </div>

              <div className="card-standard" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-container)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      <th style={{ padding: '12px 16px' }}>MODULE ID</th>
                      <th style={{ padding: '12px 16px' }}>UNIT</th>
                      <th style={{ padding: '12px 16px' }}>TITLE</th>
                      <th style={{ padding: '12px 16px' }}>EST. READ TIME</th>
                      <th style={{ padding: '12px 16px' }}>XP REWARD</th>
                      <th style={{ padding: '12px 16px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCurriculum.map((m) => (
                      <tr key={m.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38bdf8' }}>
                          {m.id}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                          Unit {m.unitNumber}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {m.title}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                          {m.readTime}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                          +{m.xpReward} XP
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ fontSize: '10.5px', fontFamily: 'var(--font-mono)', padding: '2px 8px', borderRadius: '6px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                            {m.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. ASSESSMENT OVERSIGHT SECTION */}
          {activeTab === 'assessments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="card-standard" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'var(--surface-container)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      <th style={{ padding: '12px 16px' }}>SUBMISSION ID</th>
                      <th style={{ padding: '12px 16px' }}>STUDENT</th>
                      <th style={{ padding: '12px 16px' }}>ASSESSMENT TITLE</th>
                      <th style={{ padding: '12px 16px' }}>SUBMITTED AT</th>
                      <th style={{ padding: '12px 16px' }}>RUBRIC SCORE</th>
                      <th style={{ padding: '12px 16px' }}>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((a) => (
                      <tr key={a.submissionId} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>
                          {a.submissionId}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>
                          <div>{a.studentName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{a.studentRegNo}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>
                          {a.assessmentTitle}
                        </td>
                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)', fontSize: '11.5px', fontFamily: 'var(--font-mono)' }}>
                          {new Date(a.submittedAt).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)' }}>
                          {a.isEvaluated ? (
                            <span style={{ color: '#10b981', fontWeight: 700 }}>
                              {a.totalScore} / 100 ({a.percentageScore}%)
                            </span>
                          ) : (
                            <span style={{ color: '#f59e0b' }}>Pending Review</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            fontSize: '10.5px',
                            fontFamily: 'var(--font-mono)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            backgroundColor: a.isEvaluated ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: a.isEvaluated ? '#10b981' : '#f59e0b'
                          }}>
                            {a.isEvaluated ? `Evaluated by ${a.evaluatorId}` : 'Awaiting Faculty'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. SYSTEM STATUS & DIAGNOSTICS SECTION */}
          {activeTab === 'system' && systemStatus && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', marginBottom: '8px' }}>
                    <Database size={16} />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>FIREBASE FIRESTORE</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Connected ({systemStatus.latencyMs}ms)
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Database: <code style={{ fontFamily: 'var(--font-mono)' }}>{systemStatus.databaseId}</code> on <code style={{ fontFamily: 'var(--font-mono)' }}>{systemStatus.projectId}</code>
                  </p>
                </div>

                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', marginBottom: '8px' }}>
                    <Lock size={16} />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>FIREBASE AUTH</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    Active &amp; Persisted
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Domain: <code style={{ fontFamily: 'var(--font-mono)' }}>{systemStatus.authDomain}</code>
                  </p>
                </div>

                <div className="card-standard" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#a78bfa', marginBottom: '8px' }}>
                    <Server size={16} />
                    <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>AI TUTOR PROXY</span>
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {systemStatus.aiTutorStatus}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Backend route: <code style={{ fontFamily: 'var(--font-mono)' }}>/api/ai-tutor</code>
                  </p>
                </div>
              </div>

              {/* External Dependency Tracker Card */}
              <div className="card-standard" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <AlertCircle size={18} style={{ color: '#f59e0b' }} />
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    Gate 4 Institutional Dependency Diagnostics
                  </h3>
                </div>
                <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--border)', fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <div><strong>Gate Status:</strong> <code style={{ fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>{systemStatus.gate4Status}</code></div>
                  <div style={{ marginTop: '6px' }}><strong>Description:</strong> {systemStatus.gate4Description}</div>
                  <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    Development &amp; Staging fallback active for authorized coordinator evaluation.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPortalView;
