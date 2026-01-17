import { Candidate, Job } from "../types";

export const INITIAL_CANDIDATE: Candidate = {
  id: "C001",
  name: "Alex Johnson",
  skills: ["Python", "FastAPI", "Docker", "React"],
  experience_years: 2,
  preferred_locations: ["Bangalore", "Remote"],
  preferred_roles: ["Backend Developer", "Full Stack Developer"],
  expected_salary: 1200000,
  education: { degree: "B.Tech", field: "Computer Science", cgpa: 8.5 },
};

export const INITIAL_MOCK_JOBS: Job[] = [
  {
    job_id: "J001",
    title: "Backend Developer",
    required_skills: ["Python", "FastAPI", "PostgreSQL"],
    experience_required: "2-4 years",
    location: "Bangalore",
    salary_range: [1000000, 1500000],
    company: "TechCorp",
  },
  {
    job_id: "J002",
    title: "Cloud Architect",
    required_skills: ["AWS", "Kubernetes", "Docker", "Go"],
    experience_required: "5+ years",
    location: "Remote",
    salary_range: [3000000, 4500000],
    company: "CloudScale",
  },
  {
    job_id: "J003",
    title: "Full Stack Engineer",
    required_skills: ["React", "Node.js", "TypeScript"],
    experience_required: "1-3 years",
    location: "Hyderabad",
    salary_range: [800000, 1400000],
    company: "DesignCo",
  },
];

export const MOCK_POOL_CANDIDATES: Candidate[] = [
  {
    id: "C1",
    name: "Sarah Chen",
    skills: ["React", "TypeScript", "Tailwind"],
    experience_years: 3,
    preferred_locations: ["Hyderabad"],
    preferred_roles: ["Frontend Engineer"],
    expected_salary: 1100000,
    education: { degree: "M.S.", field: "Software Systems", cgpa: 9.0 },
  },
  {
    id: "C2",
    name: "Marcus Miller",
    skills: ["Python", "FastAPI", "PostgreSQL", "AWS"],
    experience_years: 4,
    preferred_locations: ["Bangalore"],
    preferred_roles: ["Backend Developer"],
    expected_salary: 1400000,
    education: { degree: "B.E.", field: "IT", cgpa: 7.8 },
  },
  {
    id: "C3",
    name: "Ananya Rao",
    skills: ["AWS", "Kubernetes", "Docker", "Go", "Terraform"],
    experience_years: 6,
    preferred_locations: ["Remote"],
    preferred_roles: ["Cloud Architect"],
    expected_salary: 3500000,
    education: { degree: "B.Tech", field: "CS", cgpa: 8.2 },
  },
  {
    id: "C4",
    name: "David Kim",
    skills: ["Python", "Django", "React"],
    experience_years: 2,
    preferred_locations: ["Bangalore"],
    preferred_roles: ["Full Stack Developer"],
    expected_salary: 900000,
    education: { degree: "B.S.", field: "CS", cgpa: 8.0 },
  },
];
