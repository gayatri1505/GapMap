export interface ResumeAnalysis {
  analysis_text: string;
  missing_skills: string[];
  resume_skills: string[];
  job_skills: string[];
}

export interface GithubRepo {
  name: string;
  url: string;
  description: string;
}

export interface LinkedInProfile {
  title: string;
  link: string;
  snippet: string;
}

export interface LearningResource {
  project_and_networking_ideas: string;
  top_github_repositories: GithubRepo[];
}

export interface SkillSuggestions {
  [skill: string]: LearningResource;
}

export interface JobDescription {
  job_title: string;
  company_name: string;
  job_description: string;
} 