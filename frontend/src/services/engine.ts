import { Candidate, Job, MatchResult } from "../types";

const WEIGHTS = {
  skill: 0.4,
  location: 0.2,
  salary: 0.15,
  experience: 0.15,
  role: 0.1,
};

function calculateSkillScore(cSkills: string[], jSkills: string[]) {
  if (!jSkills.length) return { score: 100, missing: [] };
  const cSet = new Set(cSkills.map((s) => s.toLowerCase()));
  const matches = jSkills.filter((s) => cSet.has(s.toLowerCase()));
  const missing = jSkills.filter((s) => !cSet.has(s.toLowerCase()));
  return { score: (matches.length / jSkills.length) * 100, missing };
}

function calculateLocationScore(preferred: string[], jobLoc: string) {
  return preferred.some((p) => p.toLowerCase() === jobLoc.toLowerCase())
    ? 100
    : 0;
}

function calculateSalaryScore(expected: number, range: number[]) {
  const [min, max] = range;
  if (expected <= max) return 100;
  return Math.max(0, 100 - ((expected - max) / max) * 100);
}

function calculateExperienceScore(years: number, req: string) {
  // Simplified parsing logic
  const minReq = parseInt(req.split("-")[0]) || 0;
  if (years >= minReq) return 100;
  return Math.max(0, 100 - (minReq - years) * 25);
}

function calculateRoleScore(preferred: string[], title: string) {
  return preferred.some((r) => title.toLowerCase().includes(r.toLowerCase()))
    ? 100
    : 0;
}

export function calculateMatch(candidate: Candidate, job: Job): MatchResult {
  const skills = calculateSkillScore(candidate.skills, job.required_skills);
  const loc = calculateLocationScore(
    candidate.preferred_locations,
    job.location
  );
  const sal = calculateSalaryScore(candidate.expected_salary, job.salary_range);
  const exp = calculateExperienceScore(
    candidate.experience_years,
    job.experience_required
  );
  const role = calculateRoleScore(candidate.preferred_roles, job.title);

  const total =
    skills.score * WEIGHTS.skill +
    loc * WEIGHTS.location +
    sal * WEIGHTS.salary +
    exp * WEIGHTS.experience +
    role * WEIGHTS.role;

  return {
    job_id: job.job_id,
    candidate_id: candidate.id, // Useful for employer view
    match_score: total,
    breakdown: {
      skill_match: skills.score,
      location_match: loc,
      salary_match: sal,
      experience_match: exp,
      role_match: role,
    },
    missing_skills: skills.missing,
    recommendation_reason: total > 80 ? "Top Candidate" : "Moderate Match",
    // Attach details for easier UI rendering
    job_details: job,
    candidate_details: candidate,
  };
}
