
export interface Distractor {
  option: string;
  explanation: string;
}

export interface Explanation {
  correctAnswer: string;
  explanation: string;
  distractorExplanations: Distractor[];
  citations: string[];
}

export interface QuestionRecord {
  question: string;
  rationale: string;
}

export interface TopicData {
  correct: number;
  total: number;
  questions: QuestionRecord[];
}

export interface SubjectPerformanceData {
  correct: number;
  total: number;
  topics: {
    [topicName: string]: TopicData;
  }
}

export interface PerformanceData {
  [subject: string]: SubjectPerformanceData;
}

export interface Topic {
  name: string;
  count: number;
  files: string[];
}

export interface ClassifiedFile {
  fileName: string;
  topics: Topic[];
}

export interface ProcessedTopic extends Topic {
  subject: string;
}
