export type UserRole = 'candidate' | 'employer';

export interface Education {
  degree: string;
  field: string;
  cgpa: string;
}

export interface Candidate {
  id: string; // or uid
  name: string;
  email?: string;
  bio?: string;
  skills: string[];
  experience_years: number;
  expected_salary: number;
  preferred_locations: string[];
  preferred_roles: string[];
  education: Education;
  contact_email?: string;
  contact_phone?: string;
}

export interface Job {
  job_id: string;
  title: string;
  company: string;
  location: string;
  required_skills: string[];
  experience_required: string;
  salary_range: number[]; // [min, max]
}

export interface MatchResult {
  match_score: number; // 0-100
  candidate_id?: string;
  job_id?: string;
  // Populated details
  candidate_details?: Candidate;
  job_details?: Job;
  explanation?: string;
}