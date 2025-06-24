export interface Topic {
  name: string;
  count: number;
  files: string[];
}

export interface Subject {
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
  topics: Topic[];
}

export interface ExamFile {
  name: string;
  date: string;
}

export interface ClassifiedTopic {
  topic: string;
  confidence: number;
}
