'use server';
/**
 * @fileOverview A flow for processing an entire exam document.
 * It uses a multi-modal AI prompt to extract questions from the document,
 * classifies each question, and returns the aggregated results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { classifyExamQuestions } from './classify-exam-questions';
import type { ClassifyExamQuestionsOutput } from './classify-exam-questions';

const ProcessDocumentInputSchema = z.object({
  fileDataUri: z.string().describe("A file (PDF or image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
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
    input: { schema: z.object({ documentUri: z.string() }) },
    output: { schema: z.object({ questions: z.array(z.string().describe("A single, complete question. For MCQs, include the stem and all options. For SEQs, include the full question text, including the clinical scenario for sub-questions. Exclude any provided answers.")) }) },
    prompt: `You are an expert at parsing medical exam documents. Your task is to extract all questions from the provided document, regardless of their format (e.g., multiple-choice, short-essay).
The document is provided as media, which could be an image or a multi-page PDF. Analyze its visual layout and perform OCR if necessary to extract the questions.

{{media url=documentUri}}

Each item in the output array should be a single string containing one full, complete question.

- **For Multiple-Choice Questions (MCQs):** A complete question includes the question stem and all of its associated options (e.g., a, b, c, d, e).
- **For Short-Essay Questions (SEQs):** If there is a main clinical scenario followed by sub-questions (like 1.1, 1.2), combine the main scenario text with *each* sub-question to form a complete, standalone question. This ensures each question has full context for analysis.

**CRUCIAL INSTRUCTIONS:**
1.  **IGNORE ANSWERS:** You MUST NOT include any text that is an answer, a rationale, or a principle of management. Only extract the question content itself. For example, if you see "1. Full blood count" following a question about investigations, ignore it.
2.  **IGNORE METADATA:** Ignore all non-question text like page headers, footers, page numbers, or compiler names. For example, you must ignore text like "GENERAL SIR JOHN KOTELAWALA DEFENCE UNIVERSITY", "SURGERY - MCQ", "Duration 02 Hours", "Duplicate copy prepared by Intake 31 MMS", "KDU SEQ Paediatrics", or "Intake 27 Proper 27 August 2014".
`,
});

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessDocumentOutputSchema,
  },
  async ({ fileDataUri, masterTopicList }) => {
    try {
      const extractionResult = await extractQuestionsPrompt({ documentUri: fileDataUri });
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
