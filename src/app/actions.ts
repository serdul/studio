'use server';

import { processDocument } from '@/ai/flows/process-document';
import type { ProcessDocumentOutput } from '@/ai/flows/process-document';

export async function processDocumentAction(
  fileDataUri: string,
  masterTopicList: string
): Promise<ProcessDocumentOutput> {
  try {
    const results = await processDocument({ fileDataUri, masterTopicList });
    return results;
  } catch (error) {
    console.error('Error processing document:', error);
    // In a real app, you might want to throw a more specific error
    // or return a structured error object.
    return [];
  }
}
