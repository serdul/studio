'use server';

/**
 * @fileOverview A flow for classifying exam questions into predefined topics using AI.
 *
 * - classifyExamQuestions - A function that handles the classification of exam questions.
 * - ClassifyExamQuestionsInput - The input type for the classifyExamQuestions function.
 * - ClassifyExamQuestionsOutput - The return type for the classifyExamQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyExamQuestionsInputSchema = z.object({
  question: z.string().describe('The question to classify.'),
  masterTopicList: z.string().describe('A list of predefined topics.'),
});
export type ClassifyExamQuestionsInput = z.infer<typeof ClassifyExamQuestionsInputSchema>;

const ClassifyExamQuestionsOutputSchema = z.object({
  topic: z.string().describe('The classified topic for the question.'),
  confidence: z.number().describe('The confidence level of the classification (0-1).'),
});
export type ClassifyExamQuestionsOutput = z.infer<typeof ClassifyExamQuestionsOutputSchema>;

export async function classifyExamQuestions(
  input: ClassifyExamQuestionsInput
): Promise<ClassifyExamQuestionsOutput> {
  return classifyExamQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyExamQuestionsPrompt',
  input: {schema: ClassifyExamQuestionsInputSchema},
  output: {schema: ClassifyExamQuestionsOutputSchema},
  prompt: `You are an expert medical exam question classifier.

  Given a question and a list of predefined topics, classify the question into one of the topics.
  Return the classified topic and the confidence level of the classification.

  Question: {{{question}}}

  Master Topic List:
{{{masterTopicList}}}

  Make sure the topic is exactly from the Master Topic List.
  If the topic is not in the list, return "Other".
  `,
});

const classifyExamQuestionsFlow = ai.defineFlow(
  {
    name: 'classifyExamQuestionsFlow',
    inputSchema: ClassifyExamQuestionsInputSchema,
    outputSchema: ClassifyExamQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
