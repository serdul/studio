export interface Question {
  text: string;
  sourceFile: string;
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

export interface ProgressState {
  percentage: number;
  message: string;
}
