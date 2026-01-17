
export type UserRole = 'candidate' | 'employer';

export interface Education {
  degree: string;
  field: string;
  cgpa: number;
}

export interface Candidate {
  id: string;
  name: string;
  skills: string[];
  experience_years: number;
  preferred_locations: string[];
  preferred_roles: string[];
  expected_salary: number;
  education: Education;
  avatar?: string;
}

export interface Job {
  job_id: string;
  title: string;
  required_skills: string[];
  experience_required: string; // Format: "0-2 years"
  location: string;
  salary_range: [number, number];
  company: string;
}

export interface MatchBreakdown {
  skill_match: number;
  location_match: number;
  salary_match: number;
  experience_match: number;
  role_match: number;
}

export interface MatchResult {
  job_id?: string;
  candidate_id?: string;
  job_details?: Job;
  candidate_details?: Candidate;
  match_score: number;
  breakdown: MatchBreakdown;
  missing_skills: string[];
  recommendation_reason: string;
}

export interface WeightConfig {
  skill: number;
  location: number;
  salary: number;
  experience: number;
  role: number;
}

export const DEFAULT_WEIGHTS: WeightConfig = {
  skill: 0.40,
  location: 0.20,
  salary: 0.15,
  experience: 0.15,
  role: 0.10
};
