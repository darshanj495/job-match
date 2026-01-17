
import { Candidate, Job, MatchResult, DEFAULT_WEIGHTS, WeightConfig } from './types';

export const calculateMatch = (candidate: Candidate, job: Job, weights: WeightConfig = DEFAULT_WEIGHTS): MatchResult => {
  // 1. Skill Match (40%)
  const candidateSkillsLower = candidate.skills.map(s => s.toLowerCase());
  const jobSkillsLower = job.required_skills.map(s => s.toLowerCase());
  
  const matchedSkills = job.required_skills.filter(skill => 
    candidateSkillsLower.includes(skill.toLowerCase())
  );
  const missingSkills = job.required_skills.filter(skill => 
    !candidateSkillsLower.includes(skill.toLowerCase())
  );
  
  const skill_match = job.required_skills.length > 0 
    ? (matchedSkills.length / job.required_skills.length) * 100 
    : 100;

  // 2. Location Match (20%)
  const location_match = candidate.preferred_locations.some(
    loc => loc.toLowerCase() === job.location.toLowerCase()
  ) ? 100 : 0;

  // 3. Salary Match (15%)
  const [minSalary, maxSalary] = job.salary_range;
  let salary_match = 0;
  if (candidate.expected_salary <= maxSalary) {
    salary_match = 100;
  } else {
    // Penalize based on how far over the max the expected salary is
    const diff = candidate.expected_salary - maxSalary;
    salary_match = Math.max(0, 100 - (diff / maxSalary * 100));
  }

  // 4. Experience Match (15%)
  // Parse "0-2 years" or "5+ years"
  const expRange = job.experience_required.match(/(\d+)/g);
  let experience_match = 0;
  if (expRange) {
    const minExp = parseInt(expRange[0]);
    const maxExp = expRange[1] ? parseInt(expRange[1]) : Infinity;
    
    if (candidate.experience_years >= minExp && candidate.experience_years <= maxExp) {
      experience_match = 100;
    } else if (candidate.experience_years > maxExp) {
      experience_match = 90; // Overqualified is still a good match
    } else {
      // Underqualified
      experience_match = (candidate.experience_years / minExp) * 100;
    }
  }

  // 5. Role Match (10%)
  const role_match = candidate.preferred_roles.some(
    role => role.toLowerCase() === job.title.toLowerCase()
  ) ? 100 : 50; // Partial credit for similar roles could be added with NLP

  // Final Weighted Score
  const match_score = Number((
    (skill_match * weights.skill) +
    (location_match * weights.location) +
    (salary_match * weights.salary) +
    (experience_match * weights.experience) +
    (role_match * weights.role)
  ).toFixed(2));

  return {
    job_id: job.job_id,
    job_details: job,
    match_score,
    breakdown: {
      skill_match,
      location_match,
      salary_match,
      experience_match,
      role_match
    },
    missing_skills: missingSkills,
    recommendation_reason: `Calculated match score of ${match_score}% based on weighted compatibility factors.`
  };
};
