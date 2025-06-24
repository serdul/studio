'use server';

import { classifyExamQuestions } from '@/ai/flows/classify-exam-questions';
import type { ClassifyExamQuestionsOutput } from '@/ai/flows/classify-exam-questions';

export async function classifyQuestionAction(
  question: string,
  masterTopicList: string
): Promise<ClassifyExamQuestionsOutput | null> {
  try {
    const result = await classifyExamQuestions({ question, masterTopicList });
    return result;
  } catch (error) {
    console.error('Error classifying question:', error);
    // In a real app, you might want to throw a more specific error
    // or return a structured error object.
    return null;
  }
}
