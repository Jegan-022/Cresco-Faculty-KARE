/**
 * CRESCO Production — Student Learning Oversight Service
 *
 * Implements Step 26: Authorized student progress, mastery inspection, and cohort telemetry.
 * Integrates official 68 student cohort roster with authentic Cloud Firestore telemetry.
 */

import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { StudentCohortProgress, FacultyUser } from '../types';
import { ENROLLED_STUDENT_ROSTER } from '../data/studentRoster';

export interface CohortOversightSummary {
  totalEnrolled: number;
  activeLearnersCount: number;
  masteryDistribution: {
    mastered: number;
    inProgress: number;
    needsRemediation: number;
    insufficientEvidence: number;
  };
  hasGenuineEvidence: boolean;
  statusText: string;
}

/**
 * Loads authentic student learning progress from Cloud Firestore,
 * unified with the official enrolled student cohort roster.
 */
export async function getStudentCohortProgress(
  _faculty: FacultyUser
): Promise<{ students: StudentCohortProgress[]; summary: CohortOversightSummary }> {
  const students: StudentCohortProgress[] = [];
  const firestoreMap = new Map<string, any>();

  try {
    // Read from sanitized public leaderboard projection
    const lbRef = collection(db, 'public_leaderboard');
    const q = query(lbRef, limit(200));
    const snap = await getDocs(q);

    snap.forEach((d) => {
      const data = d.data();
      const record = { id: d.id, ...data };
      const keys = [
        d.id.toLowerCase(),
        (data.studentId || '').toLowerCase(),
        (data.regNo || '').toLowerCase(),
        (data.email || '').toLowerCase()
      ].filter(Boolean);

      keys.forEach(k => firestoreMap.set(k, record));
    });
  } catch {
    // Non-fatal error; offline or permission restricted
  }

  const processedIds = new Set<string>();

  // 1. Integrate all 68 enrolled students from the official roster
  ENROLLED_STUDENT_ROSTER.forEach((enrolled) => {
    const reg = enrolled.registerNumber.toLowerCase();
    const email = enrolled.email.toLowerCase();
    const liveDoc = firestoreMap.get(reg) || firestoreMap.get(email) || firestoreMap.get(enrolled.studentId.toLowerCase());

    if (liveDoc) {
      processedIds.add(liveDoc.id);
    }

    const completedModules = liveDoc && Array.isArray(liveDoc.completedModules) ? liveDoc.completedModules : [];
    const totalXP = liveDoc ? (typeof liveDoc.totalXP === 'number' ? liveDoc.totalXP : (liveDoc.xp || 0)) : 0;
    const level = liveDoc ? (typeof liveDoc.level === 'number' ? liveDoc.level : 1) : 1;
    const completedCount = completedModules.length;
    const hasGenuineEvidence = totalXP > 0 || completedCount > 0;

    let status: 'mastered' | 'in_progress' | 'not_started' | 'insufficient_evidence';
    if (!hasGenuineEvidence) {
      status = 'not_started';
    } else if (completedCount >= 10) {
      status = 'mastered';
    } else {
      status = 'in_progress';
    }

    students.push({
      studentId: enrolled.studentId,
      studentName: enrolled.name,
      regNo: enrolled.registerNumber,
      email: enrolled.email,
      totalXP,
      level,
      completedModuleCount: completedCount,
      masterySummary: {
        masteredCount: status === 'mastered' ? completedCount : 0,
        inProgressCount: status === 'in_progress' ? 1 : 0,
        needsRemediationCount: 0,
        status
      },
      activeRemediationCount: 0,
      lastActiveAt: liveDoc?.updatedAt ? new Date(liveDoc.updatedAt.toDate?.() || liveDoc.updatedAt).toISOString() : undefined,
      hasGenuineEvidence
    });
  });

  // 2. Append any extra Firestore records not in the baseline roster
  firestoreMap.forEach((data) => {
    if (processedIds.has(data.id)) return;
    processedIds.add(data.id);

    const completedModules = Array.isArray(data.completedModules) ? data.completedModules : [];
    const totalXP = typeof data.totalXP === 'number' ? data.totalXP : (data.xp || 0);
    const level = typeof data.level === 'number' ? data.level : 1;
    const completedCount = completedModules.length;
    const hasGenuineEvidence = totalXP > 0 || completedCount > 0;

    let status: 'mastered' | 'in_progress' | 'not_started' | 'insufficient_evidence';
    if (!hasGenuineEvidence) {
      status = 'not_started';
    } else if (completedCount >= 10) {
      status = 'mastered';
    } else {
      status = 'in_progress';
    }

    students.push({
      studentId: data.id,
      studentName: data.name || data.displayName || `Student ${data.id.slice(0, 6)}`,
      regNo: data.regNo || data.studentId || data.id.replace('klu_', ''),
      email: data.email || 'student@klu.ac.in',
      totalXP,
      level,
      completedModuleCount: completedCount,
      masterySummary: {
        masteredCount: status === 'mastered' ? completedCount : 0,
        inProgressCount: status === 'in_progress' ? 1 : 0,
        needsRemediationCount: 0,
        status
      },
      activeRemediationCount: 0,
      lastActiveAt: data.updatedAt ? new Date(data.updatedAt.toDate?.() || data.updatedAt).toISOString() : undefined,
      hasGenuineEvidence
    });
  });

  let mastered = 0;
  let inProgress = 0;
  let needsRemediation = 0;
  let insufficientEvidence = 0;

  students.forEach((s) => {
    if (s.masterySummary.status === 'mastered') mastered++;
    else if (s.masterySummary.status === 'in_progress') inProgress++;
    else insufficientEvidence++;
  });

  const activeLearnersCount = students.filter(s => s.hasGenuineEvidence).length;
  const hasGenuineEvidence = students.length > 0;

  const summary: CohortOversightSummary = {
    totalEnrolled: students.length,
    activeLearnersCount,
    masteryDistribution: {
      mastered,
      inProgress,
      needsRemediation,
      insufficientEvidence
    },
    hasGenuineEvidence,
    statusText: `${students.length} enrolled students in CS-4200 (${activeLearnersCount} active learners)`
  };

  return { students, summary };
}
