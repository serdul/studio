
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Subject, Topic, ProgressState, Question } from '@/lib/types';
import { MASTER_SUBJECTS } from '@/lib/mockData';
import { processDocumentAction } from '@/app/actions';
import { FileUploader } from '@/components/file-uploader';
import { Dashboard } from '@/components/dashboard';
import { TopicDetailSheet } from '@/components/topic-detail-sheet';
import { Progress } from '@/components/ui/progress';
import { useToast } from "@/hooks/use-toast";
import { BookOpenCheck, BarChart3, Bot, Info, Cog, MoreVertical } from 'lucide-react';
import { UploadedFilesList } from '@/components/uploaded-files-list';
import { Button } from '@/components/ui/button';
import { DashboardSkeleton } from '@/components/dashboard-skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Home() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progressState, setProgressState] = useState<ProgressState | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('medHotspotData');
      if (storedData) {
        const { subjects: storedSubjects } = JSON.parse(storedData);
        // We merge stored data with the master list to ensure subjects are always present
        const mergedSubjects = MASTER_SUBJECTS.map(masterSubject => {
            const storedSubject = storedSubjects.find((s: Subject) => s.name === masterSubject.name);
            return storedSubject ? { ...masterSubject, topics: storedSubject.topics } : masterSubject;
        });
        setSubjects(mergedSubjects);
      } else {
        setSubjects(MASTER_SUBJECTS);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setSubjects(MASTER_SUBJECTS);
    } finally {
      setIsInitialLoading(false);
    }
  }, []);

  const uploadedFiles = useMemo(() => {
    const allFiles = new Set<string>();
    subjects.forEach(subject => {
        subject.topics.forEach(topic => {
            topic.questions.forEach(question => {
                allFiles.add(question.sourceFile);
            });
        });
    });
    return Array.from(allFiles).sort();
  }, [subjects]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setProgressState({ percentage: 0, message: "Starting upload..." });

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
        try {
            const fileDataUri = reader.result as string;
            if (!fileDataUri) {
                throw new Error("Failed to read file.");
            }

            setProgressState({ percentage: 25, message: "Preparing document for analysis..." });
            
            setProgressState(prev => ({ ...prev!, percentage: 50, message: "AI is extracting and classifying questions..." }));
            const { questionsFound, classifiedQuestions } = await processDocumentAction(fileDataUri);
            
            setProgressState(prev => ({ ...prev!, percentage: 80, message: "Finalizing results..." }));

            if (questionsFound === 0) {
                toast({
                    variant: "destructive",
                    title: "Analysis Failed",
                    description: "The AI could not identify any questions in the document.",
                });
                setIsLoading(false);
                setProgressState(null);
                return;
            }

            if (classifiedQuestions.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Analysis Incomplete",
                    description: `The AI found ${questionsFound} questions, but none could be classified into the existing topics.`,
                });
                setIsLoading(false);
                setProgressState(null);
                return;
            }

            setProgressState(prev => ({ ...prev!, percentage: 95, message: "Updating dashboard..." }));
            
            const newSubjects: Subject[] = JSON.parse(JSON.stringify(subjects));

            for (const result of classifiedQuestions) {
                const subjectIndex = newSubjects.findIndex(s => s.name === result.subject);

                if (subjectIndex !== -1) {
                    const targetSubject = newSubjects[subjectIndex];
                    // Normalize topic names for comparison
                    const topicNameLower = result.topic.trim().toLowerCase();
                    let topicIndex = targetSubject.topics.findIndex(t => t.name.trim().toLowerCase() === topicNameLower);

                    const newQuestion: Question = {
                        text: result.question,
                        sourceFile: file.name
                    };

                    if (topicIndex !== -1) {
                        // Topic exists, just add the question
                        targetSubject.topics[topicIndex].questions.push(newQuestion);
                    } else {
                        // New topic, create it and add the question
                        const newTopic: Topic = {
                            name: result.topic.trim(), // Use the trimmed original-casing topic name
                            questions: [newQuestion]
                        };
                        targetSubject.topics.push(newTopic);
                    }
                }
            }

            const subjectsToStore = newSubjects.map(({ icon, ...rest }) => rest);
            localStorage.setItem('medHotspotData', JSON.stringify({ subjects: subjectsToStore }));
            setSubjects(newSubjects);
            
            setProgressState({ percentage: 100, message: "Analysis complete!"});

            toast({
                title: "Processing Complete",
                description: `${file.name} has been analyzed and added to the dashboard.`,
            });

        } catch (error) {
            console.error("Error processing file:", error);
            toast({
                variant: "destructive",
                title: "An Error Occurred During Analysis",
                description: String(error),
            });
        } finally {
            // Give a moment for the user to see the "complete" message before resetting state
            setTimeout(() => {
                setIsLoading(false);
                setProgressState(null);
            }, 1000);
        }
    };

    reader.onerror = (error) => {
        console.error("FileReader error:", error);
        toast({
            variant: "destructive",
            title: "File Read Error",
            description: "There was an error reading the uploaded file.",
        });
        setIsLoading(false);
        setProgressState(null);
    };
  };

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
  };
  
  const handleFileDelete = (fileName: string) => {
    const newSubjects: Subject[] = JSON.parse(JSON.stringify(subjects));

    for (const subject of newSubjects) {
      for (const topic of subject.topics) {
        topic.questions = topic.questions.filter(
          (q: Question) => q.sourceFile !== fileName
        );
      }
      // Also filter out topics that have no questions left
      subject.topics = subject.topics.filter(t => t.questions.length > 0);
    }

    const subjectsToStore = newSubjects.map(({ icon, ...rest }: Subject) => rest);
    localStorage.setItem('medHotspotData', JSON.stringify({ subjects: subjectsToStore }));
    setSubjects(newSubjects);

    toast({
      title: "Document Removed",
      description: `${fileName} and its associated data have been removed.`,
    });
  };

  const renderMainContent = () => {
    if (isInitialLoading) {
        return <DashboardSkeleton />;
    }

    if (isLoading && progressState) {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
          <Bot className="h-12 w-12 text-primary animate-bounce" />
          <p className="text-xl font-medium text-foreground">AI In Progress</p>
          <p className="text-muted-foreground max-w-md">{progressState.message}</p>
          <Progress value={progressState.percentage} className="w-full max-w-md mt-4" />
        </div>
      );
    }

    if (uploadedFiles.length === 0) {
      return (
        <div className="text-center py-20">
          <BarChart3 className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-semibold">Welcome to your Hot Zone Dashboard</h2>
          <p className="mt-2 text-muted-foreground">Upload an exam paper to get started.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <Dashboard subjects={subjects} onTopicSelect={handleTopicSelect} />
        </div>
        <div className="lg:col-span-1">
          <UploadedFilesList files={uploadedFiles} onFileDelete={handleFileDelete} />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpenCheck className="h-7 w-7 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">MedHotspot</h1>
          </div>
          <div className="flex items-center gap-4">
             <FileUploader onFileUpload={handleFileUpload} disabled={isLoading} />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                    <span className="sr-only">More options</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => router.push('/about')} className="cursor-pointer">
                      <Info className="mr-2"/> How it Works
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => router.push('/settings')} className="cursor-pointer">
                      <Cog className="mr-2"/> Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        {renderMainContent()}
      </main>

      <TopicDetailSheet
        topic={selectedTopic}
        open={!!selectedTopic}
        onOpenChange={(open) => {
          if (!open) setSelectedTopic(null);
        }}
      />

      <footer className="py-4 text-center text-sm text-muted-foreground">
        Built with AI by Firebase Studio.
      </footer>
    </div>
  );
}
