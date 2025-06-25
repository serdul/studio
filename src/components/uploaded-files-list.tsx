"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileText, FolderOpen } from "lucide-react"

interface UploadedFilesListProps {
  files: string[]
}

export function UploadedFilesList({ files }: UploadedFilesListProps) {
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
            {files.map((file) => (
              <li key={file} className="flex items-center gap-3 rounded-md border p-3 bg-secondary/50">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{file}</span>
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
