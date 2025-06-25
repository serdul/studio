"use client";

import type { SubjectPerformanceData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getSubjectIcon } from "@/lib/subject-map";

interface SubjectCardProps {
    subject: string;
    data: SubjectPerformanceData;
    onClick: () => void;
}

export function SubjectCard({ subject, data, onClick }: SubjectCardProps) {
    const { correct, total } = data;
    const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
    const SubjectIcon = getSubjectIcon(subject);

    return (
        <Card 
            className="hover:shadow-lg hover:border-primary transition-all cursor-pointer"
            onClick={onClick}
        >
            <CardHeader>
                <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                        <SubjectIcon className="w-6 h-6 text-primary"/>
                    </div>
                    <span>{subject}</span>
                </CardTitle>
                <CardDescription>
                    {total} questions answered
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Progress value={accuracy} className="h-3" />
            </CardContent>
            <CardFooter className="flex justify-between text-sm font-medium text-muted-foreground">
                <span>Accuracy: <span className="text-foreground font-bold">{accuracy}%</span></span>
                <span>{correct} / {total} Correct</span>
            </CardFooter>
        </Card>
    )
}
