import {z} from 'genkit';

// From extract-questions.ts
export const ExtractQuestionsInputSchema = z.object({
  fileDataUri: z.string().describe("A file (PDF or image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ExtractQuestionsInput = z.infer<typeof ExtractQuestionsInputSchema>;

export const ExtractQuestionsOutputSchema = z.object({
  questions: z.array(z.string().describe("A single, complete question that has been grammatically corrected and polished. For MCQs, include the stem and all options. For SEQs, include the full question text, including the clinical scenario for sub-questions. Exclude any provided answers.")),
});
export type ExtractQuestionsOutput = z.infer<typeof ExtractQuestionsOutputSchema>;


// From classify-exam-questions.ts
export const ClassifyQuestionInputSchema = z.object({
  question: z.string().describe('The question to classify.'),
  subjectList: z.array(z.string()).describe('A list of predefined medical subjects to classify against.'),
});
export type ClassifyQuestionInput = z.infer<typeof ClassifyQuestionInputSchema>;

export const ClassifiedQuestionSchema = z.object({
  question: z.string().describe('The original question text.'),
  subject: z.string().describe('The classified subject for the question.'),
  topic: z.string().describe('The dynamically identified, generalized topic for the question.'),
  rationale: z.string().describe("The AI's explanation for its classification choice."),
});
export type ClassifiedQuestion = z.infer<typeof ClassifiedQuestionSchema>;


// From classify-questions.ts
export const ClassifyQuestionsInputSchema = z.object({
  questions: z.array(z.string()),
});
export type ClassifyQuestionsInput = z.infer<typeof ClassifyQuestionsInputSchema>;

export const ClassifyQuestionsOutputSchema = z.object({
  classifiedQuestions: z.array(ClassifiedQuestionSchema),
});
export type ClassifyQuestionsOutput = z.infer<typeof ClassifyQuestionsOutputSchema>;
