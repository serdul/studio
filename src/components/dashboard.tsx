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
import { Button } from "./ui/button"

interface DashboardProps {
  subjects: Subject[]
  onTopicSelect: (topic: Topic) => void
}

export function Dashboard({ subjects, onTopicSelect }: DashboardProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => {
        const sortedTopics = [...subject.topics].sort((a, b) => b.count - a.count);
        const hasData = sortedTopics.some(t => t.count > 0);
        const Icon = subject.icon;
        
        return (
          <Card key={subject.name} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              {Icon && <Icon className="h-8 w-8 text-accent" />}
              <div>
                <CardTitle>{subject.name}</CardTitle>
                <CardDescription>Frequently tested topics</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {hasData ? (
                <ul className="space-y-2">
                  {sortedTopics.filter(topic => topic.count > 0).map((topic) => (
                    <li key={topic.name}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between h-auto py-2 px-3 text-left"
                        onClick={() => onTopicSelect(topic)}
                      >
                        <span className="flex-1 pr-2">{topic.name}</span>
                        <Badge variant={topic.count > 2 ? "default" : "secondary"} className="shrink-0 bg-primary/20 text-primary hover:bg-primary/30">
                          {topic.count}
                        </Badge>
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full text-center text-sm text-muted-foreground p-4 rounded-md bg-secondary">
                  <p>No topics identified for this subject yet. Upload an exam paper to begin analysis.</p>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
