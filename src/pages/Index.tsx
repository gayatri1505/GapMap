
import Header from "@/components/Header";
import ResumeUpload from "@/components/ResumeUpload";
import JobDomainSelect from "@/components/JobDomainSelect";
import SkillGapAnalysis from "@/components/SkillGapAnalysis";
import ProjectSuggestions from "@/components/ProjectSuggestions";

const Index = () => {
  return (
    <div className="min-h-screen bg-gapmap-dark text-white">
      <Header />
      
      <main className="container mx-auto pt-6 pb-12 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gradient">
            Your Personalized AI Skill Gap Analyzer
          </h1>
          <p className="text-muted-foreground mb-8">
            Upload your resume, select your target job domain, and get personalized recommendations
            to bridge your skill gaps.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <ResumeUpload />
            <JobDomainSelect />
          </div>
          
          <div className="space-y-8">
            <SkillGapAnalysis />
            <ProjectSuggestions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
