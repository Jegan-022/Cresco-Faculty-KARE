/**
 * CRESCO Production — Faculty Subjective Assessment Review Service
 *
 * Implements Step 26: Assessment review queue and rubric grading for subjective responses.
 *
 * Invariants:
 * 1. Automatic objective scoring remains separate from faculty subjective grading.
 * 2. AI Tutor is strictly prohibited from granting grades or official reviews (TRUSTED_AI_AUTHORITY_BOUNDARY).
 * 3. Enforces that only verified faculty (isVerifiedFaculty == true) can record evaluation outcomes.
 * 4. Transparently records evaluator ID, rubric criteria scores, total points, and feedback.
 */

import type { 
  SubjectiveAssessmentSubmission, 
  SubjectiveEvaluationResult, 
  FacultyUser 
} from '../types';

export const STANDARD_NETWORKING_RUBRIC = [
  {
    id: 'crit_protocol_accuracy',
    title: 'Protocol Header & Flag Accuracy',
    description: 'Accurate identification of TCP flags (SYN, ACK, FIN), sequence number byte offsets, and checksum integrity.',
    maxPoints: 30
  },
  {
    id: 'crit_architectural_rationale',
    title: 'Subnetting & Topology Architecture',
    description: 'Correct VLSM host allocation, non-overlapping subnet prefix boundaries, and gateway routing path correctness.',
    maxPoints: 35
  },
  {
    id: 'crit_diagnostic_depth',
    title: 'Diagnostic Depth & Misconception Analysis',
    description: 'Thorough explanation of root causes, packet loss mechanisms, or routing loop prevention principles.',
    maxPoints: 35
  }
];

// Seed submissions representing genuine subjective packet analysis assignments
const INITIAL_SUBMISSIONS: SubjectiveAssessmentSubmission[] = [
  {
    submissionId: 'sub_pkt_99240041001_01',
    studentId: 'klu_99240041001',
    studentName: 'Priya Sharma',
    studentRegNo: '99240041001',
    assessmentId: 'lab_wireshark_tcp_handshake',
    assessmentTitle: 'Lab 04: Wireshark TCP 3-Way Handshake & Sequence Analysis',
    unitId: 'unit_4',
    moduleId: 'u4_m04',
    taskPrompt: 'Analyze the captured .pcap trace for connection setup between client 192.168.1.45:51234 and server 10.0.0.1:443. Document the Initial Sequence Numbers (ISNs), explain why SYN cookies are used, and verify the relative ACK numbers.',
    studentAnswer: 'In Frame 1, the client sends a SYN packet with relative seq=0 (raw ISN: 0x3F8A2109) and MSS=1460. In Frame 2, the server responds with SYN-ACK, setting seq=0 (raw ISN: 0x82BC14DF) and acknowledging the client with ack=1 (client ISN + 1). In Frame 3, the client completes the 3-way handshake with ACK acknowledging the server with ack=1. SYN cookies prevent resource exhaustion on the server during SYN flood attacks by encoding connection state in the initial sequence number rather than allocating a transmission control block (TCB) in memory.',
    submittedAt: '2026-10-18T14:32:00.000Z',
    status: 'pending_review',
    rubric: STANDARD_NETWORKING_RUBRIC
  },
  {
    submissionId: 'sub_pkt_99240041042_02',
    studentId: 'klu_99240041042',
    studentName: 'Karthik Raja',
    studentRegNo: '99240041042',
    assessmentId: 'lab_vlsm_design_scenario',
    assessmentTitle: 'Lab 02: VLSM Hierarchical Address Design for KARE Campus',
    unitId: 'unit_3',
    moduleId: 'u3_m06',
    taskPrompt: 'Given the network prefix 172.16.0.0/16, design a VLSM scheme supporting: Engineering (1200 hosts), Science (600 hosts), Admin (250 hosts), and 4 point-to-point router links. Specify subnet masks, network IDs, and broadcast addresses.',
    studentAnswer: '1. Engineering (1200 hosts needed): Allocate /21 (supports 2046 hosts). Network: 172.16.0.0/21. Usable: 172.16.0.1 to 172.16.7.254. Broadcast: 172.16.7.255.\n2. Science (600 hosts needed): Allocate /22 (supports 1022 hosts). Network: 172.16.8.0/22. Usable: 172.16.8.1 to 172.16.11.254. Broadcast: 172.16.11.255.\n3. Admin (250 hosts needed): Allocate /24 (supports 254 hosts). Network: 172.16.12.0/24. Usable: 172.16.12.1 to 172.16.12.254. Broadcast: 172.16.12.255.\n4. Router Links: Allocate /30 subnets: Link1: 172.16.13.0/30, Link2: 172.16.13.4/30, Link3: 172.16.13.8/30, Link4: 172.16.13.12/30.',
    submittedAt: '2026-10-18T15:10:00.000Z',
    status: 'pending_review',
    rubric: STANDARD_NETWORKING_RUBRIC
  }
];

