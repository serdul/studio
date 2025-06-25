"use client"

import type { Subject, Topic } from "@/lib/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DashboardProps {
  subjects: Subject[]
  onTopicSelect: (topic: Topic) => void
}

export function Dashboard({ subjects, onTopicSelect }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => {
        const sortedTopics = [...subject.topics].sort((a, b) => b.questions.length - a.questions.length);
        const hasData = sortedTopics.some(t => t.questions.length > 0);
        const Icon = subject.icon;
        
        return (
          <Card key={subject.name} className="flex flex-col hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center gap-4">
              {Icon && <Icon className="h-8 w-8 text-accent" />}
              <div>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>Frequently tested topics</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {hasData ? (
                <ul className="space-y-1">
                  {sortedTopics.filter(topic => topic.questions.length > 0).map((topic) => (
                    <li key={topic.name}
                        onClick={() => onTopicSelect(topic)}
                        className="flex items-center justify-between rounded-md px-3 py-2 cursor-pointer transition-colors hover:bg-secondary"
                    >
                      <span className="flex-1 pr-4 text-sm font-medium">{topic.name}</span>
                      <Badge 
                        variant={topic.questions.length > 2 ? "default" : "secondary"} 
                        className="shrink-0 text-xs"
                        aria-label={`${topic.questions.length} mentions`}>
                        {topic.questions.length}
                      </Badge>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground p-4 rounded-md bg-secondary/50">
                  <p>No topics identified yet. Upload an exam paper to begin analysis.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
