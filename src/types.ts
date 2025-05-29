export interface ResumeAnalysis {
  resume_skills: string[];
  job_skills: string[];
  missing_skills: string[];
}

interface LearningResource {
  courses: string[];
  resources: string[];
  project_and_networking_ideas?: string;
  top_github_repositories?: Array<{
    name: string;
    url: string;
    description?: string;
  }>;
}

export interface SkillSuggestions {
  [skill: string]: LearningResource;
}

export interface LinkedInProfile {
  title: string;
  link: string;
  snippet?: string;
} 