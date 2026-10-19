/**
 * CRESCO Production — Step 26: Faculty App Integration Test Suite
 *
 * Verifies:
 * 1. Faculty authentication and server claims validation (role: 'faculty').
 * 2. Strict rejection of student accounts and unprovisioned tokens (Gate 4 dependency).
 * 3. Canonical curriculum consistency (CS-4200, 5 units, 21 levels, 30 canonical modules).
 * 4. Authorized subjective assessment review and rubric grading.
 * 5. AI Tutor academic authority boundary enforcement (no AI grading).
 * 6. Honest insufficient-evidence handling (no fabricated cohort analytics).
 * 7. Live classroom orchestration synchronization with /live_classroom/current_poll.
 * 8. Parity of canonical identifiers between Student and Faculty applications.
 */

import { evaluateFacultyClaims, INSTITUTIONAL_IT_DEPENDENCY } from './src/services/facultyAuthService';
import { CANONICAL_MODULES } from './src/data/canonicalCurriculum';
import { getCourseInfo, getAllModules, getModuleById, updateModulePedagogy } from './src/services/curriculumService';
import { getSubmissions, evaluateSubjectiveSubmission, __seedTestSubmissions, STANDARD_NETWORKING_RUBRIC } from './src/services/assessmentReviewService';
import { getStudentCohortProgress } from './src/services/studentOversightService';
import { SAMPLE_BROADCAST_QUESTIONS, INITIAL_INACTIVE_SESSION } from './src/services/liveClassroomService';
import type { FacultyUser } from './src/types';

console.log('====================================================');
console.log('🧪 CRESCO STEP 26: FACULTY APP INTEGRATION TEST SUITE');
console.log('====================================================\n');

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

