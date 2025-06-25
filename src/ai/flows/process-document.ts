'use server';
/**
 * @fileOverview A flow for processing an entire exam document.
 * It uses an AI prompt to extract questions from the document text,
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

const extractQuestionsPrompt = ai.definePrompt({
    name: 'extractQuestionsFromDocument',
    input: { schema: z.object({ documentText: z.string() }) },
    output: { schema: z.object({ questions: z.array(z.string().describe("A single, complete question. For MCQs, include the stem and all options. For SEQs, include the full question text. Exclude any provided answers.")) }) },
    prompt: `You are an expert at parsing text from medical exam documents. Your task is to extract all questions, regardless of their format (e.g., multiple-choice, short-essay).
Each item in the output array should be a single string containing the full question.
- For multiple-choice questions, this includes the stem and all of its associated options (e.g., a, b, c, d, e).
- For short-essay questions, this includes the full text of the question.
It is very important that you **ignore any answers** that may be included with the questions in the document. Only extract the question content itself.
Also, ignore any text that is not part of a question, such as page headers, footers, page numbers, or compiler names.

Document Text:
{{{documentText}}}
`,
});

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

      const extractionResult = await extractQuestionsPrompt({ documentText: text });
      const questions = extractionResult.output?.questions || [];
      
      if (questions.length === 0) {
        console.log("AI could not identify any questions in the document.");
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
