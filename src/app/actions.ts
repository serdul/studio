'use server';

import { processDocument } from '@/ai/flows/process-document';
import type { ProcessDocumentOutput } from '@/ai/flows/process-document';

export async function processDocumentAction(
  fileDataUri: string
): Promise<ProcessDocumentOutput> {
  if (!process.env.GOOGLE_API_KEY) {
    throw new Error(
      'The GOOGLE_API_KEY is not set. Please add it to your .env file to enable AI features.'
    );
  }

  try {
    const results = await processDocument({ fileDataUri });
    return results;
  } catch (error) {
    console.error('Error processing document action:', error);
    // Re-throw the error so the client-side catch block can display the raw message.
    throw new Error(String(error));
  }
}
