export interface Question {
  text: string;
  sourceFile: string;
  rationale?: string;
}

export interface Topic {
  name: string;
  questions: Question[];
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

export interface ProgressLogEntry {
  message: string;
  status: 'loading' | 'done' | 'error';
}
