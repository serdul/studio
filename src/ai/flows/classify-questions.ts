
'use server';
/**
 * @fileOverview A flow for classifying a batch of questions concurrently.
 */

import {ai} from '@/ai/genkit';
import {
  ClassifyQuestionsInputSchema,
  type ClassifyQuestionsInput,
  ClassifyQuestionsOutputSchema,
  type ClassifyQuestionsOutput,
} from '@/ai/schemas';
import { classifyQuestion } from './classify-exam-questions';
import { MASTER_SUBJECTS } from '@/lib/mockData';
import type { ClassifiedQuestion } from '@/ai/schemas';


export async function classifyQuestions(
  input: ClassifyQuestionsInput
): Promise<ClassifyQuestionsOutput> {
  return classifyQuestionsFlow(input);
}

const classifyQuestionsFlow = ai.defineFlow(
  {
    name: 'classifyQuestionsFlow',
    inputSchema: ClassifyQuestionsInputSchema,
    outputSchema: ClassifyQuestionsOutputSchema,
  },
  async ({ questions }) => {
    if (questions.length === 0) {
      return { classifiedQuestions: [] };
    }

    const subjectList = MASTER_SUBJECTS.map(s => s.name);
    
    // Concurrently classify all extracted questions.
    const classificationPromises = questions.map(question =>
      classifyQuestion({ question, subjectList })
    );
    
    const results = await Promise.all(classificationPromises);

    // Filter out any null results or unclassified items.
    const classifiedQuestions: ClassifiedQuestion[] = results.filter((result): result is ClassifiedQuestion => 
        !!result && !!result.subject && !!result.topic
    );
    
    return { classifiedQuestions };
  }
);
