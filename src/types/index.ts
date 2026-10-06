export type FacultyViewType = 
  | 'Dashboard' 
  | 'Students' 
  | 'Courses' 
  | 'Learning Levels' 
  | 'Analytics' 
  | 'Settings';

export interface FacultyUser {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  institution: string;
  role: 'Course Coordinator' | 'Lab Faculty' | 'Assistant Professor' | 'Professor';
  avatar?: string;
  staffId: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  caption: string;
  iconName: string;
}
