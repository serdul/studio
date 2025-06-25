
'use server';

import { extractQuestions } from '@/ai/flows/extract-questions';
import { explainQuestion } from '@/ai/flows/explain-question-flow';
import { classifyQuestions } from '@/ai/flows/classify-exam-questions';
import type { ExplainQuestionOutput, ClassifiedQuestion } from '@/ai/schemas';


function ensureApiKey() {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'The GOOGLE_API_KEY is not set. Please add it to your .env file to enable AI features.'
    );
  }
}

export async function processExamFileAction(
  fileDataUri: string
): Promise<ClassifiedQuestion[]> {
  ensureApiKey();
  try {
    // Step 1: Extract questions from the document
    const extractionResult = await extractQuestions({ fileDataUri });
    if (!extractionResult.questions || extractionResult.questions.length === 0) {
      return [];
    }

    // Step 2: Classify the extracted questions
    const classificationResult = await classifyQuestions({ questions: extractionResult.questions });
    return classificationResult.classifiedQuestions;
    
  } catch (error) {
    console.error('Error in processExamFileAction:', error);
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
