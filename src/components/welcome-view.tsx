
"use client";

import { FileUploader } from "@/components/file-uploader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Bot, BookCopy } from "lucide-react";

interface WelcomeViewProps {
  onFileUpload: (file: File) => void;
}

export function WelcomeView({ onFileUpload }: WelcomeViewProps) {
  return (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">Welcome to the AI MCQ Explainer</CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Upload your exam paper and transform it into an interactive learning session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-full">
                    <BookCopy className="w-6 h-6 text-primary"/>
                </div>
                <div>
                    <h3 className="font-semibold">Extract Questions</h3>
                    <p className="text-sm text-muted-foreground">AI automatically finds all the MCQs in your PDF.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                 <div className="p-2 bg-primary/10 rounded-full">
                    <Bot className="w-6 h-6 text-primary"/>
                </div>
                <div>
                    <h3 className="font-semibold">Get Explanations</h3>
                    <p className="text-sm text-muted-foreground">Receive detailed breakdowns for every answer option.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                 <div className="p-2 bg-primary/10 rounded-full">
                    <Check className="w-6 h-6 text-primary"/>
                </div>
                <div>
                    <h3 className="font-semibold">Learn Actively</h3>
                    <p className="text-sm text-muted-foreground">Test your knowledge in a gamified, interactive quiz.</p>
                </div>
            </div>
        </div>
        <div className="pt-4">
            <FileUploader onFileUpload={onFileUpload} disabled={false} />
        </div>
      </CardContent>
    </Card>
  )
}
