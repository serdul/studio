"use client";

import type { Topic, TopicData } from "@/lib/types";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getSubjectIcon } from "@/lib/subject-map";


interface TopicDetailSheetProps {
    subject: string | null;
    topics: { [topicName: string]: TopicData };
    onOpenChange: (isOpen: boolean) => void;
}

export function TopicDetailSheet({ subject, topics, onOpenChange }: TopicDetailSheetProps) {
    const isOpen = !!subject;
    const SubjectIcon = getSubjectIcon(subject ?? "");
    const sortedTopics = Object.entries(topics).sort(([a], [b]) => a.localeCompare(b));

    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl md:max-w-2xl">
                 <ScrollArea className="h-full pr-6">
                    <SheetHeader>
                        <SheetTitle className="text-3xl flex items-center gap-3">
                             <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                                <SubjectIcon className="w-8 h-8 text-primary"/>
                            </div>
                            {subject}
                        </SheetTitle>
                        <SheetDescription className="text-left pt-2">
                            Here is a breakdown of all the topics and questions you've encountered for this subject.
                        </SheetDescription>
                    </SheetHeader>
                    
                    <div className="py-8">
                       <Accordion type="single" collapsible className="w-full">
                         {sortedTopics.map(([topicName, topicData]) => {
                            const accuracy = topicData.total > 0 ? Math.round((topicData.correct / topicData.total) * 100) : 0;
                            return (
                                <AccordionItem value={topicName} key={topicName}>
                                    <AccordionTrigger>
                                        <div className="flex justify-between items-center w-full pr-4">
                                            <span className="text-left font-semibold">{topicName}</span>
                                            <Badge variant={accuracy > 70 ? "default" : "secondary"}>
                                                {accuracy}% ({topicData.correct}/{topicData.total})
                                            </Badge>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-4 pl-2">
                                            {topicData.questions.map((q, index) => (
                                                <li key={index} className="p-4 bg-secondary/50 rounded-md">
                                                    <p className="whitespace-pre-wrap font-medium text-sm text-foreground">{q.question}</p>
                                                    {q.rationale && (
                                                         <p className="mt-2 text-xs text-muted-foreground italic border-l-2 pl-2">
                                                            <strong>AI Rationale:</strong> {q.rationale}
                                                        </p>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            )
                         })}
                        </Accordion>
                    </div>
                 </ScrollArea>
            </SheetContent>
        </Sheet>
    )
}
