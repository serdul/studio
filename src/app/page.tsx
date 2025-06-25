
"use client";

import { useState } from 'react';
import { extractQuestionsAction } from '@/app/actions';
import { FileUploader } from '@/components/file-uploader';
import { QuizView } from '@/components/quiz-view';
import { useToast } from "@/hooks/use-toast";
import { Bot, BookOpenCheck, Loader2 } from 'lucide-react';
import { WelcomeView } from '@/components/welcome-view';

type ViewState = 'welcome' | 'loading' | 'quiz';

export default function Home() {
  const [view, setView] = useState<ViewState>('welcome');
  const [extractedQuestions, setExtractedQuestions] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setView('loading');
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const fileDataUri = reader.result as string;
        if (!fileDataUri) throw new Error("Failed to read file.");

        const questions = await extractQuestionsAction(fileDataUri);

        if (questions.length === 0) {
          toast({
            variant: "destructive",
            title: "Extraction Failed",
            description: "The AI could not identify any questions in the document. Please try another file.",
          });
          setView('welcome');
          return;
        }
        
        setExtractedQuestions(questions);
        setView('quiz');

      } catch (error: any) {
        console.error("Error processing file:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: errorMessage || "An unknown error occurred. Please check the console for details.",
        });
        setView('welcome');
      }
    };
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "There was an error reading the uploaded file.",
        });
        setView('welcome');
    };
  };

  const handleStartOver = () => {
    setExtractedQuestions([]);
    setFileName('');
    setView('welcome');
  };

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold">AI is analyzing your document...</h2>
            <p className="text-muted-foreground">Extracting questions from {fileName}.</p>
          </div>
        );
      case 'quiz':
        return <QuizView questions={extractedQuestions} fileName={fileName} onStartOver={handleStartOver} />;
      case 'welcome':
      default:
        return <WelcomeView onFileUpload={handleFileUpload} />;
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MCQ Explainer</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center container py-8">
        {renderContent()}
      </main>

       <footer className="py-4 text-center text-sm text-muted-foreground">
        Built with AI by Firebase Studio.
      </footer>
    </div>
  );
}
