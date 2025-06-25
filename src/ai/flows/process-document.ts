'use server';
/**
 * @fileOverview A flow for processing an entire exam document.
 * It uses a multi-modal AI prompt to extract questions from the entire PDF,
 * classifies each question, and returns the aggregated results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { classifyQuestion } from './classify-exam-questions';
import { MASTER_SUBJECTS } from '@/lib/mockData';

const ProcessDocumentInputSchema = z.object({
  fileDataUri: z.string().describe("A file (PDF or image) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const ClassifiedQuestionSchema = z.object({
    question: z.string(),
    subject: z.string(),
    topic: z.string(),
});

const ProcessDocumentOutputSchema = z.object({
  questionsFound: z.number(),
  classifiedQuestions: z.array(ClassifiedQuestionSchema),
});
export type ProcessDocumentOutput = z.infer<typeof ProcessDocumentOutputSchema>;

export async function processDocument(
  input: ProcessDocumentInput
): Promise<ProcessDocumentOutput> {
  return processDocumentFlow(input);
}

const extractQuestionsPrompt = ai.definePrompt({
    name: 'extractQuestionsFromDocument',
    input: { schema: z.object({ documentUri: z.string() }) },
    output: { schema: z.object({ questions: z.array(z.string().describe("A single, complete question that has been grammatically corrected and polished. For MCQs, include the stem and all options. For SEQs, include the full question text, including the clinical scenario for sub-questions. Exclude any provided answers.")) }) },
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
4.  **OUTPUT FORMAT:** You MUST return the result as a valid JSON object. The object must have a single key "questions" which contains an array of strings. Each string in the array must be a full, complete question. If you cannot find any questions that match the criteria, you MUST return an empty array for the "questions" key, like this: \`{"questions": []}\`. Do not return any other format.
`,
});

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessDocumentOutputSchema,
  },
  async ({ fileDataUri }) => {
    
    // Step 1: Extract all questions from the entire document in a single AI call.
    const extractionResult = await extractQuestionsPrompt({ documentUri: fileDataUri });
    const allQuestions = extractionResult.output?.questions || [];

    const questionsFound = allQuestions.length;
    
    if (questionsFound === 0) {
      console.log("AI could not identify any questions in the document.");
      return { questionsFound: 0, classifiedQuestions: [] };
    }

    // Step 2: Concurrently classify all extracted questions.
    const subjectList = MASTER_SUBJECTS.map(s => s.name);
    const classificationPromises = allQuestions.map(question =>
      classifyQuestion({ question, subjectList })
    );
    
    const results = await Promise.all(classificationPromises);

    // Step 3: Filter out any null results or unclassified items.
    const classifiedQuestions = results.filter((result): result is { question: string, subject: string, topic: string } => 
        !!result && !!result.subject && !!result.topic
    );
    
    return { questionsFound, classifiedQuestions };
  }
);
