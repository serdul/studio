
"use client";

import type { Explanation } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lightbulb, CheckCircle2, XCircle, BookOpen } from "lucide-react";

interface ExplanationCardProps {
  explanation: Explanation;
}

export function ExplanationCard({ explanation }: ExplanationCardProps) {
  return (
    <Card className="w-full bg-background">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
                <Lightbulb className="w-8 h-8 text-amber-500" />
                AI Explanation
            </CardTitle>
            <CardDescription>
                Here is a breakdown of the question and its options.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {/* Correct Answer Explanation */}
            <div>
                <h3 className="font-bold text-lg flex items-center gap-2 text-green-600 mb-2">
                    <CheckCircle2 />
                    Correct Answer: {explanation.correctAnswer}
                </h3>
                <p className="text-muted-foreground pl-8">{explanation.explanation}</p>
            </div>
            
            <Separator />

            {/* Distractor Explanations */}
            <div>
                 <h3 className="font-bold text-lg flex items-center gap-2 text-red-600 mb-4">
                    <XCircle />
                    Distractor Analysis
                </h3>
                <div className="space-y-4 pl-8">
                    {explanation.distractorExplanations.map((distractor, index) => (
                        <div key={index}>
                            <p className="font-semibold text-foreground">{distractor.option}</p>
                            <p className="text-muted-foreground">{distractor.explanation}</p>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Citations */}
            <div>
                 <h3 className="font-bold text-lg flex items-center gap-2 text-primary mb-2">
                    <BookOpen />
                    Cited Sources
                </h3>
                <ul className="list-disc list-inside space-y-1 pl-8 text-muted-foreground">
                    {explanation.citations.map((citation, index) => (
                        <li key={index} className="text-sm">{citation}</li>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
  )
}
