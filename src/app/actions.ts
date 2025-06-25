
'use server';

import { extractQuestions } from '@/ai/flows/extract-questions';
import { explainQuestion } from '@/ai/flows/explain-question-flow';
import type { ExplainQuestionOutput } from '@/ai/schemas';


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

export async function explainQuestionAction(
  question: string
): Promise<ExplainQuestionOutput> {
  ensureApiKey();
  try {
    const result = await explainQuestion({ question });
    return result;
  } catch (error) {
    console.error('Error in explainQuestionAction:', error);
    throw new Error(String(error));
  }
}
