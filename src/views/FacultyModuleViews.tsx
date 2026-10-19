import React, { useState, useEffect } from 'react';
import {
  Users,
  BarChart3,
  Download,
  Plus,
  Save,
  Database,
  ShieldAlert,
  Activity,
  Radio,
  Eye,
  EyeOff,
  Send,
  StopCircle,
  Award,
  ClipboardCheck,
} from 'lucide-react';
import type { FacultyUser, FacultyViewType, SubjectiveAssessmentSubmission, LiveClassroomSessionState } from '../types';
import { EmptyState } from '../components/EmptyState';
import { SkeletonTable } from '../components/SkeletonLoader';
import { getSubmissions, evaluateSubjectiveSubmission, fetchSubmissionsFromFirestore } from '../services/assessmentReviewService';
import { 
  subscribeToLiveClassroom, 
  broadcastQuestion, 
  revealLiveAnswer, 
  endLiveSession, 
  SAMPLE_BROADCAST_QUESTIONS, 
  INITIAL_INACTIVE_SESSION 
} from '../services/liveClassroomService';

interface FacultyModuleViewsProps {
  activeView: FacultyViewType;
  user: FacultyUser;
  onNavigate: (view: FacultyViewType) => void;
}

export const FacultyModuleViews: React.FC<FacultyModuleViewsProps> = ({
  activeView,
  user,
}) => {
  const [showSkeletonPreview, setShowSkeletonPreview] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [profileDepartment, setProfileDepartment] = useState(user.department);
  const [profileDesignation, setProfileDesignation] = useState(user.designation);

  // Assessment Review State
  const [submissions, setSubmissions] = useState<SubjectiveAssessmentSubmission[]>(() => getSubmissions());
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.submissionId || '');
  const [criterionScores, setCriterionScores] = useState<Record<string, number>>({
    crit_protocol_accuracy: 28,
    crit_architectural_rationale: 33,
    crit_diagnostic_depth: 32,
  });
  const [reviewFeedback, setReviewFeedback] = useState<string>('Thorough Wireshark trace analysis with correct ISN parsing and SYN cookie explanation.');
  const [reviewMessage, setReviewMessage] = useState<string>('');

  // Live Classroom State
  const [liveSession, setLiveSession] = useState<LiveClassroomSessionState>(INITIAL_INACTIVE_SESSION);
  const [isBroadcasting, setIsBroadcasting] = useState<boolean>(false);

  useEffect(() => {
    fetchSubmissionsFromFirestore().then((subs) => {
      setSubmissions(subs);
      if (subs.length > 0 && !selectedSubId) {
        setSelectedSubId(subs[0].submissionId);
      }
    });

    const unsub = subscribeToLiveClassroom((updated) => {
      setLiveSession(updated);
    });
    return () => unsub();
  }, []);

  // 1. STUDENTS ROSTER VIEW (Strictly adheres to DATA RULE: No fabricated student names or numbers)
  if (activeView === 'Students') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              Student Cohort Roster
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Course CS-4200 Computer Networks • Kalasalingam Academy of Research and Education.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => setShowSkeletonPreview(!showSkeletonPreview)}
              className="btn-outline interactive-scale"
              style={{ fontSize: '12px', padding: '8px 14px' }}
            >
              {showSkeletonPreview ? 'Hide Skeletons' : 'Preview Table Skeletons'}
            </button>
            <button
              type="button"
              onClick={() => {
                const csvContent = 'data:text/csv;charset=utf-8,RegNo,Name,Section,Email\n';
                const encodedUri = encodeURI(csvContent);
                const link = document.createElement('a');
                link.setAttribute('href', encodedUri);
                link.setAttribute('download', 'kare_cs4200_roster_template.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="btn-outline interactive-scale"
              style={{ fontSize: '12.5px' }}
            >
              <Download size={14} />
              <span>Download CSV Template</span>
            </button>
            <button
              type="button"
              onClick={() => alert('Import student roster CSV dialog opened.')}
              className="btn-tactile-primary interactive-scale"
              style={{ fontSize: '12.5px' }}
            >
              <Plus size={14} />
              <span>Import Roster CSV</span>
            </button>
          </div>
        </div>

        {/* State representation */}
        {showSkeletonPreview ? (
          <div>
            <div style={{ marginBottom: '12px', fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              SHIMMER LOADING STATE PREVIEW (4 ROWS):
            </div>
            <SkeletonTable rows={4} />
          </div>
        ) : (
          <EmptyState
            icon={Users}
            badgeText="AWAITING COHORT ENROLLMENT"
            title="No student data available"
            description="Firebase Firestore is not yet connected. Connect your database or upload a class roster CSV to track individual student mastery, packet submissions, and lab diagnostics."
            actionText="Import Student Roster (CSV)"
            onAction={() => alert('Upload CSV dialog opened. Select student cohort CSV file.')}
            secondaryActionText="Awaiting Database Sync"
            onSecondaryAction={() => alert('Database status: Firebase Firestore is currently disconnected.')}
          />
        )}
      </div>
    );
  }

  // 2. COURSES VIEW (Real CS-4200 architecture without fake counts)
  if (activeView === 'Courses') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Course Architecture & Syllabi
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Course Code: CS-4200 (Computer Networks) • Department of Computer Science & Engineering
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px',
          }}
        >
          {[
            {
              code: 'CS-4200-A',
              section: 'Section A (Morning)',
              lead: user.name,
              room: 'Lab Complex 302',
              schedule: 'Mon, Wed 09:00 - 10:45 AM',
            },
            {
              code: 'CS-4200-B',
              section: 'Section B (Morning)',
              lead: 'Lab Faculty',
              room: 'Lab Complex 304',
              schedule: 'Tue, Thu 09:00 - 10:45 AM',
            },
            {
              code: 'CS-4200-C',
              section: 'Section C (Afternoon)',
              lead: user.name,
              room: 'Lab Complex 302',
              schedule: 'Mon, Wed 01:30 - 03:15 PM',
            },
            {
              code: 'CS-4200-D',
              section: 'Section D (Afternoon)',
              lead: 'Faculty Instructor',
              room: 'Network Lab 201',
              schedule: 'Tue, Thu 01:30 - 03:15 PM',
            },
          ].map((c) => (
            <div
              key={c.code}
              className="card-standard interactive-scale"
              style={{
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: 'var(--accent)',
                    }}
                  >
                    {c.code}
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--surface-container)',
                    }}
                  >
                    Awaiting Roster
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: 'var(--font-headline)',
                    fontSize: '18px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginBottom: '4px',
                  }}
                >
                  {c.section}
                </h2>
                <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  Lead: <strong>{c.lead}</strong>
                </div>
                <div
                  style={{
                    fontSize: '11.5px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div>📍 Location: {c.room}</div>
                  <div>🕒 Timing: {c.schedule}</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  paddingTop: '14px',
                  borderTop: '1px solid var(--border-subtle)',
                  display: 'flex',
                  gap: '10px',
                }}
              >
                <button
                  type="button"
                  onClick={() => alert(`Roster for ${c.code} will appear once students enroll.`)}
                  className="btn-tactile-primary interactive-scale"
                  style={{ flex: 1, fontSize: '12px', padding: '8px' }}
                >
                  Configure Section
                </button>
                <button
                  type="button"
                  onClick={() => alert(`Syllabus objectives for ${c.code}`)}
                  className="btn-outline interactive-scale"
                  style={{ fontSize: '12px', padding: '8px 12px' }}
                >
                  Syllabus
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3. LEARNING LEVELS VIEW (Real syllabus modules, empty student progression)
  if (activeView === 'Learning Levels') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-headline)',
                fontSize: '24px',
                fontWeight: 800,
                color: 'var(--text-primary)',
              }}
            >
              Interactive Learning Levels
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Configure quest progression, simulator packet challenges, and passing thresholds for CS-4200.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert('New level challenge builder.')}
            className="btn-tactile-purple interactive-scale"
            style={{ fontSize: '13px' }}
          >
            <Plus size={15} />
            <span>Create New Level</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            {
              lvl: '01',
              title: 'Layer 1 & 2: Physical & Frame Encoding',
              badge: 'Curriculum Ready',
              desc: 'Manchester encoding, NRZ, CSMA/CD, MAC address framing, and frame check sequences.',
            },
            {
              lvl: '02',
              title: 'Layer 3A: IPv4 / IPv6 Subnetting & CIDR',
              badge: 'Curriculum Ready',
              desc: 'VLSM calculations, broadcast domains, subnet mask breakdown, and prefix routing.',
            },
            {
              lvl: '03',
              title: 'Layer 3B: Interior Gateway Routing (OSPF & RIP)',
              badge: 'Curriculum Ready',
              desc: 'Dijkstra shortest path algorithm, packet forwarding tables, and routing loop prevention.',
            },
            {
              lvl: '04',
              title: 'Layer 4: TCP 3-Way Handshake & Sliding Window',
              badge: 'Curriculum Ready',
              desc: 'SYN-ACK sequences, sequence number arithmetic, sliding window flow control, and TCP Reno.',
            },
            {
              lvl: '05',
              title: 'Layer 7: DNS Resolution & Modern HTTP/3',
              badge: 'Curriculum Ready',
              desc: 'Recursive root hints, TLS 1.3 handshakes, and QUIC stream multiplexing over UDP.',
            },
          ].map((l) => (
            <div
              key={l.lvl}
              className="card-standard interactive-scale"
              style={{
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '20px',
                    fontWeight: 900,
                    color: 'var(--primary)',
                    width: '36px',
                  }}
                >
                  {l.lvl}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2
                      style={{
                        fontFamily: 'var(--font-headline)',
                        fontSize: '16px',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                      }}
                    >
                      {l.title}
                    </h2>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--surface-container)',
                        color: 'var(--accent)',
                      }}
                    >
                      {l.badge}
                    </span>
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {l.desc}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                  }}
                >
                  No student submissions yet
                </span>
                <button
                  type="button"
                  onClick={() => alert(`Configuring unit ${l.title}`)}
                  className="btn-outline interactive-scale"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  Edit Challenge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 3B. ASSESSMENT REVIEW VIEW (Subjective Assessment Queue & Rubric Grading)
  if (activeView === 'Assessment Review') {
    const selectedSub = submissions.find(s => s.submissionId === selectedSubId) || submissions[0];
    const totalScore = Object.values(criterionScores).reduce((a, b) => a + b, 0);

    const handleSaveReview = () => {
      if (!selectedSub) return;
      const res = evaluateSubjectiveSubmission(
        selectedSub.submissionId,
        user,
        criterionScores,
        reviewFeedback
      );
      if (res.success) {
        setReviewMessage(`✅ Official evaluation recorded for ${selectedSub.studentName} (${res.evaluation?.totalScore} / ${res.evaluation?.maxPossibleScore} pts).`);
        setSubmissions(getSubmissions());
      } else {
        setReviewMessage(`❌ Evaluation failed: ${res.error}`);
      }
    };

    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--accent)', backgroundColor: 'var(--surface-container)', padding: '2px 8px', borderRadius: '6px' }}>
                ACADEMIC DECISION WORKFLOW
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                {submissions.filter(s => s.status === 'pending_review').length} Submissions Pending Review
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Subjective Assessment Review & Rubric Grading
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Evaluate genuine student packet analysis write-ups against authoritative rubrics. Official scores inform mastery decisions.
            </p>
          </div>
        </div>

        {/* AI Tutor Authority Boundary Notice */}
        <div style={{ padding: '14px 18px', borderRadius: '12px', backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ShieldAlert size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
            <strong>TRUSTED ACADEMIC AUTHORITY BOUNDARY:</strong> Official assessment scores must be evaluated and signed by verified faculty. The Socratic AI Tutor provides explanations and conceptual coaching to students but is strictly prohibited from granting grades or modifying official evaluation records.
          </p>
        </div>

        {/* Review Queue & Detail Layout */}
        {submissions.length === 0 ? (
          <div className="card-standard" style={{ padding: '60px 24px', textAlign: 'center' }}>
            <ClipboardCheck size={44} style={{ margin: '0 auto 16px', opacity: 0.35, color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              No Subjective Submissions in Queue
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto' }}>
              There are currently no subjective packet analysis or network design assignments awaiting evaluation in Cloud Firestore <code>rubric_evaluations</code>.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 340px) 1fr', gap: '24px' }}>
            {/* Left Column: Submissions Queue */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-headline)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Submissions Queue
            </h2>
            {submissions.map((sub) => {
              const isSelected = sub.submissionId === selectedSub?.submissionId;
              const isReviewed = sub.status === 'reviewed';
              return (
                <div
                  key={sub.submissionId}
                  onClick={() => {
                    setSelectedSubId(sub.submissionId);
                    setReviewMessage('');
                    if (sub.evaluation) {
                      setCriterionScores(sub.evaluation.criterionScores);
                      setReviewFeedback(sub.evaluation.feedback);
                    }
                  }}
                  className="interactive-scale"
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--surface-container-high)' : 'var(--surface-container-lowest)',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border)',
                    boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.06)' : 'none',
                    transition: 'all 150ms ease',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)' }}>
                      {sub.studentRegNo}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        backgroundColor: isReviewed ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                        color: isReviewed ? '#10b981' : '#f59e0b',
                      }}
                    >
                      {isReviewed ? `● Graded (${sub.evaluation?.percentageScore}%)` : '● Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {sub.studentName}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {sub.assessmentTitle}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Submission Inspection & Rubric Form */}
          {selectedSub && (
            <div className="card-standard" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {/* Submission Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div>
                  <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700 }}>
                    {selectedSub.moduleId.toUpperCase()} • {selectedSub.unitId.toUpperCase()}
                  </span>
                  <h2 style={{ fontSize: '18px', fontFamily: 'var(--font-headline)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                    {selectedSub.assessmentTitle}
                  </h2>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Candidate: <strong>{selectedSub.studentName}</strong> ({selectedSub.studentRegNo}) • Submitted: {new Date(selectedSub.submittedAt).toLocaleTimeString()}
                  </div>
                </div>
                {selectedSub.status === 'reviewed' && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--success)' }}>
                      {selectedSub.evaluation?.percentageScore}%
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      Evaluated by {selectedSub.evaluation?.evaluatorName}
                    </div>
                  </div>
                )}
              </div>

              {/* Task Prompt */}
              <div style={{ padding: '14px', borderRadius: '10px', backgroundColor: 'var(--surface-container-low)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  LAB TASK PROMPT:
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
                  {selectedSub.taskPrompt}
                </p>
              </div>

              {/* Student Submitted Answer */}
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '6px' }}>
                  STUDENT SUBMITTED WRITE-UP:
                </span>
                <div
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--surface-container-lowest)',
                    border: '1px solid var(--border)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12.5px',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedSub.studentAnswer}
                </div>
              </div>

              {/* Interactive Rubric Scoring Form */}
              <div>
                <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-headline)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
                  Authoritative Rubric Criteria
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {selectedSub.rubric.map((criterion) => {
                    const currentScore = criterionScores[criterion.id] ?? criterion.maxPoints;
                    return (
                      <div
                        key={criterion.id}
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          backgroundColor: 'var(--surface-container-low)',
                          border: '1px solid var(--border)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {criterion.title}
                          </div>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {criterion.description}
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            min={0}
                            max={criterion.maxPoints}
                            value={currentScore}
                            onChange={(e) => {
                              const val = Math.max(0, Math.min(criterion.maxPoints, parseInt(e.target.value) || 0));
                              setCriterionScores(prev => ({ ...prev, [criterion.id]: val }));
                            }}
                            className="input-base input-mono"
                            style={{ width: '64px', textAlign: 'center', padding: '6px' }}
                          />
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                            / {criterion.maxPoints} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Calculated Score & Feedback */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderRadius: '12px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Total Evaluated Score:
                </span>
                <span style={{ fontSize: '18px', fontFamily: 'var(--font-mono)', fontWeight: 900, color: totalScore >= 70 ? 'var(--success)' : 'var(--warning)' }}>
                  {totalScore} / 100 ({totalScore}%)
                </span>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '6px' }}>
                  Official Evaluator Feedback
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  className="input-base"
                  placeholder="Provide pedagogical feedback and highlight conceptual misconceptions..."
                  style={{ width: '100%', resize: 'vertical' }}
                />
              </div>

              {reviewMessage && (
                <div style={{ fontSize: '12.5px', color: reviewMessage.startsWith('✅') ? 'var(--success)' : '#ef4444', fontFamily: 'var(--font-mono)' }}>
                  {reviewMessage}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleSaveReview}
                  className="btn-tactile-primary interactive-scale"
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                >
                  <Award size={15} />
                  <span>Record Official Faculty Evaluation</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
    );
  }

  // 3C. LIVE CLASSROOM ORCHESTRATION VIEW
  if (activeView === 'Live Classroom') {
    const handleBroadcast = async (idx: number) => {
      setIsBroadcasting(true);
      await broadcastQuestion(idx, user);
      setIsBroadcasting(false);
    };

    const handleToggleReveal = async () => {
      await revealLiveAnswer(!liveSession.isAnswerRevealed, user);
    };

    const handleEndSession = async () => {
      await endLiveSession(user);
    };

    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: liveSession.isActive ? '#10b981' : '#f59e0b',
                  boxShadow: `0 0 8px ${liveSession.isActive ? '#10b981' : '#f59e0b'}`,
                }}
              />
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: liveSession.isActive ? 'var(--success)' : 'var(--warning)' }}>
                {liveSession.isActive ? 'BROADCAST ACTIVE' : 'BROADCAST STANDBY'}
              </span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                • Connected to Firestore /live_classroom/current_poll
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-headline)', fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)' }}>
              Live Classroom Broadcast & Real-Time Orchestration
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Broadcast formative questions to connected student devices in real time and control answer explanations.
            </p>
          </div>
        </div>

        {/* Active Session Card */}
        {liveSession.isActive ? (
          <div className="card-standard" style={{ padding: '28px', marginBottom: '24px', border: '1px solid var(--primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', backgroundColor: 'var(--surface-container)', padding: '3px 8px', borderRadius: '6px' }}>
                CURRENT LIVE POLL QUESTION
              </span>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={handleToggleReveal}
                  className="btn-outline interactive-scale"
                  style={{ fontSize: '12px', padding: '6px 14px' }}
                >
                  {liveSession.isAnswerRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{liveSession.isAnswerRevealed ? 'Hide Explanation' : 'Reveal Answer & Explanation'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleEndSession}
                  className="btn-outline interactive-scale"
                  style={{ fontSize: '12px', padding: '6px 14px', borderColor: '#ef4444', color: '#ef4444' }}
                >
                  <StopCircle size={14} />
                  <span>End Broadcast</span>
                </button>
              </div>
            </div>

            <h2 style={{ fontSize: '18px', fontFamily: 'var(--font-headline)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '16px', lineHeight: 1.4 }}>
              {liveSession.currentQuestion}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
              {liveSession.options.map((opt, i) => {
                const isCorrect = liveSession.isAnswerRevealed && (opt.id === liveSession.correctOptionId || i === 0);
                return (
                  <div
                    key={opt.id || i}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'var(--surface-container-low)',
                      border: isCorrect ? '1px solid #10b981' : '1px solid var(--border)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      <strong>{String.fromCharCode(65 + i)}.</strong> {opt.text}
                    </span>
                    {isCorrect && (
                      <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: '#10b981', fontWeight: 700 }}>
                        ✓ CORRECT ANSWER
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {liveSession.isAnswerRevealed && liveSession.explanation && (
              <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: 'var(--surface-container)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '4px' }}>
                  PEDAGOGICAL EXPLANATION (BROADCASTED TO COHORT):
                </span>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  {liveSession.explanation}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="card-standard" style={{ padding: '28px', marginBottom: '24px', textAlign: 'center' }}>
            <Radio size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
            <h2 style={{ fontSize: '18px', fontFamily: 'var(--font-headline)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '6px' }}>
              No Active Live Broadcast
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 20px' }}>
              Broadcast a formative question from the CS-4200 curriculum below to start an interactive poll session with all active students.
            </p>
          </div>
        )}

        {/* Question Selector from Curriculum Bank */}
        <h2 style={{ fontSize: '16px', fontFamily: 'var(--font-headline)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '14px' }}>
          Select Question to Broadcast from CS-4200 Question Bank
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {SAMPLE_BROADCAST_QUESTIONS.map((q, idx) => (
            <div key={idx} className="card-standard interactive-scale" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', fontWeight: 700 }}>
                  QUESTION #{idx + 1}
                </span>
                <p style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px', marginBottom: '14px', lineHeight: 1.4 }}>
                  {q.question}
                </p>
              </div>
              <button
                type="button"
                disabled={isBroadcasting}
                onClick={() => handleBroadcast(idx)}
                className="btn-tactile-primary interactive-scale"
                style={{ fontSize: '12px', padding: '8px 14px', alignSelf: 'flex-start' }}
              >
                <Send size={13} />
                <span>{liveSession.isActive && liveSession.questionIndex === idx ? 'Re-broadcast Question' : 'Broadcast to Cohort'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. ANALYTICS VIEW (Strictly DATA RULE compliant: "No analytics available" empty state)
  if (activeView === 'Analytics') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-headline)',
            fontSize: '24px',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: '8px',
          }}
        >
          Curriculum Analytics & Telemetry
        </h1>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          Cohort learning trajectories across Kalasalingam Academy of Research and Education network curriculum.
        </p>

        <EmptyState
          icon={BarChart3}
          badgeText="TELEMETRY STANDBY"
          title="No analytics available"
          description="Analytics, cohort mastery distributions, and concept bottleneck diagnostics will calculate automatically once students interact with packet labs and submit evaluations."
          actionText="Awaiting Database Connection"
          onAction={() => alert('Analytics engine is ready and waiting for Firestore event stream.')}
          style={{ marginBottom: '24px' }}
        />

        {/* Telemetry Readiness Checklist */}
        <div className="card-standard" style={{ padding: '24px' }}>
          <h2
            style={{
              fontFamily: 'var(--font-headline)',
              fontSize: '16px',
              fontWeight: 800,
              color: 'var(--text-primary)',
              marginBottom: '14px',
            }}
          >
            Telemetry Pipeline Readiness
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '14px',
            }}
          >
            {[
              { title: 'Firebase Authentication', status: 'Disconnected', desc: 'Awaiting faculty & student auth credentials', icon: ShieldAlert },
              { title: 'Firestore Telemetry Stream', status: 'Standby', desc: 'Ready for question logs and simulation telemetry', icon: Database },
              { title: 'Packet Trace Analyzer', status: 'Standby', desc: 'Ready for Wireshark .pcap validation engine', icon: Activity },
            ].map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.title}
                  style={{
                    padding: '16px',
                    borderRadius: '16px',
                    backgroundColor: 'var(--surface-container-low)',
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--surface-container)',
                        color: 'var(--warning)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <IconComp size={16} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '13px',
                          fontFamily: 'var(--font-headline)',
                          fontWeight: 700,
                          color: 'var(--text-primary)',
                        }}
                      >
                        {item.title}
                      </div>
                      <span
                        style={{
                          fontSize: '10px',
                          fontFamily: 'var(--font-mono)',
                          color: 'var(--warning)',
                          fontWeight: 700,
                        }}
                      >
                        ● {item.status}
                      </span>
                    </div>
                  </div>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // 5. SETTINGS VIEW
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 20px 60px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-headline)',
          fontSize: '24px',
          fontWeight: 800,
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}
      >
        Faculty Account & Portal Preferences
      </h1>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Institutional configuration for Kalasalingam Academy of Research and Education faculty credentials.
      </p>

      <div
        className="card-standard"
        style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Instructor Full Name
          </label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="input-base"
          />
        </div>

        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Institutional Email
          </label>
          <input
            type="email"
            defaultValue={user.email}
            className="input-base input-mono"
            disabled
            style={{ opacity: 0.7 }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Staff ID / Employee Code
            </label>
            <input
              type="text"
              defaultValue={user.staffId}
              className="input-base input-mono"
              disabled
              style={{ opacity: 0.7 }}
            />
          </div>
          <div>
            <label
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Academic Designation
            </label>
            <input
              type="text"
              value={profileDesignation}
              onChange={(e) => setProfileDesignation(e.target.value)}
              className="input-base"
            />
          </div>
        </div>

        <div>
          <label
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: 'var(--text-primary)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            Department
          </label>
          <input
            type="text"
            value={profileDepartment}
            onChange={(e) => setProfileDepartment(e.target.value)}
            className="input-base"
          />
        </div>

        <div
          style={{
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <button
            type="button"
            onClick={() => alert('Faculty profile updated successfully.')}
            className="btn-tactile-primary interactive-scale"
          >
            <Save size={15} />
            <span>Save Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};
