"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { FileText, FolderOpen, Trash2 } from "lucide-react"

interface UploadedFilesListProps {
  files: string[];
  onFileDelete: (fileName: string) => void;
}

export function UploadedFilesList({ files, onFileDelete }: UploadedFilesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-6 w-6 text-accent" />
            <span>Uploaded Documents</span>
        </CardTitle>
        <CardDescription>
          A list of all documents you have analyzed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {files.length > 0 ? (
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={`${file}-${index}`} className="flex items-center gap-3 rounded-md border p-3 bg-secondary/50">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="flex-1 text-sm font-medium truncate">{file}</span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="shrink-0">
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete {file}</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {file}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the document and all its associated analysis data from your dashboard.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onFileDelete(file)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Yes, delete file
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>
        )}
      </CardContent>
    </Card>
  )
}
