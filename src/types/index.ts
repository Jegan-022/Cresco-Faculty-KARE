export type FacultyViewType = 
  | 'Dashboard' 
  | 'Students' 
  | 'Courses' 
  | 'Learning Levels' 
  | 'Assessment Review'
  | 'Live Classroom'
  | 'Analytics' 
  | 'Settings'
  | 'Admin Portal';

export interface FacultyUser {
  id: string; // Firebase Auth UID or institutional staffId
  name: string;
  email: string;
  department: string;
  designation: string;
  institution: string;
  role: 'Course Coordinator' | 'Lab Faculty' | 'Assistant Professor' | 'Professor';
  avatar?: string;
  staffId: string;
  isVerifiedFaculty?: boolean;
  assignedSections?: string[];
  permissions?: string[];
}

export type FacultyAuthStatus = 
  | 'loading' 
  | 'signed_out' 
  | 'authorized' 
  | 'unauthorized' 
  | 'session_expired';

export interface FacultyAuthorizationInfo {
  isAuthorized: boolean;
  role: string | null;
  hasFacultyClaim: boolean;
  claims: Record<string, unknown>;
  rejectionReason?: string;
  dependencyNotice?: string;
  verifiedAt?: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  caption: string;
  iconName: string;
}

// Canonical Curriculum types for Faculty App
export interface CanonicalModuleOverview {
  id: string;
  unitId: string;
  unitNumber: number;
  title: string;
  readTime: string;
  xpReward: number;
  objectives: string[];
  keyTakeaways: string[];
  prerequisites?: string[];
  status: 'published' | 'draft';
}

// Subjective Assessment Review types
export interface SubjectiveRubricCriterion {
  id: string;
  title: string;
  description: string;
  maxPoints: number;
}

export interface SubjectiveEvaluationResult {
  evaluatorId: string;
  evaluatorName: string;
  criterionScores: Record<string, number>;
  totalScore: number;
  maxPossibleScore: number;
  percentageScore: number;
  feedback: string;
  evaluatedAt: string;
}

export interface SubjectiveAssessmentSubmission {
  submissionId: string;
  studentId: string;
  studentName: string;
  studentRegNo: string;
  assessmentId: string;
  assessmentTitle: string;
  unitId: string;
  moduleId: string;
  taskPrompt: string;
  studentAnswer: string;
  submittedAt: string;
  status: 'pending_review' | 'reviewed';
  rubric: SubjectiveRubricCriterion[];
  evaluation?: SubjectiveEvaluationResult;
}

// Live Classroom Session types
export interface LiveClassroomPollOption {
  id: string;
  text: string;
  votes?: number;
}

export interface LiveClassroomSessionState {
  isActive: boolean;
  sessionId: string;
  courseId: string;
  instructorId: string;
  instructorName: string;
  currentQuestion: string;
  options: LiveClassroomPollOption[];
  explanation: string;
  correctOptionId?: string;
  isAnswerRevealed: boolean;
  questionIndex: number;
  connectedCount: number;
  totalEnrolled: number;
  updatedAt: string;
}

// Student Oversight & Progress types
export interface StudentCohortProgress {
  studentId: string;
  studentName: string;
  regNo: string;
  email: string;
  totalXP: number;
  level: number;
  completedModuleCount: number;
  masterySummary: {
    masteredCount: number;
    inProgressCount: number;
    needsRemediationCount: number;
    status: 'mastered' | 'in_progress' | 'not_started' | 'insufficient_evidence';
  };
  activeRemediationCount: number;
  lastActiveAt?: string;
  hasGenuineEvidence: boolean;
}
