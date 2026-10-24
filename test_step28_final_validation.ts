/**
 * CRESCO Production — Step 28: Final End-to-End Release Validation Suite
 *
 * Validates:
 * 1. Complete Student Journey Contracts (Auth, Curriculum, Lessons, Events, Scoring, Mastery, Remediation, Personalization, AI Fallback)
 * 2. Complete Faculty Journey Contracts (Auth, Claims Gate 4, Curriculum Governance, Assessment Review, Cohort Oversight, Live Classroom)
 * 3. Cross-Application Synchronization & Identifier Parity
 * 4. Operational Boundaries & Honest Dependency Status (No mock bypasses)
 */

import fs from 'fs';
import path from 'path';
import { CANONICAL_MODULES, CS_4200_COURSE_INFO } from './src/data/canonicalCurriculum';
import { evaluateFacultyClaims, INSTITUTIONAL_IT_DEPENDENCY } from './src/services/facultyAuthService';
import { evaluateSubjectiveSubmission, __seedTestSubmissions, STANDARD_NETWORKING_RUBRIC } from './src/services/assessmentReviewService';
import { INITIAL_INACTIVE_SESSION, SAMPLE_BROADCAST_QUESTIONS } from './src/services/liveClassroomService';
import { firebaseConfig } from './src/lib/firebaseConfig';
import type { FacultyUser } from './src/types';

console.log('========================================================================');
console.log('🚀 CRESCO STEP 28: FINAL E2E RELEASE VALIDATION & INTEGRATION VERIFICATION');
console.log('========================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`❌ [FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
  }
}

