import {z} from 'genkit';

// From extract-questions.ts
export const ExtractQuestionsInputSchema = z.object({
  fileDataUri: z.string().describe("A file (PDF or image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ExtractQuestionsInput = z.infer<typeof ExtractQuestionsInputSchema>;

export const ExtractQuestionsOutputSchema = z.object({
  questions: z.array(z.string().describe("A single, complete question that has been grammatically corrected and polished. For MCQs, include the stem and all options. Exclude any provided answers.")),
});
export type ExtractQuestionsOutput = z.infer<typeof ExtractQuestionsOutputSchema>;


// From explain-question-flow.ts
export const ExplainQuestionInputSchema = z.object({
  question: z.string().describe('A single multiple-choice question, including all options.'),
});
export type ExplainQuestionInput = z.infer<typeof ExplainQuestionInputSchema>;

const DistractorExplanationSchema = z.object({
    option: z.string().describe("The letter or text of the incorrect option (e.g., 'B' or 'Pulmonary Embolism')."),
    explanation: z.string().describe("The detailed reason why this option is incorrect."),
});

export const ExplainQuestionOutputSchema = z.object({
  correctAnswer: z.string().describe("The letter of the correct answer (e.g., 'A', 'B', 'C')."),
  explanation: z.string().describe('A detailed explanation of why the correct answer is correct.'),
  distractorExplanations: z.array(DistractorExplanationSchema).describe('An array of explanations for each incorrect option.'),
  citations: z.array(z.string()).describe('An array of credible medical sources to support the explanation.'),
});
export type ExplainQuestionOutput = z.infer<typeof ExplainQuestionOutputSchema>;
