'use server';

import { extractQuestions } from '@/ai/flows/extract-questions';
import { classifyQuestions } from '@/ai/flows/classify-questions';
import type { ClassifiedQuestion } from '@/lib/types';


function ensureApiKey() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'The GOOGLE_API_KEY is not set. Please add it to your .env file to enable AI features.'
    );
  }
}

export async function extractQuestionsAction(
  fileDataUri: string
): Promise<string[]> {
  ensureApiKey();
  try {
    const result = await extractQuestions({ fileDataUri });
    return result.questions;
  } catch (error) {
    console.error('Error in extractQuestionsAction:', error);
    throw new Error(String(error));
  }
}

export async function classifyQuestionsAction(
  questions: string[]
): Promise<ClassifiedQuestion[]> {
  ensureApiKey();
  try {
    const result = await classifyQuestions({ questions });
    return result.classifiedQuestions;
  } catch (error) {
    console.error('Error in classifyQuestionsAction:', error);
    throw new Error(String(error));
  }
}
