
import { useState } from "react";
import { Upload, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ResumeUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;
    
    if (selectedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setUploading(true);
    setFile(selectedFile);
    
    // Simulate upload progress
    let uploadProgress = 0;
    const interval = setInterval(() => {
      uploadProgress += 20;
      setProgress(uploadProgress);
      
      if (uploadProgress >= 100) {
        clearInterval(interval);
        setUploading(false);
        toast.success("Resume uploaded successfully");
      }
    }, 500);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    
    if (!droppedFile) return;
    
    if (droppedFile.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    
    setUploading(true);
    setFile(droppedFile);
    
    // Simulate upload progress
    let uploadProgress = 0;
    const interval = setInterval(() => {
      uploadProgress += 20;
      setProgress(uploadProgress);
      
      if (uploadProgress >= 100) {
        clearInterval(interval);
        setUploading(false);
        toast.success("Resume uploaded successfully");
      }
    }, 500);
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="glass-card p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-2">Upload Your Resume</h2>
      <p className="text-muted-foreground mb-6">
        Upload your resume in PDF format to analyze your skills
      </p>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
          file ? "border-gapmap-purple/30 bg-gapmap-purple/5" : "border-gapmap-gray/30 hover:border-gapmap-purple/30 hover:bg-gapmap-purple/5"
        }`}
        onDragOver={preventDefaults}
        onDragEnter={preventDefaults}
        onDragLeave={preventDefaults}
        onDrop={handleDrop}
      >
        {!file ? (
          <>
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium text-lg mb-2">Drag & drop your resume here</h3>
            <p className="text-muted-foreground mb-6">or</p>
            <Button variant="secondary" className="relative">
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf"
              />
              Browse Files
            </Button>
            <p className="text-xs text-muted-foreground mt-4">
              Supported file: PDF (max 5MB)
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <Upload className="h-12 w-12 text-gapmap-purple animate-pulse mb-3" />
                <h3 className="font-medium text-lg mb-4">Uploading...</h3>
                <div className="w-full max-w-xs bg-gapmap-gray/30 rounded-full h-2.5 mb-4">
                  <div
                    className="bg-gapmap-purple h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-muted-foreground">{progress}%</p>
              </>
            ) : (
              <>
                <div className="h-12 w-12 rounded-full bg-gapmap-purple/20 flex items-center justify-center mb-3">
                  <Check className="h-6 w-6 text-gapmap-purple" />
                </div>
                <h3 className="font-medium text-lg mb-2">Upload Complete!</h3>
                <p className="text-muted-foreground mb-4">{file.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFile(null)}
                >
                  Change File
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
