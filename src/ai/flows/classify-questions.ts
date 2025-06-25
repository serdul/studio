
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
  type ClassifiedQuestion,
} from '@/ai/schemas';
import { classifyQuestion } from './classify-exam-questions';
import { MASTER_SUBJECTS } from '@/lib/mockData';


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
    
    // Use Promise.allSettled to handle individual failures without crashing the entire batch.
    const settledResults = await Promise.allSettled(classificationPromises);

    const classifiedQuestions: ClassifiedQuestion[] = [];
    for (const result of settledResults) {
      if (result.status === 'fulfilled') {
        const classified = result.value;
        // Ensure the fulfilled promise has valid data before adding.
        if (classified && classified.subject && classified.topic) {
          classifiedQuestions.push(classified);
        }
      } else {
        // Log the reason for the failed promise for debugging, but don't crash.
        console.error("A question failed to classify:", result.reason);
      }
    }
    
    return { classifiedQuestions };
  }
);
