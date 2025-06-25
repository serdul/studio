
"use client";

import { useState, useEffect } from 'react';
import { processExamFileAction } from '@/app/actions';
import { QuizView } from '@/components/quiz-view';
import { Dashboard } from '@/components/dashboard';
import { TopicDetailSheet } from '@/components/topic-detail-sheet';
import { useToast } from "@/hooks/use-toast";
import { Stethoscope, Loader2 } from 'lucide-react';
import type { PerformanceData, Topic } from '@/lib/types';
import type { ClassifiedQuestion } from '@/ai/schemas';

type ViewState = 'dashboard' | 'loading' | 'quiz';

export default function Home() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [classifiedQuestions, setClassifiedQuestions] = useState<ClassifiedQuestion[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData>({});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [fileName, setFileName] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    try {
      const savedData = localStorage.getItem('medHotspotPerformance');
      if (savedData) {
        setPerformanceData(JSON.parse(savedData));
      }
    } catch (error) {
      console.error("Failed to load performance data from localStorage", error);
    } finally {
      setIsDataLoaded(true);
    }
  }, []);
  
  const handleFileUpload = async (file: File) => {
    setView('loading');
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      try {
        const fileDataUri = reader.result as string;
        if (!fileDataUri) throw new Error("Failed to read file.");

        const questions = await processExamFileAction(fileDataUri);

        if (questions.length === 0) {
          toast({
            variant: "destructive",
            title: "Extraction Failed",
            description: "The AI could not identify any questions in the document. Please try another file.",
          });
          setView('dashboard');
          return;
        }
        
        setClassifiedQuestions(questions);
        setView('quiz');

      } catch (error: any) {
        console.error("Error processing file:", error);
        toast({
            variant: "destructive",
            title: "An Error Occurred",
            description: error.message || "An unknown error occurred. Please check the console for details.",
        });
        setView('dashboard');
      }
    };
    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "There was an error reading the uploaded file.",
        });
        setView('dashboard');
    };
  };

  const handleQuestionAnswered = (question: ClassifiedQuestion, isCorrect: boolean) => {
    const { subject, topic, rationale } = question;

    const newPerformanceData = { ...performanceData };

    // Ensure subject exists
    if (!newPerformanceData[subject]) {
      newPerformanceData[subject] = { correct: 0, total: 0, topics: {} };
    }
    
    // Ensure topic exists
    if (!newPerformanceData[subject].topics[topic]) {
      newPerformanceData[subject].topics[topic] = { correct: 0, total: 0, questions: [] };
    }

    // Update counts
    newPerformanceData[subject].total += 1;
    newPerformanceData[subject].topics[topic].total += 1;
    if (isCorrect) {
      newPerformanceData[subject].correct += 1;
      newPerformanceData[subject].topics[topic].correct += 1;
    }
    
    // Add question details
    newPerformanceData[subject].topics[topic].questions.push({
      question: question.question,
      rationale: rationale || "No rationale provided.",
    });

    setPerformanceData(newPerformanceData);
    localStorage.setItem('medHotspotPerformance', JSON.stringify(newPerformanceData));
  };

  const handleStartOver = () => {
    setClassifiedQuestions([]);
    setFileName('');
    setView('dashboard');
  };

  const handleViewSubject = (subject: string) => {
    setSelectedSubject(subject);
  };
  
  const handleClearData = () => {
    setPerformanceData({});
    localStorage.removeItem('medHotspotPerformance');
    toast({
        title: "Data Cleared",
        description: "Your performance dashboard has been reset.",
    });
  };

  const renderContent = () => {
    if (!isDataLoaded) {
      return (
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-2xl font-semibold">Loading Dashboard...</h2>
        </div>
      );
    }

    switch (view) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <h2 className="text-2xl font-semibold">AI is analyzing your document...</h2>
            <p className="text-muted-foreground">Extracting & classifying questions from {fileName}.</p>
          </div>
        );
      case 'quiz':
        return (
          <QuizView 
            questions={classifiedQuestions} 
            fileName={fileName} 
            onStartOver={handleStartOver}
            onQuestionAnswered={handleQuestionAnswered}
          />
        );
      case 'dashboard':
      default:
        return (
          <Dashboard
            performanceData={performanceData}
            onFileUpload={handleFileUpload}
            onViewSubject={handleViewSubject}
            onClearData={handleClearData}
          />
        );
    }
  }

  const selectedSubjectData = selectedSubject ? performanceData[selectedSubject] : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MedHotspot</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        {renderContent()}
      </main>

      <TopicDetailSheet 
        subject={selectedSubject}
        topics={selectedSubjectData?.topics ?? {}}
        onOpenChange={(isOpen) => !isOpen && setSelectedSubject(null)}
      />

       <footer className="py-4 text-center text-sm text-muted-foreground">
        Built with AI by Firebase Studio.
      </footer>
    </div>
  );
}
