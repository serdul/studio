'use server';

/**
 * @fileOverview A flow for classifying exam questions into subjects and dynamically identifying topics.
 *
 * - classifyQuestion - A function that handles the classification of an exam question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { ClassifiedQuestion } from '@/lib/types';
import {
  ClassifyQuestionInputSchema,
  type ClassifyQuestionInput,
  ClassifiedQuestionSchema,
} from '@/ai/schemas';

export async function classifyQuestion(
  input: ClassifyQuestionInput
): Promise<ClassifiedQuestion> {
  return classifyQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyQuestionPrompt',
  input: {schema: ClassifyQuestionInputSchema},
  output: {schema: z.object({
    subject: z.string().describe('The classified subject for the question. Must be one of the provided subjects.'),
    topic: z.string().describe('The dynamically identified, generalized topic for the question.'),
  })},
  prompt: `You are an expert medical exam question classifier. Your task is to analyze a given medical question and assign it to a single subject and a single, generalized topic.

**Input Question:**
{{{question}}}

**Analysis and Output Rules:**

1.  **Subject Classification:** You MUST classify the question into one, and only one, of the following subjects:
    {{#each subjectList}}
    - {{{this}}}
    {{/each}}
    Choose the single best fit.

2.  **Topic Generalization:** You MUST identify the core medical topic. Your topic MUST be a general, high-level concept.
    *   **Crucial Rule:** Consolidate specific variations into a single, core topic. For example, questions about 'management of inflammatory bowel disease' or 'pathology of inflammatory bowel disease' must both be assigned the topic 'Inflammatory Bowel Disease'. Similarly, 'treatment of myocardial infarction' must be assigned the topic 'Myocardial Infarction'. Do NOT create specific topics like 'management of...' or 'pathology of...'.

3.  **Output Format:** Your response MUST be a JSON object with two keys: "subject" and "topic".
  `,
});

const classifyQuestionFlow = ai.defineFlow(
  {
    name: 'classifyQuestionFlow',
    inputSchema: ClassifyQuestionInputSchema,
    outputSchema: ClassifiedQuestionSchema,
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
