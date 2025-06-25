'use server';

/**
 * @fileOverview A flow for classifying exam questions into subjects and dynamically identifying topics.
 *
 * - classifyQuestion - A function that handles the classification of an exam question.
 * - ClassifyQuestionInput - The input type for the classifyQuestion function.
 * - ClassifyQuestionOutput - The return type for the classifyQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyQuestionInputSchema = z.object({
  question: z.string().describe('The question to classify.'),
  subjectList: z.array(z.string()).describe('A list of predefined medical subjects to classify against.'),
});
export type ClassifyQuestionInput = z.infer<typeof ClassifyQuestionInputSchema>;

const ClassifyQuestionOutputSchema = z.object({
  question: z.string().describe('The original question text.'),
  subject: z.string().describe('The classified subject for the question.'),
  topic: z.string().describe('The dynamically identified, generalized topic for the question.'),
});
export type ClassifyQuestionOutput = z.infer<typeof ClassifyQuestionOutputSchema>;

export async function classifyQuestion(
  input: ClassifyQuestionInput
): Promise<ClassifyQuestionOutput> {
  return classifyQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyQuestionPrompt',
  input: {schema: ClassifyQuestionInputSchema},
  output: {schema: z.object({
    subject: z.string().describe('The classified subject for the question. Must be one of the provided subjects.'),
    topic: z.string().describe('The dynamically identified, generalized topic for the question.'),
  })},
  prompt: `You are an expert medical exam question classifier. Your task is to analyze a given medical question and classify it into a subject and a core topic.

**Instructions:**

1.  **Classify the Subject:** First, determine which of the following medical subjects the question belongs to. The subject MUST be one of the following:
    {{#each subjectList}}
    - {{{this}}}
    {{/each}}

2.  **Identify the Core Topic:** Second, identify the primary medical topic of the question. This topic should be a general, high-level concept.
    *   **Crucial Rule:** Do NOT create overly specific topics. Consolidate concepts. For example, if a question is about the 'management of inflammatory bowel disease' or 'pathology of inflammatory bowel disease', the topic should simply be 'Inflammatory Bowel Disease'. Similarly, 'treatment of myocardial infarction' should be 'Myocardial Infarction'.

3. **Output:** Return the single most appropriate subject and the generated core topic. If you cannot confidently classify the question, return an empty string for both the subject and topic fields.

**Input Question:**
{{{question}}}
  `,
});

const classifyQuestionFlow = ai.defineFlow(
  {
    name: 'classifyQuestionFlow',
    inputSchema: ClassifyQuestionInputSchema,
    outputSchema: ClassifyQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      question: input.question,
      subject: output?.subject || '',
      topic: output?.topic || '',
    };
  }
);
