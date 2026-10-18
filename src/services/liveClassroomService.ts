/**
 * CRESCO Production — Faculty Live Classroom Orchestration Service
 *
 * Implements Step 26: Live classroom session management, polling broadcast, and answer reveals.
 *
 * Invariants:
 * 1. Synchronized with the student app via Firestore collection: /live_classroom/current_poll.
 * 2. Never fabricates active attendees, fake votes, or manufactured sessions.
 * 3. Shows honest "No broadcast in progress" state when session is inactive.
 * 4. Requires verified faculty authority to broadcast questions or reveal answers.
 */

import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { LiveClassroomSessionState, FacultyUser } from '../types';

export const SAMPLE_BROADCAST_QUESTIONS = [
  {
    question: 'A router receives an IPv4 datagram with TTL = 1. What action does the router take?',
    options: [
      { id: 'opt_a', text: 'Decrements TTL to 0, drops packet, and sends ICMP Time Exceeded (Type 11) to source' },
      { id: 'opt_b', text: 'Forwards the packet normally and lets the destination drop it' },
      { id: 'opt_c', text: 'Increments TTL to 255 to prevent packet loss' },
      { id: 'opt_d', text: 'Buffers the packet indefinitely until a new route converges' },
    ],
    correctOptionId: 'opt_a',
    explanation: 'When a router receives an IP datagram with TTL = 1, decrementing it yields 0. The router must discard the packet and generate an ICMP Time Exceeded message back to the sender, preventing infinite loops.'
  },
  {
    question: 'In TCP, why does a connection remain in the TIME-WAIT state for 2MSL before fully closing?',
    options: [
      { id: 'opt_a', text: 'To allow the receiver to finish draining its playback buffer' },
      { id: 'opt_b', text: 'To ensure delayed duplicate segments expire and the final ACK is acknowledged' },
      { id: 'opt_c', text: 'To negotiate a new maximum segment size (MSS) for the next connection' },
      { id: 'opt_d', text: 'To recalculate the Jacobson/Karels smoothed round-trip time (SRTT)' },
    ],
    correctOptionId: 'opt_b',
    explanation: '2MSL (Maximum Segment Lifetime) ensures that any lingering duplicate packets from the connection dissipate in the network, preventing them from corrupting future connections on the same socket pair.'
  }
];

export const INITIAL_INACTIVE_SESSION: LiveClassroomSessionState = {
  isActive: false,
  sessionId: 'none',
  courseId: 'cs-4200',
  instructorId: '',
  instructorName: '',
  currentQuestion: 'No broadcast question currently active.',
  options: [],
  explanation: '',
  isAnswerRevealed: false,
  questionIndex: 0,
  connectedCount: 0,
  totalEnrolled: 0,
  updatedAt: new Date().toISOString()
};

/**
 * Subscribes to real-time live classroom poll state from Firestore.
 */
export function subscribeToLiveClassroom(
  onUpdate: (session: LiveClassroomSessionState) => void
): () => void {
  try {
    const pollDocRef = doc(db, 'live_classroom', 'current_poll');
    return onSnapshot(
      pollDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onUpdate({
            isActive: data.isActive ?? false,
            sessionId: data.sessionId || 'current_poll',
            courseId: data.courseId || 'cs-4200',
            instructorId: data.instructorId || '',
            instructorName: data.instructorName || '',
            currentQuestion: data.currentQuestion || 'No active question',
            options: Array.isArray(data.options)
              ? data.options.map((opt: any, idx: number) => 
                  typeof opt === 'string' ? { id: `opt_${idx}`, text: opt } : opt
                )
              : [],
            explanation: data.explanation || '',
            correctOptionId: data.correctOptionId,
            isAnswerRevealed: data.isAnswerRevealed ?? false,
            questionIndex: data.questionIndex ?? 0,
            connectedCount: data.connectedCount ?? 0,
            totalEnrolled: data.totalEnrolled ?? 0,
            updatedAt: data.updatedAt || new Date().toISOString()
          });
        } else {
          onUpdate(INITIAL_INACTIVE_SESSION);
        }
      },
      (err) => {
        console.warn('[LiveClassroomService] Firestore snapshot error:', err);
        onUpdate(INITIAL_INACTIVE_SESSION);
      }
    );
  } catch {
    onUpdate(INITIAL_INACTIVE_SESSION);
    return () => {};
  }
}

/**
 * Broadcasts a live question to all connected students.
 */
export async function broadcastQuestion(
  questionIndex: number,
  faculty: FacultyUser
): Promise<{ success: boolean; error?: string }> {
  if (!faculty || !faculty.isVerifiedFaculty) {
    return {
      success: false,
      error: 'UNAUTHORIZED: Only verified faculty can broadcast live classroom questions.'
    };
  }

  const selected = SAMPLE_BROADCAST_QUESTIONS[questionIndex % SAMPLE_BROADCAST_QUESTIONS.length];
  const pollDocRef = doc(db, 'live_classroom', 'current_poll');

  const payload = {
    isActive: true,
    sessionId: `session_${Date.now()}`,
    courseId: 'cs-4200',
    instructorId: faculty.staffId || faculty.id,
    instructorName: faculty.name,
    currentQuestion: selected.question,
    options: selected.options.map(o => o.text), // Format expected by Student LiveClassroomView
    explanation: selected.explanation,
    correctOptionId: selected.correctOptionId,
    isAnswerRevealed: false,
    questionIndex,
    connectedCount: 1, // At least the faculty broadcaster
    totalEnrolled: 66,
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(pollDocRef, payload);
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Toggles reveal of the answer and pedagogical explanation.
 */
export async function revealLiveAnswer(
  isRevealed: boolean,
  faculty: FacultyUser
): Promise<{ success: boolean; error?: string }> {
  if (!faculty || !faculty.isVerifiedFaculty) {
    return {
      success: false,
      error: 'UNAUTHORIZED: Only verified faculty can reveal live poll answers.'
    };
  }

  const pollDocRef = doc(db, 'live_classroom', 'current_poll');

  try {
    const existing = await getDoc(pollDocRef);
    if (!existing.exists()) {
      return { success: false, error: 'No active poll found to reveal.' };
    }
    await setDoc(pollDocRef, { ...existing.data(), isAnswerRevealed: isRevealed, updatedAt: new Date().toISOString() }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}

/**
 * Ends the active live broadcast session.
 */
export async function endLiveSession(
  faculty: FacultyUser
): Promise<{ success: boolean; error?: string }> {
  if (!faculty || !faculty.isVerifiedFaculty) {
    return {
      success: false,
      error: 'UNAUTHORIZED: Only verified faculty can end live classroom sessions.'
    };
  }

  const pollDocRef = doc(db, 'live_classroom', 'current_poll');

  try {
    await setDoc(pollDocRef, {
      isActive: false,
      currentQuestion: 'Session concluded by instructor.',
      options: [],
      isAnswerRevealed: false,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : String(err) };
  }
}
