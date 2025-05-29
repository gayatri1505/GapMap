
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Mock data for demo purposes
const mockResumeSkills = [
  "Python",
  "SQL",
  "Data Analysis",
  "Excel",
  "R",
  "Machine Learning Basics",
  "Pandas",
  "Numpy"
];

const mockJobSkills = [
  "Python",
  "SQL",
  "Data Analysis",
  "Tableau",
  "Machine Learning",
  "Deep Learning",
  "PyTorch",
  "TensorFlow",
  "NLP",
  "Statistical Analysis",
  "A/B Testing",
  "Docker"
];

const getMissingSkills = (resumeSkills: string[], jobSkills: string[]) => {
  return jobSkills.filter(skill => !resumeSkills.includes(skill));
};

const mockMissingSkills = getMissingSkills(mockResumeSkills, mockJobSkills);

// Data for pie chart
const data = [
  { name: "Have", value: mockResumeSkills.length, color: "#8B5CF6" },
  { name: "Missing", value: mockMissingSkills.length, color: "#F97316" }
];

const renderSkillItem = (skill: string, isChecked: boolean, handleCheck: (skill: string) => void, isMissing = false) => (
  <div 
    key={skill} 
    className={`flex items-center p-2 rounded-md transition-colors ${
      isMissing ? "hover:bg-gapmap-orange/10" : "hover:bg-gapmap-purple/10"
    }`}
  >
    {isMissing && (
      <input
        type="checkbox"
        id={`skill-${skill}`}
        checked={isChecked}
        onChange={() => handleCheck(skill)}
        className="mr-2 rounded text-gapmap-purple focus:ring-gapmap-purple border-gapmap-gray"
      />
    )}
    <span className={isMissing ? "text-gapmap-orange" : ""}>{skill}</span>
  </div>
);

const SkillGapAnalysis = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };
  
  const handleFetchSuggestions = () => {
    if (selectedSkills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }
    
    setShowSuggestions(true);
    toast.success("Generated project suggestions for selected skills");
  };
  
  const missingPercentage = Math.round((mockMissingSkills.length / mockJobSkills.length) * 100);

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-6">Skill Gap Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        {/* Resume Skills Section */}
        <div className="lg:col-span-2 glass-morphism p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3 border-b pb-2 border-gapmap-gray/30">Resume Skills</h3>
          <div className="max-h-60 overflow-y-auto scrollbar-none">
            {mockResumeSkills.map(skill => renderSkillItem(skill, false, () => {}, false))}
          </div>
        </div>
        
        {/* Job Description Skills Section */}
        <div className="lg:col-span-2 glass-morphism p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3 border-b pb-2 border-gapmap-gray/30">Job Description Skills</h3>
          <div className="max-h-60 overflow-y-auto scrollbar-none">
            {mockJobSkills.map(skill => renderSkillItem(skill, false, () => {}, false))}
          </div>
        </div>
        
        {/* Missing Skills Section */}
        <div className="lg:col-span-3 glass-morphism p-4 rounded-lg">
          <h3 className="text-md font-medium mb-3 border-b pb-2 border-gapmap-gray/30">Missing Skills</h3>
          <div className="flex flex-col">
            <div className="flex-1 max-h-60 overflow-y-auto scrollbar-none mb-4">
              {mockMissingSkills.map(skill => renderSkillItem(
                skill, 
                selectedSkills.includes(skill), 
                toggleSkill,
                true
              ))}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gapmap-gray/30">
              <div className="h-24 w-24">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend 
                      layout="vertical" 
                      verticalAlign="middle" 
                      align="right"
                      wrapperStyle={{fontSize: "10px"}}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Gap Percentage</p>
                <p className="text-2xl font-bold text-gapmap-orange">{missingPercentage}%</p>
                <Button
                  onClick={handleFetchSuggestions}
                  className="mt-2 bg-gapmap-purple hover:bg-gapmap-purple-light text-white text-xs"
                  size="sm"
                  disabled={selectedSkills.length === 0}
                >
                  Get Project Ideas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillGapAnalysis;
