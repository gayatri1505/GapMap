import { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { useToast } from './ui/use-toast';
import { analyzeResume, getLearningResources, getLinkedInProfiles } from '../services/api';
import { ResumeAnalysis, SkillSuggestions, LinkedInProfile } from '../types';

export function ResumeAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [domain, setDomain] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<SkillSuggestions | null>(null);
  const [linkedInProfiles, setLinkedInProfiles] = useState<LinkedInProfile[]>([]);
  const [location, setLocation] = useState('');
  const { toast } = useToast();

  const handleFileSelect = (selectedFile: File) => {
    console.log('File selected:', selectedFile.name, 'Size:', selectedFile.size, 'Type:', selectedFile.type);
    setFile(selectedFile);
    toast({
      title: 'File selected',
      description: `${selectedFile.name} (${(selectedFile.size / 1024).toFixed(2)} KB)`,
    });
  };

  const handleAnalyze = async () => {
    if (!file || !domain) {
      toast({
        title: 'Error',
        description: 'Please select a file and enter a job domain',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      console.log('Starting resume analysis...');
      console.log('File:', file.name, 'Size:', file.size, 'Type:', file.type);
      console.log('Domain:', domain);

      const result = await analyzeResume(file, domain);
      console.log('Analysis result:', result);
      
      setAnalysis(result);
      setSelectedSkills([]);
      setSuggestions(null);
      
      toast({
        title: 'Success',
        description: 'Resume analyzed successfully',
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze resume',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSkillSelect = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleGetResources = async () => {
    if (selectedSkills.length === 0) {
      toast({
        title: 'Error',
        description: 'Please select at least one skill',
        variant: 'destructive',
      });
      return;
    }

    try {
      const result = await getLearningResources(selectedSkills);
      setSuggestions(result);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get learning resources',
        variant: 'destructive',
      });
    }
  };

  const handleGetLinkedInProfiles = async () => {
    if (!domain || !location) {
      toast({
        title: 'Error',
        description: 'Please enter both job domain and location',
        variant: 'destructive',
      });
      return;
    }

    try {
      const profiles = await getLinkedInProfiles(domain, location);
      setLinkedInProfiles(profiles);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch LinkedIn profiles',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00C6FF] via-[#0072FF] to-[#00C6FF]/90">
      {/* Header Section */}
      <div className="py-12 text-center">
        <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">GapMap</h1>
        <p className="text-white/90 text-lg">Upload your resume and get personalized skill gap analysis</p>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="max-w-xl mx-auto mb-12">
          <div className="space-y-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl">
            <FileUpload onFileSelect={handleFileSelect} />
            {file && (
              <div className="p-4 bg-gradient-to-r from-[#00C6FF]/10 to-[#0072FF]/10 rounded-xl border border-[#0072FF]/20">
                <p className="text-[#0072FF] flex items-center gap-2">
                  <span>📄</span>
                  <span>Uploaded: {file.name}</span>
                </p>
              </div>
            )}
            <div className="space-y-4">
              <Input
                placeholder="Enter job domain (e.g., Data Scientist)"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full bg-white/80 backdrop-blur-sm border-[#0072FF]/20 text-[#0072FF] placeholder:text-[#0072FF]/50 h-12 text-lg rounded-xl focus:ring-2 focus:ring-[#00C6FF] transition-all"
              />
              <Button
                onClick={handleAnalyze}
                disabled={!file || !domain || isAnalyzing}
                className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#0072FF] hover:to-[#00C6FF] text-white transition-all duration-300 h-12 text-lg rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
              </Button>
            </div>
          </div>
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Skills Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Resume Skills */}
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/20">
                <div className="p-6 border-b border-[#0072FF]/10 bg-gradient-to-r from-[#00C6FF]/5 to-[#0072FF]/5">
                  <h3 className="text-xl font-semibold text-[#0072FF]">Resume Skills</h3>
                </div>
                <div className="p-6 h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {analysis.resume_skills?.map((skill) => (
                      <div key={skill} className="p-3 bg-white rounded-xl shadow-sm text-[#0072FF]/80 border border-[#0072FF]/10">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Job Description Skills */}
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/20">
                <div className="p-6 border-b border-[#0072FF]/10 bg-gradient-to-r from-[#00C6FF]/5 to-[#0072FF]/5">
                  <h3 className="text-xl font-semibold text-[#0072FF]">Required Skills</h3>
                </div>
                <div className="p-6 h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {analysis.job_skills?.map((skill) => (
                      <div key={skill} className="p-3 bg-white rounded-xl shadow-sm text-[#0072FF]/80 border border-[#0072FF]/10">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Missing Skills */}
              <Card className="bg-white/95 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden border border-white/20">
                <div className="p-6 border-b border-[#0072FF]/10 bg-gradient-to-r from-[#00C6FF]/5 to-[#0072FF]/5">
                  <h3 className="text-xl font-semibold text-[#0072FF]">Missing Skills</h3>
                </div>
                <div className="p-6 h-[400px] overflow-y-auto">
                  <div className="space-y-2">
                    {analysis.missing_skills?.map((skill) => (
                      <div key={skill} className="p-3 bg-gradient-to-r from-[#00C6FF]/10 to-[#0072FF]/10 rounded-xl shadow-sm text-[#0072FF] border border-[#0072FF]/20">
                        {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>

            {/* Skills Match and Resources Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills Match Percentage */}
              <Card className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-xl font-semibold mb-6 text-[#0072FF]">Skills Match Analysis</h3>
                <div className="space-y-4">
                  <div className="w-full bg-[#0072FF]/10 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-[#00C6FF] to-[#0072FF] h-4 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min(100, Number(((analysis.job_skills?.length - analysis.missing_skills?.length) / (analysis.job_skills?.length || 1) * 100).toFixed(0)))}%` 
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-[#0072FF]/80">
                    <span>Match: {((analysis.job_skills?.length - analysis.missing_skills?.length) / (analysis.job_skills?.length || 1) * 100).toFixed(0)}%</span>
                    <span>Missing: {analysis.missing_skills?.length || 0} skills</span>
                  </div>
                </div>
              </Card>

              {/* Skills Selection for Resources */}
              <Card className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-xl font-semibold mb-6 text-[#0072FF]">Get Learning Resources</h3>
                <div className="space-y-4">
                  <div className="max-h-[200px] overflow-y-auto pr-2">
                    {analysis.missing_skills?.map((skill) => (
                      <div key={skill} className="flex items-center space-x-3 p-3 hover:bg-gradient-to-r hover:from-[#00C6FF]/5 hover:to-[#0072FF]/5 rounded-xl transition-colors">
                        <Checkbox
                          id={skill}
                          checked={selectedSkills.includes(skill)}
                          onCheckedChange={() => handleSkillSelect(skill)}
                          className="border-[#0072FF] text-[#0072FF] rounded-md"
                        />
                        <label htmlFor={skill} className="flex-grow cursor-pointer text-[#0072FF]/80">{skill}</label>
                      </div>
                    ))}
                  </div>
                  <Button 
                    onClick={handleGetResources} 
                    disabled={selectedSkills.length === 0}
                    className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#0072FF] hover:to-[#00C6FF] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    Get Resources
                  </Button>
                </div>
              </Card>
            </div>

            {/* Learning Resources */}
            {suggestions && (
              <Card className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
                <h3 className="text-xl font-semibold mb-6 text-[#0072FF]">Learning Resources</h3>
                <div className="space-y-8">
                  {Object.entries(suggestions).map(([skill, resources]) => (
                    <div key={skill} className="space-y-6">
                      <h4 className="text-xl font-semibold text-[#0072FF]">{skill}</h4>
                      
                      {/* Project Ideas */}
                      {resources.project_and_networking_ideas && (
                        <div className="space-y-4">
                          <h5 className="font-medium text-[#0072FF]/80">Project Ideas</h5>
                          <div className="grid grid-cols-1 gap-6">
                            {resources.project_and_networking_ideas.split('\n\n').map((project, index) => {
                              if (!project.trim()) return null;
                              
                              const [title, whatToBuild, outcomes] = project.split('\n');
                              
                              return (
                                <div 
                                  key={index} 
                                  className="bg-white rounded-xl p-6 shadow-md border border-[#0072FF]/10 hover:shadow-lg transition-shadow"
                                >
                                  <h6 className="text-lg font-semibold text-[#0072FF] mb-4">
                                    {title}
                                  </h6>
                                  <div className="space-y-4">
                                    <div>
                                      <p className="text-sm font-medium text-[#0072FF]/70 mb-1">What to build:</p>
                                      <p className="text-[#0072FF]/80">{whatToBuild.replace('What to build: ', '')}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-[#0072FF]/70 mb-1">Key Learning Outcomes:</p>
                                      <p className="text-[#0072FF]/80">
                                        {outcomes.replace('Key Learning Outcomes: ', '').split(';').map((outcome, i) => (
                                          <span key={i} className="inline-block bg-[#0072FF]/5 rounded-full px-3 py-1 text-sm mr-2 mb-2">
                                            {outcome.trim()}
                                          </span>
                                        ))}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* GitHub Repositories */}
                      {resources.top_github_repositories && resources.top_github_repositories.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="font-medium text-[#0072FF]/80">GitHub Repositories</h5>
                          <div className="space-y-3">
                            {resources.top_github_repositories.map((repo, index) => (
                              <div key={index} className="bg-gradient-to-r from-[#00C6FF]/5 to-[#0072FF]/5 rounded-xl p-6 border border-[#0072FF]/10">
                                <a
                                  href={repo.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#0072FF] hover:text-[#00C6FF] font-medium transition-colors"
                                >
                                  {repo.name}
                                </a>
                                {repo.description && (
                                  <p className="mt-2 text-[#0072FF]/70 text-sm">{repo.description}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* LinkedIn Section */}
            <Card className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold mb-6 text-[#0072FF]">Find LinkedIn Connections</h3>
              <div className="space-y-6">
                <Input
                  placeholder="Enter location (e.g., Remote, NYC)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/80 backdrop-blur-sm border-[#0072FF]/20 text-[#0072FF] placeholder:text-[#0072FF]/50 rounded-xl focus:ring-2 focus:ring-[#00C6FF] transition-all"
                />
                <Button 
                  onClick={handleGetLinkedInProfiles} 
                  disabled={!domain || !location}
                  className="w-full bg-gradient-to-r from-[#00C6FF] to-[#0072FF] hover:from-[#0072FF] hover:to-[#00C6FF] text-white transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50"
                >
                  Find Connections
                </Button>

                {/* LinkedIn Results */}
                {linkedInProfiles.length > 0 && (
                  <div className="mt-6 space-y-6">
                    <h4 className="font-medium text-[#0072FF]/80">Relevant Profiles:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {linkedInProfiles.map((profile, index) => (
                        <div key={index} className="p-6 bg-gradient-to-r from-[#00C6FF]/5 to-[#0072FF]/5 rounded-xl border border-[#0072FF]/10 shadow-lg hover:shadow-xl transition-all">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-br from-[#00C6FF] to-[#0072FF] rounded-xl flex items-center justify-center">
                              <span className="text-white text-lg font-semibold">
                                {profile.title.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <a
                                href={profile.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#0072FF] hover:text-[#00C6FF] font-medium transition-colors line-clamp-2"
                              >
                                {profile.title}
                              </a>
                              {profile.snippet && (
                                <p className="mt-2 text-sm text-[#0072FF]/70 line-clamp-3">
                                  {profile.snippet}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 