'use server';
/**
 * @fileOverview A flow for extracting questions from a document.
 * It uses a multi-modal AI prompt to extract questions from the entire file.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  ExtractQuestionsInputSchema,
  type ExtractQuestionsInput,
  ExtractQuestionsOutputSchema,
  type ExtractQuestionsOutput,
} from '@/ai/schemas';

export async function extractQuestions(
  input: ExtractQuestionsInput
): Promise<ExtractQuestionsOutput> {
  return extractQuestionsFlow(input);
}

const extractQuestionsPrompt = ai.definePrompt({
    name: 'extractQuestionsFromDocument',
    input: { schema: z.object({ documentUri: z.string() }) },
    output: { schema: ExtractQuestionsOutputSchema },
    prompt: `You are an expert AI assistant specializing in parsing medical exam documents. Your task is to meticulously extract all questions from the provided document. Analyze its visual layout across all pages and perform OCR as needed to extract the text.

{{media url=documentUri}}

Your goal is to identify and list every complete question in the entire document.

**Question Formatting Rules:**

*   **For Multiple-Choice Questions (MCQs):** A complete question includes the question stem and all of its associated options (e.g., a, b, c, d, e).
*   **For Short-Essay Questions (SEQs):** If a clinical scenario is followed by sub-questions (e.g., 1.1, 1.2), you MUST combine the main scenario text with *each* sub-question. This ensures every extracted question is a standalone item with full context.

**Crucial Extraction Instructions:**

1.  **IGNORE ALL ANSWERS:** Do not include any text that is an answer, a rationale, or a principle of management. This is the most important rule. For example, if you see "1. Full blood count" or "A. The correct answer is..." following a question, you must ignore it completely.
2.  **IGNORE METADATA & NOISE:** Ignore all non-question text. This includes page headers, footers, page numbers, compiler names, timestamps, and watermarks. For example, you must ignore text like "GENERAL SIR JOHN KOTELAWALA DEFENCE UNIVERSITY", "SURGERY - MCQ", "Duration 02 Hours", "KDU SEQ Paediatrics", "Intake 27 Proper 27 August 2014", or "Scanned with CamScanner".
3.  **POLISH THE TEXT:** After extracting a question, correct any grammatical errors, spelling mistakes, or OCR artifacts to ensure the final text is clean, professional, and easy to read. Preserve the original medical terminology.
4.  **OUTPUT FORMAT:** Your final output MUST be a single, valid JSON object. The object must have a single key "questions" which contains an array of strings. If you find no valid questions in the document, or if you encounter an error you cannot recover from, you MUST return a JSON object with an empty array: {"questions": []}. Do not output any other text, apologies, or explanations.
`,
});

const extractQuestionsFlow = ai.defineFlow(
  {
    name: 'extractQuestionsFlow',
    inputSchema: ExtractQuestionsInputSchema,
    outputSchema: ExtractQuestionsOutputSchema,
  },
  async ({ fileDataUri }) => {
    const extractionResult = await extractQuestionsPrompt({ documentUri: fileDataUri });
    return extractionResult.output || { questions: [] };
  }
);
