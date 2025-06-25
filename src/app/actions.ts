'use server';

import { processDocument } from '@/ai/flows/process-document';
import type { ProcessDocumentOutput } from '@/ai/flows/process-document';

export async function processDocumentAction(
  fileDataUri: string,
  masterTopicList: string
): Promise<ProcessDocumentOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'The GOOGLE_API_KEY is not set. Please add it to your .env file to enable AI features.'
    );
  }

  try {
    const results = await processDocument({ fileDataUri, masterTopicList });
    return results;
  } catch (error) {
    console.error('Error processing document action:', error);
    // Re-throw the error so the client-side catch block can display a useful message.
    if (error instanceof Error) {
        throw new Error(error.message || 'An unknown error occurred during AI analysis.');
    }
    throw new Error('An unknown error occurred during AI analysis.');
  }
}
