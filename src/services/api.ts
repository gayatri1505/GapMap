import { ResumeAnalysis, SkillSuggestions, LinkedInProfile } from '../types';

const API_BASE_URL = '/api';

export async function analyzeResume(file: File, domain: string): Promise<ResumeAnalysis> {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('domain', domain);

  const response = await fetch(`${API_BASE_URL}/analyze-resume`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze resume');
  }

  return response.json();
}

export async function getLearningResources(skills: string[]): Promise<SkillSuggestions> {
  const response = await fetch(`${API_BASE_URL}/learning-resources`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ skills }),
  });

  if (!response.ok) {
    throw new Error('Failed to get learning resources');
  }

  return response.json();
}

export async function getLinkedInProfiles(domain: string, location: string): Promise<LinkedInProfile[]> {
  const response = await fetch(`${API_BASE_URL}/linkedin-profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ domain, location }),
  });

  if (!response.ok) {
    throw new Error('Failed to get LinkedIn profiles');
  }

  return response.json();
}
