
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const popularDomains = [
  "Data Scientist",
  "Software Engineer",
  "UX Designer",
  "Product Manager",
  "DevOps Engineer",
];

const JobDomainSelect = () => {
  const [jobDomain, setJobDomain] = useState("");

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-2">Select Job Domain</h2>
      <p className="text-muted-foreground mb-6">
        Specify your target job title or domain
      </p>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter job title (e.g., Data Scientist)"
          className="pl-10 bg-gapmap-gray/30 border-gapmap-gray/30 focus:border-gapmap-purple focus:ring-gapmap-purple"
          value={jobDomain}
          onChange={(e) => setJobDomain(e.target.value)}
        />
      </div>
      
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mb-3">Popular Domains:</p>
        <div className="flex flex-wrap gap-2">
          {popularDomains.map((domain) => (
            <Button
              key={domain}
              variant="outline"
              size="sm"
              className={`text-xs ${
                jobDomain === domain
                  ? "bg-gapmap-purple/20 border-gapmap-purple/40 text-gapmap-purple"
                  : "hover:bg-gapmap-purple/10 hover:border-gapmap-purple/30"
              }`}
              onClick={() => setJobDomain(domain)}
            >
              {domain}
            </Button>
          ))}
        </div>
      </div>
      
      <Button 
        className="w-full bg-gapmap-purple hover:bg-gapmap-purple-light text-white"
        disabled={!jobDomain}
      >
        Analyze Skill Gaps
      </Button>
    </div>
  );
};

export default JobDomainSelect;
