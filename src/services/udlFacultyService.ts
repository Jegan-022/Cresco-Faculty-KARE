/**
 * CRESCO Faculty Portal — UDL Service
 * Handles authoritative creation, assignment, rubric grading, and Firestore persistence for UDL activities.
 */

import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { FacultyUser } from '../types';

export interface UdlActivity {
  id: string;
  activityCode: string;
  courseId: string;
  moduleId: 'module_a_ipv4' | 'module_b_tcp_udp';
  title: string;
  description: string;
  learningObjectives: string[];
  udlDimensions: ('Representation' | 'Engagement' | 'Action_and_Expression')[];
  assignedSection: string;
  dueDate: string;
  maxPoints: number;
  published: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  rubricCriteria: {
    name: string;
    description: string;
    maxScore: number;
  }[];
}

export interface UdlStudentSubmission {
  id: string;
  activityId: string;
  moduleId: 'module_a_ipv4' | 'module_b_tcp_udp';
  modality: 'calculation' | 'interactive_sim' | 'written_explanation' | 'table_entry' | 'packet_analysis' | 'role_play';
  studentId: string;
  studentName: string;
  studentRegNo: string;
  studentEmail: string;
  answers: Record<string, any>;
  autoScore: number;
  maxScore: number;
  isEvaluated: boolean;
  facultyFeedback?: string;
  facultyRubricScores?: {
    representation?: number;
    engagement?: number;
    expression?: number;
  };
  evaluatedBy?: string;
  evaluatedAt?: string;
  submittedAt: string;
  updatedAt: string;
}

export const CANONICAL_UDL_ACTIVITIES: UdlActivity[] = [
  {
    id: 'udl_act_sub_192',
    activityCode: 'UDL-NET-01',
    courseId: 'CS-4200',
    moduleId: 'module_a_ipv4',
    title: 'IPv4 Address Decomposition & 4-Subnet Partitioning',
    description: 'Students analyze 32-bit binary octets, calculate the /26 magic number, and partition 192.168.10.0/24 into 4 equal subnets.',
    learningObjectives: [
      'Deconstruct 32-bit IPv4 address into Network and Host fields',
      'Compute subnet mask and block increment for borrowed bits',
      'Derive valid first/last usable host addresses without overlapping'
    ],
    udlDimensions: ['Representation', 'Engagement', 'Action_and_Expression'],
    assignedSection: 'All Sections (CS-4200-A, B, C)',
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0],
    maxPoints: 100,
    published: true,
    createdBy: 'course_coordinator',
    createdByName: 'Dr. Jeganathan (Course Coordinator)',
    createdAt: new Date().toISOString(),
    rubricCriteria: [
      { name: 'Representation & Mathematical Accuracy', description: 'Correct binary-to-decimal masks and boundary calculations', maxScore: 35 },
      { name: 'Engagement & Problem-Solving', description: 'Systematic deduction through progressive scaffolding tiers', maxScore: 35 },
      { name: 'Expression & Articulation', description: 'Clear structured explanation of broadcast and network IP roles', maxScore: 30 }
    ]
  },
  {
    id: 'udl_act_tcp_flow',
    activityCode: 'UDL-TRANS-01',
    courseId: 'CS-4200',
    moduleId: 'module_b_tcp_udp',
    title: 'TCP 3-Way Handshake, Packet Loss & Sliding Window Sandbox',
    description: 'Interactive sequence simulation of SYN/ACK exchange, cumulative ACK recovery for lost segment P3, and BDP window throughput sizing.',
    learningObjectives: [
      'Trace ISN exchange and socket state transitions to ESTABLISHED',
      'Analyze cumulative ACK and 3 duplicate ACK fast retransmit',
      'Evaluate BDP throughput formula: Throughput = Window / RTT'
    ],
    udlDimensions: ['Representation', 'Engagement', 'Action_and_Expression'],
    assignedSection: 'All Sections (CS-4200-A, B, C)',
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString().split('T')[0],
    maxPoints: 100,
    published: true,
    createdBy: 'course_coordinator',
    createdByName: 'Dr. Jeganathan (Course Coordinator)',
    createdAt: new Date().toISOString(),
    rubricCriteria: [
      { name: 'Representation & Architectural Model', description: 'Accurate depiction of TCP packet headers and state machine', maxScore: 35 },
      { name: 'Engagement & Loss Diagnostics', description: 'Correct prediction of receiver ACK behavior during segment loss', maxScore: 35 },
      { name: 'Action & Expression', description: 'Rigorous calculation of BDP throughput ceilings and window scaling', maxScore: 30 }
    ]
  }
];

