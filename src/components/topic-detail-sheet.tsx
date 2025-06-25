"use client"

import type { Topic } from "@/lib/types"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { FileText, MessageSquareQuote } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TopicDetailSheetProps {
  topic: Topic | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TopicDetailSheet({ topic, open, onOpenChange }: TopicDetailSheetProps) {
  if (!topic) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl lg:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl text-primary">{topic.name}</SheetTitle>
          <SheetDescription>
            This topic was found in {topic.files.length} document{topic.files.length === 1 ? '' : 's'} with a total of {topic.count} mention{topic.count === 1 ? '' : 's'}.
          </SheetDescription>
        </SheetHeader>
        
        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <MessageSquareQuote className="h-5 w-5 text-accent" />
            Associated Questions ({topic.questions.length})
          </h3>
          {topic.questions && topic.questions.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {topic.questions.map((question, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>Question #{index + 1}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap p-2 bg-secondary/50 rounded-md">
                      {question}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-sm text-muted-foreground">No specific questions were recorded for this topic.</p>
          )}
        </div>
        
        <Separator className="my-4" />

        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Source Documents</h3>
          {topic.files.length > 0 ? (
            <ul className="space-y-2">
              {topic.files.map((file) => (
                <li key={file} className="flex items-center gap-3 rounded-md border p-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{file}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No source documents found for this topic.</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
