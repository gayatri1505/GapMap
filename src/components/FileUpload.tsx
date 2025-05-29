import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from './ui/card';
import { cn } from '../lib/utils';
import { CloudUpload } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxFiles: 1
  });

  return (
    <Card
      {...getRootProps()}
      className={cn(
        "p-8 border-2 border-dashed border-[#6499E9] bg-white cursor-pointer hover:border-[#9EDDFF] transition-colors",
        isDragActive
          ? "border-[#00C6FF] bg-[#00C6FF]/5"
          : "border-gray-300 hover:border-[#00C6FF] hover:bg-[#00C6FF]/5"
      )}
    >
      <input
        {...getInputProps()}
        accept=".pdf,.doc,.docx"
        className="hidden"
      />
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        <CloudUpload className="w-12 h-12 text-gray-400" />
        <p className="text-lg text-gray-600">
          Drag & drop your resume here, or click to select
        </p>
        <p className="text-sm text-gray-500">
          Supports PDF, DOC, and DOCX files
        </p>
      </div>
    </Card>
  );
}
