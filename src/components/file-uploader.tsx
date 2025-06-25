"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2 } from "lucide-react"

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

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg"
        disabled={disabled}
      />
      <Button onClick={handleButtonClick} disabled={disabled} className="bg-accent hover:bg-accent/90 text-accent-foreground">
        {disabled ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Upload className="mr-2 h-4 w-4" />
        )}
        <span>{disabled ? "Processing..." : "Upload File"}</span>
      </Button>
    </>
  );
}
