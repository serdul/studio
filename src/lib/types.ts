
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