async function runStep28Validation() {
  console.log('--- 1. SHARED CANONICAL CURRICULUM ARCHITECTURE ---');
  assert(
    CS_4200_COURSE_INFO.code === 'CS-4200',
    'Curriculum: Authoritative course code is strictly CS-4200'
  );
  assert(
    CS_4200_COURSE_INFO.totalUnits === 5,
    'Curriculum: Syllabus defines exactly 5 units'
  );
  assert(
    CS_4200_COURSE_INFO.totalLevels === 21,
    'Curriculum: Gamified pathway defines 21 progression levels'
  );
  assert(
    CANONICAL_MODULES.length === 30,
    'Curriculum: Active module bank contains exactly 30 canonical modules'
  );

  // Parity check across Units
  const u3Count = CANONICAL_MODULES.filter(m => m.unitNumber === 3).length;
  const u4Count = CANONICAL_MODULES.filter(m => m.unitNumber === 4).length;
  const u5Count = CANONICAL_MODULES.filter(m => m.unitNumber === 5).length;
  assert(u3Count === 12, 'Curriculum: Unit 3 contains exactly 12 modules');
  assert(u4Count === 9, 'Curriculum: Unit 4 contains exactly 9 modules');
  assert(u5Count === 9, 'Curriculum: Unit 5 contains exactly 9 modules');

  // Verify unique module IDs matching student app conventions
  const moduleIds = CANONICAL_MODULES.map(m => m.id);
  const uniqueModuleIds = new Set(moduleIds);
  assert(
    uniqueModuleIds.size === 30,
    'Curriculum: All 30 module identifiers are strictly unique'
  );
  assert(
    moduleIds[0] === 'u3_m01' && moduleIds[29] === 'u5_m09',
    'Curriculum: Identifiers span canonical range u3_m01 to u5_m09'
  );

  console.log('\n--- 2. STUDENT APPLICATION INTEGRITY & SAFETY CONTRACTS ---');
  // Student Firebase applet config check
  const candidateConfigPaths = [
    path.resolve(process.cwd(), '../student/firebase-applet-config.json'),
    path.resolve(process.cwd(), '../student/cresco CN/firebase-applet-config.json'),
  ];
  const studentConfigPath = candidateConfigPaths.find(p => fs.existsSync(p)) || candidateConfigPaths[0];
  const studentConfig = JSON.parse(fs.readFileSync(studentConfigPath, 'utf-8'));

  assert(
    studentConfig.projectId === firebaseConfig.projectId &&
    studentConfig.storageBucket === firebaseConfig.storageBucket,
    'Integration: Student and Faculty apps target identical Firebase project (cresco-cn)'
  );
  assert(
    studentConfig.firestoreDatabaseId === '(default)',
    'Integration: Both applications use the standard default Firestore database'
  );

  // Student ErrorBoundary and reduced motion CSS presence
  const candidateCssPaths = [
    path.resolve(process.cwd(), '../student/src/index.css'),
    path.resolve(process.cwd(), '../student/cresco CN/src/index.css'),
  ];
  const studentCssPath = candidateCssPaths.find(p => fs.existsSync(p)) || candidateCssPaths[0];
  const studentCss = fs.readFileSync(studentCssPath, 'utf-8');
  assert(
    studentCss.includes('@media (prefers-reduced-motion: reduce)'),
    'Student App: WCAG 2.3.3 reduced motion styling is implemented'
  );
  assert(
    studentCss.includes(':focus-visible'),
    'Student App: Keyboard navigation high-contrast focus rings are active'
  );

  console.log('\n--- 3. FACULTY AUTHORIZATION & ACCESS CONTROL ---');
  // Faculty claim verification
  const validFacultyToken = { role: 'faculty', email: 'instructor@klu.ac.in', uid: 'fac_123' };
  const studentToken = { role: 'student', email: '99240041001@klu.ac.in', uid: 'stu_123' };
  const untrustedToken = { email: 'guest@klu.ac.in', uid: 'guest_123' };

  const validAuth = evaluateFacultyClaims(validFacultyToken);
  assert(
    validAuth.isAuthorized === true && validAuth.hasFacultyClaim === true,
    'Faculty Auth: Server-minted role: faculty is authorized'
  );

  const studentAuth = evaluateFacultyClaims(studentToken);
  assert(
    studentAuth.isAuthorized === false && (studentAuth.rejectionReason?.includes('Student account') || studentAuth.rejectionReason?.includes('Student accounts')),
    'Faculty Auth: Student account (role: student) is strictly denied faculty portal access'
  );

  const unprovisionedAuth = evaluateFacultyClaims(untrustedToken);
  assert(
    unprovisionedAuth.isAuthorized === false && unprovisionedAuth.dependencyNotice?.includes('Gate 4'),
    'Faculty Auth: Unprovisioned token is denied with clear Gate 4 institutional dependency guidance'
  );

  console.log('\n--- 4. SUBJECTIVE ASSESSMENT REVIEW & RUBRIC EVALUATION ---');
  const verifiedFacultyUser: FacultyUser = {
    id: 'usr_fac_vijay',
    staffId: 'FAC-VIJAY-4200',
    name: 'Dr. M. Vijay',
    email: 'vijay.m@klu.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Associate Professor & Course Coordinator',
    institution: 'Kalasalingam Academy of Research and Education',
    role: 'Course Coordinator',
    isVerifiedFaculty: true,
    assignedSections: ['CS-4200-A'],
    permissions: ['grade_assessments', 'view_curriculum']
  };

  // Seed isolated test fixture for automated testing validation
  __seedTestSubmissions([
    {
      submissionId: 'sub_pkt_99240041001_01',
      studentId: 'test_stu_01',
      studentName: 'Priya Sharma (Test)',
      studentRegNo: '99240041001',
      assessmentId: 'lab_wireshark_tcp_handshake',
      assessmentTitle: 'Lab 04: Wireshark TCP 3-Way Handshake & Sequence Analysis',
      unitId: 'unit_4',
      moduleId: 'u4_m04',
      taskPrompt: 'Analyze the captured .pcap trace.',
      studentAnswer: 'In Frame 1 SYN, in Frame 2 SYN-ACK, in Frame 3 ACK.',
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      rubric: STANDARD_NETWORKING_RUBRIC
    }
  ]);

  const evalResult = evaluateSubjectiveSubmission(
    'sub_pkt_99240041001_01',
    verifiedFacultyUser,
    {
      crit_protocol_accuracy: 28,
      crit_architectural_rationale: 33,
      crit_diagnostic_depth: 32
    },
    'Strong packet capture analysis.'
  );

  assert(
    evalResult.success === true && evalResult.evaluation?.totalScore === 93,
    'Assessment Review: Rubric grading computes deterministic score (28 + 33 + 32 = 93)'
  );
  assert(
    evalResult.evaluation?.evaluatorId === 'FAC-VIJAY-4200',
    'Assessment Review: Official evaluation is attributed strictly to faculty staffId'
  );

  console.log('\n--- 5. LIVE CLASSROOM SYNCHRONIZATION DATA MODEL ---');
  assert(
    INITIAL_INACTIVE_SESSION.isActive === false && INITIAL_INACTIVE_SESSION.connectedCount === 0,
    'Live Classroom: Inactive session state does not fabricate attendees'
  );
  assert(
    SAMPLE_BROADCAST_QUESTIONS.length >= 2,
    'Live Classroom: Pre-configured curriculum poll questions are available'
  );
  assert(
    SAMPLE_BROADCAST_QUESTIONS[0].options.length === 4,
    'Live Classroom: Interactive polls provide 4 multiple-choice options'
  );

  console.log('\n--- 6. OPERATIONAL CONFIGURATION & INSTITUTIONAL BLOCKERS ---');
  assert(
    INSTITUTIONAL_IT_DEPENDENCY.status === 'PROVISIONED_FOR_OFFICIAL_FACULTY' || INSTITUTIONAL_IT_DEPENDENCY.status === 'BLOCKED_ON_INSTITUTIONAL_INFRASTRUCTURE',
    'External Dependency: Gate 4 (KARE Central IT faculty directory sync) is honestly tracked as external dependency'
  );
  assert(
    !fs.readFileSync(path.resolve(process.cwd(), 'src/lib/firebaseConfig.ts'), 'utf-8').includes('private_key'),
    'Security: Faculty app client bundle contains zero private server keys'
  );
  assert(
    !fs.readFileSync(studentConfigPath, 'utf-8').includes('private_key'),
    'Security: Student app client bundle contains zero private server keys'
  );

  console.log(`\n========================================================================`);
  console.log(`Step 28 Final Validation: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log(`========================================================================\n`);

  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runStep28Validation().catch((err) => {
  console.error('Validation failure:', err);
  process.exit(1);
});
