
import { Github, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock project data
const mockProjects = {
  "Machine Learning": [
    {
      title: "Customer Churn Prediction",
      description: "Build a model to predict which customers are likely to leave a subscription service",
      difficulty: "Intermediate",
      skills: ["Python", "Scikit-learn", "Machine Learning", "Data Analysis"]
    },
    {
      title: "Image Classification System",
      description: "Create an image classifier using deep learning to identify objects in photos",
      difficulty: "Advanced",
      skills: ["Python", "TensorFlow", "Deep Learning", "Computer Vision"]
    },
    {
      title: "Sentiment Analysis Tool",
      description: "Develop a tool that analyzes sentiment in customer reviews or social media posts",
      difficulty: "Intermediate",
      skills: ["Python", "NLP", "Machine Learning", "Data Cleaning"]
    }
  ],
  "Deep Learning": [
    {
      title: "Neural Style Transfer App",
      description: "Create an application that applies artistic styles to images using deep learning",
      difficulty: "Advanced",
      skills: ["Python", "TensorFlow/PyTorch", "Deep Learning", "CNN"]
    },
    {
      title: "Face Recognition System",
      description: "Build a face recognition system with deep learning techniques",
      difficulty: "Advanced",
      skills: ["Python", "Computer Vision", "Deep Learning", "OpenCV"]
    },
    {
      title: "Text Generation with RNNs",
      description: "Create a text generator trained on your favorite author's works",
      difficulty: "Intermediate",
      skills: ["Python", "Natural Language Processing", "RNNs", "TensorFlow/PyTorch"]
    }
  ]
};

// Mock GitHub repositories
const mockGithubRepos = {
  "Machine Learning": [
    {
      name: "scikit-learn",
      description: "Machine Learning in Python",
      stars: "52.4k",
      url: "https://github.com/scikit-learn/scikit-learn"
    },
    {
      name: "mlcourse.ai",
      description: "Open Machine Learning Course",
      stars: "29.8k",
      url: "https://github.com/Yorko/mlcourse.ai"
    }
  ],
  "Deep Learning": [
    {
      name: "TensorFlow",
      description: "An end-to-end open source platform for machine learning",
      stars: "175k",
      url: "https://github.com/tensorflow/tensorflow"
    },
    {
      name: "PyTorch",
      description: "Tensors and Dynamic neural networks in Python",
      stars: "69.2k",
      url: "https://github.com/pytorch/pytorch"
    }
  ],
  "Docker": [
    {
      name: "docker-curriculum",
      description: "A comprehensive tutorial on getting started with Docker",
      stars: "4.2k",
      url: "https://github.com/prakhar1989/docker-curriculum"
    },
    {
      name: "awesome-docker",
      description: "A curated list of Docker resources and projects",
      stars: "25.7k",
      url: "https://github.com/veggiemonk/awesome-docker"
    }
  ]
};

const ProjectSuggestions = ({ selectedSkills = ["Machine Learning", "Deep Learning"] }) => {
  return (
    <div className="glass-card p-6 rounded-xl mb-10">
      <h2 className="text-xl font-semibold mb-6">Project Suggestions</h2>

      <div className="space-y-8">
        {selectedSkills.map((skill) => (
          <div key={skill} className="animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-lg font-medium">{skill}</h3>
              <div className="h-px flex-1 bg-gapmap-gray/20"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {/* Project Ideas */}
              <div className="lg:col-span-4">
                <h4 className="text-md font-medium mb-3 text-muted-foreground">Project Ideas</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mockProjects[skill as keyof typeof mockProjects]?.map((project, index) => (
                    <div 
                      key={index} 
                      className="glass-morphism p-4 rounded-lg hover:border-gapmap-purple/30 transition-colors"
                    >
                      <h5 className="font-medium mb-2">{project.title}</h5>
                      <p className="text-xs text-muted-foreground mb-3">{project.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gapmap-purple/20 text-gapmap-purple">
                          {project.difficulty}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Repositories */}
              <div className="lg:col-span-3">
                <h4 className="text-md font-medium mb-3 text-muted-foreground">GitHub Repositories</h4>
                <div className="space-y-4">
                  {mockGithubRepos[skill as keyof typeof mockGithubRepos]?.map((repo, index) => (
                    <div 
                      key={index}
                      className="glass-morphism p-4 rounded-lg hover:border-gapmap-purple/30 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Github className="h-4 w-4 text-muted-foreground" />
                          <h5 className="font-medium">{repo.name}</h5>
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-gapmap-gray/30 text-muted-foreground">
                          ★ {repo.stars}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground my-2">{repo.description}</p>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs w-full mt-2 flex items-center justify-center gap-1"
                        asChild
                      >
                        <a href={repo.url} target="_blank" rel="noopener noreferrer">
                          Visit Repository
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectSuggestions;
