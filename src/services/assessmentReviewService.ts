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

import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
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

// In-memory review repository initialized to empty (no synthetic seed data)
let activeSubmissions: SubjectiveAssessmentSubmission[] = [];

/**
 * Test fixture injection for isolated automated testing suites.
 * Never called by production user interfaces.
 */
export function __seedTestSubmissions(fixtures: SubjectiveAssessmentSubmission[]): void {
  activeSubmissions = [...fixtures];
}

/**
 * Loads authentic submissions from Cloud Firestore rubric_evaluations
 */
export async function fetchSubmissionsFromFirestore(): Promise<SubjectiveAssessmentSubmission[]> {
  try {
    const qSnap = await getDocs(collection(db, 'rubric_evaluations'));
    const loaded: SubjectiveAssessmentSubmission[] = [];
    qSnap.forEach((d) => {
      const data = d.data();
      loaded.push({
        submissionId: d.id,
        studentId: data.studentId || d.id,
        studentName: data.studentName || 'Student',
        studentRegNo: data.studentRegNo || '99240041001',
        assessmentId: data.assessmentId || 'lab_networking',
        assessmentTitle: data.assessmentTitle || 'Networking Lab Evaluation',
        unitId: data.unitId || 'unit_4',
        moduleId: data.moduleId || 'u4_m04',
        taskPrompt: data.taskPrompt || 'Lab packet analysis submission.',
        studentAnswer: data.studentAnswer || '',
        submittedAt: data.submittedAt || new Date().toISOString(),
        status: data.isEvaluated ? 'reviewed' : 'pending_review',
        rubric: STANDARD_NETWORKING_RUBRIC,
        evaluation: data.isEvaluated ? {
          evaluatorId: data.evaluatorId || 'FAC-COORD-4200',
          evaluatorName: data.evaluatorName || 'Faculty Evaluator',
          criterionScores: data.criterionScores || {},
          totalScore: data.totalScore || 0,
          maxPossibleScore: 100,
          percentageScore: data.percentageScore || 0,
          feedback: data.feedback || '',
          evaluatedAt: data.evaluatedAt || new Date().toISOString()
        } : undefined
      });
    });
    activeSubmissions = loaded;
  } catch (err) {
    console.warn('[Assessment Review] Firestore load fallback:', err);
  }
  return activeSubmissions;
}

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

  // 5. Persist evaluation outcome to Cloud Firestore rubric_evaluations
  if (typeof window !== 'undefined') {
    try {
      setDoc(doc(db, 'rubric_evaluations', submissionId), {
        isEvaluated: true,
        evaluatorId: evaluationResult.evaluatorId,
        evaluatorName: evaluationResult.evaluatorName,
        criterionScores: evaluationResult.criterionScores,
        totalScore: evaluationResult.totalScore,
        percentageScore: evaluationResult.percentageScore,
        feedback: evaluationResult.feedback,
        evaluatedAt: evaluationResult.evaluatedAt
      }, { merge: true }).catch((err) => {
        console.warn('[Assessment Review] Firestore save error:', err);
      });
    } catch (err) {
      console.warn('[Assessment Review] Persistence error:', err);
    }
  }

  // 6. Notify downstream listeners if in browser environment
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
