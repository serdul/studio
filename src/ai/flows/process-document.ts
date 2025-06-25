'use server';
/**
 * @fileOverview A flow for processing an entire exam document.
 * It extracts text from the document, identifies questions,
 * classifies each question, and returns the aggregated results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { classifyExamQuestions } from './classify-exam-questions';
import type { ClassifyExamQuestionsOutput } from './classify-exam-questions';

const ProcessDocumentInputSchema = z.object({
  fileBufferStr: z.string().describe('The PDF file content as a base64 encoded string.'),
  masterTopicList: z.string().describe('A list of predefined topics.'),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const ProcessDocumentOutputSchema = z.array(z.custom<ClassifyExamQuestionsOutput>());
export type ProcessDocumentOutput = z.infer<typeof ProcessDocumentOutputSchema>;

export async function processDocument(
  input: ProcessDocumentInput
): Promise<ProcessDocumentOutput> {
  return processDocumentFlow(input);
}

// A regex to split text into questions.
// It looks for a number followed by a period or parenthesis and a space.
const questionRegex = /\d+[.)]\s+([\s\S]*?)(?=\n\d+[.)]\s+|$)/g;

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessDocumentOutputSchema,
  },
  async ({ fileBufferStr, masterTopicList }) => {
    try {
      const pdf = (await import('pdf-parse')).default;
      const fileBuffer = Buffer.from(fileBufferStr, 'base64');
      const data = await pdf(fileBuffer);

      const text = data.text;
      const questions: string[] = [];
      let match;
      while ((match = questionRegex.exec(text)) !== null) {
          questions.push(match[1].trim());
      }
      
      if (questions.length === 0) {
        // Fallback: if regex fails, split by newline and filter for longer lines that are likely questions.
        questions.push(...text.split('\n').filter(line => line.trim().length > 50));
      }

      if (questions.length === 0) {
        console.log("No questions found in the document.");
        return [];
      }

      // Concurrently classify all questions
      const classificationPromises = questions.map(question =>
        classifyExamQuestions({ question, masterTopicList })
      );
      
      const results = await Promise.all(classificationPromises);

      // Filter out any null results from errors and non-matches
      return results.filter((result): result is ClassifyExamQuestionsOutput => !!result && result.topic !== 'Other');

    } catch (error) {
      console.error("Error processing document in flow:", error);
      return [];
    }
  }
);