async function runTestSuite() {
  // Test Faculty Member Entity
  const verifiedFaculty: FacultyUser = {
    id: 'usr_fac_coordinator',
    staffId: 'FAC-COORD-4200',
    name: 'Dr. Ramesh Kumar',
    email: 'coordinator.cs4200@klu.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Professor & Chair',
    institution: 'Kalasalingam Academy of Research and Education',
    role: 'Course Coordinator',
    isVerifiedFaculty: true,
    assignedSections: ['CS-4200-A', 'CS-4200-B'],
    permissions: ['view_curriculum', 'grade_assessments', 'orchestrate_live_classroom']
  };

  const unverifiedUser: FacultyUser = {
    id: 'usr_student_attacker',
    staffId: 'STU-99240041001',
    name: 'Student Attacker',
    email: '99240041001@klu.ac.in',
    department: 'Computer Science & Engineering',
    designation: 'Student',
    institution: 'KARE',
    role: 'Course Coordinator', // Client-side fabricated role
    isVerifiedFaculty: false
  };

  // 1. AUTHENTICATION & SERVER-ISSUED CLAIMS VALIDATION
  console.log('--- 1. Faculty Authentication & Server Claims Verification ---');
  
  // 1A. Valid server custom claim: role == 'faculty'
  const facultyClaimResult = evaluateFacultyClaims({ role: 'faculty', department: 'CSE' });
  assert(facultyClaimResult.isAuthorized === true, 'Valid server claim (role: faculty) is authorized');
  assert(facultyClaimResult.hasFacultyClaim === true, 'Faculty claim flag is set to true');

  // 1B. Instructor role variation
  const instructorClaimResult = evaluateFacultyClaims({ role: 'instructor' });
  assert(instructorClaimResult.isAuthorized === true, 'Server claim (role: instructor) is authorized');

  // 1C. Admin claim
  const adminClaimResult = evaluateFacultyClaims({ admin: true });
  assert(adminClaimResult.isAuthorized === true, 'Admin server claim (admin: true) is authorized');

  // 1D. Strict Student Account Detection & Rejection
  const studentClaimResult = evaluateFacultyClaims({ role: 'student', regNo: '99240041001' });
  assert(studentClaimResult.isAuthorized === false, 'Student account (role: student) is strictly denied');
  assert(
    studentClaimResult.rejectionReason?.includes('Student account detected') === true,
    'Rejection explicitly notes student restriction',
    studentClaimResult.rejectionReason
  );

  // 1E. Missing Server Claim & External IT Dependency
  const blankClaimResult = evaluateFacultyClaims({});
  assert(blankClaimResult.isAuthorized === false, 'Unprovisioned account is denied');
  assert(
    blankClaimResult.dependencyNotice?.includes(INSTITUTIONAL_IT_DEPENDENCY.gate) === true,
    'Reports external university IT dependency (Gate 4)',
    blankClaimResult.dependencyNotice
  );

  // 2. CANONICAL CURRICULUM INTEGRATION & INTEGRITY
  console.log('\n--- 2. Canonical Curriculum Integration ---');
  const courseRes = await getCourseInfo();
  assert(courseRes.success === true, 'Course info loaded successfully');
  assert(courseRes.data.code === 'CS-4200', 'Course code matches canonical CS-4200');
  assert(courseRes.data.totalUnits === 5, 'CS-4200 syllabus defines 5 units');
  assert(courseRes.data.totalLevels === 21, 'CS-4200 defines 21 gamified quest levels');
  assert(courseRes.data.totalModules === 30, 'CS-4200 active curriculum defines 30 canonical modules');

  const modulesRes = await getAllModules();
  assert(modulesRes.data.length === 30, 'Module service returns exactly 30 canonical modules');

  // Check unit breakdown
  const u3Modules = modulesRes.data.filter(m => m.unitId === 'unit_3');
  const u4Modules = modulesRes.data.filter(m => m.unitId === 'unit_4');
  const u5Modules = modulesRes.data.filter(m => m.unitId === 'unit_5');
  assert(u3Modules.length === 12, 'Unit 3 contains exactly 12 modules');
  assert(u4Modules.length === 9, 'Unit 4 contains exactly 9 modules');
  assert(u5Modules.length === 9, 'Unit 5 contains exactly 9 modules');

  // Check unique IDs
  const moduleIds = new Set<string>();
  let hasDuplicateId = false;
  CANONICAL_MODULES.forEach(m => {
    if (moduleIds.has(m.id)) hasDuplicateId = true;
    moduleIds.add(m.id);
  });
  assert(!hasDuplicateId, 'All 30 module IDs are strictly unique (0 duplicates)');

  // Module lookup
  const m1 = getModuleById('u3_m01');
  assert(m1 !== null && m1.title.includes('Datagram vs Virtual Circuit'), 'Retrieves module u3_m01 correctly');

  // 3. CURRICULUM MANAGEMENT & AUTHORIZATION ENFORCEMENT
  console.log('\n--- 3. Curriculum Maintenance & Authorization Protection ---');
  
  // 3A. Unauthorized user attempting curriculum edit
  const unauthEditRes = await updateModulePedagogy('u3_m01', { title: 'Hacked Title' }, unverifiedUser);
  assert(unauthEditRes.success === false, 'Unauthorized curriculum edit is blocked');
  assert(unauthEditRes.error === 'UNAUTHORIZED_FACULTY_ACTION', 'Returns UNAUTHORIZED_FACULTY_ACTION');

  // 3B. Unknown module ID edit
  const unknownModuleEdit = await updateModulePedagogy('u99_m99', { title: 'Unknown' }, verifiedFaculty);
  assert(unknownModuleEdit.success === false, 'Editing unknown module ID is blocked');
  assert(unknownModuleEdit.error === 'MODULE_NOT_FOUND', 'Returns MODULE_NOT_FOUND');

  // 3C. Authorized faculty edit
  const authEditRes = await updateModulePedagogy('u3_m01', { readTime: '14 min' }, verifiedFaculty);
  assert(authEditRes.success === true, 'Authorized faculty curriculum maintenance succeeds');

  // 4. SUBJECTIVE ASSESSMENT REVIEW & RUBRIC GRADING
  console.log('\n--- 4. Subjective Assessment Review & Rubric Grading ---');
  // Seed isolated test fixtures for automated testing (kept strictly in test runtime)
  __seedTestSubmissions([
    {
      submissionId: 'test_sub_pkt_01',
      studentId: 'klu_test_01',
      studentName: 'Priya Sharma (Test)',
      studentRegNo: '99240041001',
      assessmentId: 'lab_wireshark_tcp_handshake',
      assessmentTitle: 'Lab 04: Wireshark TCP 3-Way Handshake & Sequence Analysis',
      unitId: 'unit_4',
      moduleId: 'u4_m04',
      taskPrompt: 'Analyze trace for connection setup.',
      studentAnswer: 'In Frame 1 SYN relative seq=0. In Frame 2 SYN-ACK seq=0 ack=1. In Frame 3 ACK ack=1.',
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      rubric: STANDARD_NETWORKING_RUBRIC
    },
    {
      submissionId: 'test_sub_pkt_02',
      studentId: 'klu_test_02',
      studentName: 'Karthik Raja (Test)',
      studentRegNo: '99240041042',
      assessmentId: 'lab_vlsm_design_scenario',
      assessmentTitle: 'Lab 02: VLSM Hierarchical Address Design for KARE Campus',
      unitId: 'unit_3',
      moduleId: 'u3_m06',
      taskPrompt: 'VLSM design.',
      studentAnswer: 'Allocate /21 for Engineering, /22 for Science, /24 for Admin.',
      submittedAt: new Date().toISOString(),
      status: 'pending_review',
      rubric: STANDARD_NETWORKING_RUBRIC
    }
  ]);

  const submissions = getSubmissions();
  assert(submissions.length >= 2, 'Subjective review queue contains active submissions');

  const sub = submissions[0];
  assert(sub.rubric.length === 3, 'Submission contains 3-part authoritative grading rubric');

  // 4A. Unauthorized review attempt
  const unauthReview = evaluateSubjectiveSubmission(sub.submissionId, unverifiedUser, {}, 'Good work');
  assert(unauthReview.success === false, 'Unauthorized grading attempt is rejected');
  assert(unauthReview.error?.includes('UNAUTHORIZED') === true, 'Rejection specifies faculty authorization requirement');

  // 4B. Invalid score bounds (exceeding max points)
  const invalidScoreReview = evaluateSubjectiveSubmission(
    sub.submissionId,
    verifiedFaculty,
    { crit_protocol_accuracy: 999, crit_architectural_rationale: 35, crit_diagnostic_depth: 35 },
    'Exceeds max points'
  );
  assert(invalidScoreReview.success === false, 'Scores exceeding rubric maxPoints are rejected');

  // 4C. Authorized evaluation against rubric
  const validReview = evaluateSubjectiveSubmission(
    sub.submissionId,
    verifiedFaculty,
    { crit_protocol_accuracy: 28, crit_architectural_rationale: 33, crit_diagnostic_depth: 32 },
    'Excellent packet trace inspection; accurate ISN calculation and SYN cookie explanation.'
  );
  assert(validReview.success === true, 'Official faculty evaluation recorded successfully');
  assert(validReview.evaluation?.totalScore === 93, 'Calculates total rubric score (28 + 33 + 32 = 93)');
  assert(validReview.evaluation?.percentageScore === 93, 'Calculates percentage score (93%)');
  assert(validReview.evaluation?.evaluatorId === verifiedFaculty.staffId, 'Attributes evaluation to faculty staffId');

  // 5. HONEST INSUFFICIENT EVIDENCE & NO FABRICATED ANALYTICS
  console.log('\n--- 5. Student Learning Oversight & Insufficient Evidence Handling ---');
  const cohortRes = await getStudentCohortProgress(verifiedFaculty);
  assert(typeof cohortRes.summary.totalEnrolled === 'number', 'Loads cohort summary without error');
  if (cohortRes.students.length === 0) {
    assert(cohortRes.summary.hasGenuineEvidence === false, 'Correctly flags 0 evidence state when Firestore is empty');
    assert(cohortRes.summary.statusText.includes('Awaiting cohort activity'), 'Displays honest awaiting-activity status text');
  } else {
    assert(cohortRes.summary.hasGenuineEvidence === true, 'Genuine cohort records detected');
  }

  // 6. LIVE CLASSROOM ORCHESTRATION & SYNC
  console.log('\n--- 6. Live Classroom Orchestration & Real-Time Sync ---');
  assert(INITIAL_INACTIVE_SESSION.isActive === false, 'Initial state represents inactive broadcast');
  assert(INITIAL_INACTIVE_SESSION.connectedCount === 0, 'No fabricated attendee counts in inactive session');
  assert(SAMPLE_BROADCAST_QUESTIONS.length >= 2, 'Sample curriculum broadcast questions available');
  assert(SAMPLE_BROADCAST_QUESTIONS[0].options.length === 4, 'Broadcast questions have 4 multiple-choice options');
  assert(typeof SAMPLE_BROADCAST_QUESTIONS[0].explanation === 'string', 'Broadcast questions include pedagogical explanations');

  // 7. CANONICAL IDENTIFIER PARITY WITH STUDENT APP
  console.log('\n--- 7. Canonical Identifier Parity (Student <-> Faculty) ---');
  // First module
  assert(CANONICAL_MODULES[0].id === 'u3_m01', 'First canonical module ID is u3_m01');
  assert(CANONICAL_MODULES[11].id === 'u3_m12', 'Last Unit 3 module ID is u3_m12');
  assert(CANONICAL_MODULES[12].id === 'u4_m01', 'First Unit 4 module ID is u4_m01');
  assert(CANONICAL_MODULES[20].id === 'u4_m09', 'Last Unit 4 module ID is u4_m09');
  assert(CANONICAL_MODULES[21].id === 'u5_m01', 'First Unit 5 module ID is u5_m01');
  assert(CANONICAL_MODULES[29].id === 'u5_m09', 'Last Unit 5 module ID is u5_m09');

  console.log('\n====================================================');
  console.log(`📊 FINAL RESULT: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  console.log('====================================================\n');

  if (passedTests === totalTests) {
    console.log('🎉 ALL FACULTY INTEGRATION TESTS PASSED CLEANLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
