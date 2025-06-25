"use client";

import type { PerformanceData } from "@/lib/types";
import { FileUploader } from "@/components/file-uploader";
import { SubjectCard } from "@/components/subject-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, BrainCircuit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DashboardProps {
  performanceData: PerformanceData;
  onFileUpload: (file: File) => void;
  onViewSubject: (subject: string) => void;
  onClearData: () => void;
}

export function Dashboard({ performanceData, onFileUpload, onViewSubject, onClearData }: DashboardProps) {
  const subjects = Object.keys(performanceData);
  const hasData = subjects.length > 0;

  return (
    <div className="w-full space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Your Personalized Dashboard</CardTitle>
          <CardDescription className="text-lg">
            Upload a new exam paper to test your knowledge, or review your performance in past subjects.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <FileUploader onFileUpload={onFileUpload} disabled={false} />
          {hasData && (
             <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your
                      performance data and reset your dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onClearData}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
          )}
        </CardContent>
      </Card>

      {hasData ? (
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <BrainCircuit className="text-primary"/>
            Your Hot Zones
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <SubjectCard
                key={subject}
                subject={subject}
                data={performanceData[subject]}
                onClick={() => onViewSubject(subject)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-semibold text-foreground">No data yet!</h3>
            <p className="mt-1 text-muted-foreground">Upload your first exam paper to get started.</p>
        </div>
      )}
    </div>
  );
}