/**
 * Fetch all UDL activities from Firestore or return canonical curriculum
 */
export async function fetchUdlActivitiesFromFirestore(): Promise<UdlActivity[]> {
  try {
    const snap = await getDocs(collection(db, 'udl_activities'));
    const list: UdlActivity[] = [];
    snap.forEach(d => {
      list.push(d.data() as UdlActivity);
    });

    if (list.length > 0) return list;
  } catch (error) {
    console.warn('[UDL Faculty Service] Failed to fetch udl_activities from Firestore:', error);
  }

  return CANONICAL_UDL_ACTIVITIES;
}

/**
 * Save or publish a new UDL activity to Firestore
 */
export async function createOrAssignUdlActivity(
  activity: Omit<UdlActivity, 'id' | 'createdAt'>,
  facultyUser: FacultyUser
): Promise<UdlActivity> {
  const id = `udl_act_${Date.now()}`;
  const now = new Date().toISOString();

  const newRecord: UdlActivity = {
    ...activity,
    id,
    createdBy: facultyUser.id || facultyUser.email,
    createdByName: facultyUser.name || 'Faculty Instructor',
    createdAt: now
  };

  try {
    await setDoc(doc(db, 'udl_activities', id), {
      ...newRecord,
      serverCreatedAt: serverTimestamp()
    });

    // Record audit log
    await setDoc(doc(db, 'admin_audit_logs', `log_${Date.now()}`), {
      actorId: facultyUser.id || facultyUser.email,
      actorEmail: facultyUser.email,
      action: 'UDL_ACTIVITY_PUBLISHED',
      targetResource: `udl_activities/${id}`,
      metadata: { title: newRecord.title, assignedSection: newRecord.assignedSection },
      timestamp: now,
      serverTimestamp: serverTimestamp()
    });

    return newRecord;
  } catch (error) {
    console.error('[UDL Faculty Service] Failed to save UDL activity to Firestore:', error);
    return newRecord;
  }
}

/**
 * Fetch student submissions from Firestore `udl_submissions`
 */
export async function fetchUdlSubmissionsFromFirestore(): Promise<UdlStudentSubmission[]> {
  try {
    const snap = await getDocs(collection(db, 'udl_submissions'));
    const list: UdlStudentSubmission[] = [];
    snap.forEach(d => {
      list.push(d.data() as UdlStudentSubmission);
    });

    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return list;
  } catch (error) {
    console.warn('[UDL Faculty Service] Failed to fetch udl_submissions from Firestore:', error);
    return [];
  }
}

/**
 * Evaluate a student UDL submission with 3-part UDL rubric
 */
export async function evaluateUdlSubmission(
  submissionId: string,
  facultyUser: FacultyUser,
  rubricScores: { representation: number; engagement: number; expression: number },
  feedback: string
): Promise<{ success: boolean; totalScore: number; error?: string }> {
  const totalScore = (rubricScores.representation || 0) + (rubricScores.engagement || 0) + (rubricScores.expression || 0);
  const now = new Date().toISOString();

  try {
    const subRef = doc(db, 'udl_submissions', submissionId);
    await updateDoc(subRef, {
      isEvaluated: true,
      autoScore: totalScore,
      facultyFeedback: feedback,
      facultyRubricScores: rubricScores,
      evaluatedBy: facultyUser.email || facultyUser.name,
      evaluatedAt: now,
      updatedAt: now
    });

    // Audit log
    await setDoc(doc(db, 'admin_audit_logs', `log_${Date.now()}`), {
      actorId: facultyUser.id || facultyUser.email,
      actorEmail: facultyUser.email,
      action: 'UDL_SUBMISSION_EVALUATED',
      targetResource: `udl_submissions/${submissionId}`,
      metadata: { totalScore, rubricScores, studentFeedback: feedback },
      timestamp: now,
      serverTimestamp: serverTimestamp()
    });

    return { success: true, totalScore };
  } catch (error) {
    console.error('[UDL Faculty Service] Failed to update evaluation:', error);
    return { success: false, totalScore, error: String(error) };
  }
}
