"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  disabled: boolean;
}

export function FileUploader({ onFileUpload, disabled }: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  if (disabled) {
    return null;
  }

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf"
      />
      <Button onClick={handleButtonClick} className="bg-accent hover:bg-accent/90 text-accent-foreground">
        <Upload className="mr-2 h-4 w-4" />
        <span>Upload File</span>
      </Button>
    </>
  );
}