// In-memory review repository for runtime state
let activeSubmissions: SubjectiveAssessmentSubmission[] = [...INITIAL_SUBMISSIONS];

/**
 * Retrieves all subjective assessment submissions.
 */
export function getSubmissions(filter?: { status?: 'pending_review' | 'reviewed'; unitId?: string }): SubjectiveAssessmentSubmission[] {
  let list = [...activeSubmissions];
  if (filter?.status) {
    list = list.filter(s => s.status === filter.status);
  }
  if (filter?.unitId) {
    list = list.filter(s => s.unitId === filter.unitId);
  }
  return list;
}

/**
 * Retrieves a specific submission by its ID.
 */
export function getSubmissionById(submissionId: string): SubjectiveAssessmentSubmission | null {
  return activeSubmissions.find(s => s.submissionId === submissionId) || null;
}

/**
 * Evaluates a subjective submission against the rubric.
 * Strictly checks faculty authorization. AI Tutor is prohibited from invoking this.
 */
export function evaluateSubjectiveSubmission(
  submissionId: string,
  faculty: FacultyUser,
  criterionScores: Record<string, number>,
  feedback: string
): { success: boolean; evaluation?: SubjectiveEvaluationResult; error?: string } {
  // 1. Authorization check
  if (!faculty || !faculty.isVerifiedFaculty) {
    return {
      success: false,
      error: 'UNAUTHORIZED: Only verified faculty instructors can record official assessment evaluations.'
    };
  }

  // 2. Submission existence
  const submissionIndex = activeSubmissions.findIndex(s => s.submissionId === submissionId);
  if (submissionIndex === -1) {
    return {
      success: false,
      error: `Submission not found: ${submissionId}`
    };
  }

  const submission = activeSubmissions[submissionIndex];

  // 3. Rubric Score Validation
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const criterion of submission.rubric) {
    maxPossibleScore += criterion.maxPoints;
    const score = criterionScores[criterion.id];
    if (typeof score !== 'number' || score < 0 || score > criterion.maxPoints) {
      return {
        success: false,
        error: `Invalid score for criterion "${criterion.title}". Must be between 0 and ${criterion.maxPoints} pts.`
      };
    }
    totalScore += score;
  }

  const percentageScore = Math.round((totalScore / maxPossibleScore) * 100);

  const evaluationResult: SubjectiveEvaluationResult = {
    evaluatorId: faculty.staffId || faculty.id,
    evaluatorName: faculty.name,
    criterionScores,
    totalScore,
    maxPossibleScore,
    percentageScore,
    feedback: feedback.trim() || 'Reviewed and evaluated against standard grading rubric.',
    evaluatedAt: new Date().toISOString()
  };

  // 4. Update submission state immutably
  activeSubmissions[submissionIndex] = {
    ...submission,
    status: 'reviewed',
    evaluation: evaluationResult
  };

  // 5. Notify downstream listeners if in browser environment
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('cresco:subjective-evaluation-completed', {
      detail: {
        submissionId,
        studentId: submission.studentId,
        evaluation: evaluationResult
      }
    }));
  }

  return {
    success: true,
    evaluation: evaluationResult
  };
}
