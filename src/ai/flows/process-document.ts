'use server';
/**
 * @fileOverview A flow for processing an entire exam document.
 * It converts each page of a PDF into an image, uses a multi-modal AI prompt
 * to extract questions from each page image, classifies each question,
 * and returns the aggregated results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { classifyExamQuestions } from './classify-exam-questions';
import type { ClassifyExamQuestionsOutput } from './classify-exam-questions';

import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import {createCanvas, type Canvas, type CanvasRenderingContext2D} from 'canvas';

// Helper class to act as a factory for node-canvas instances.
// pdf.js requires this to render pages in a Node.js environment.
class NodeCanvasFactory {
  create(width: number, height: number): { canvas: Canvas; context: CanvasRenderingContext2D } {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d");
    return {
      canvas,
      context,
    };
  }

  reset(canvasAndContext: { canvas: Canvas; context: CanvasRenderingContext2D }, width: number, height: number) {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  }

  destroy(canvasAndContext: { canvas: Canvas; context: CanvasRenderingContext2D }) {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    // These lines are not strictly necessary with the 'canvas' package, but are good practice.
    // @ts-ignore
    canvasAndContext.canvas = null;
    // @ts-ignore
    canvasAndContext.context = null;
  }
}


const ProcessDocumentInputSchema = z.object({
  fileDataUri: z.string().describe("A file (PDF) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."),
  masterTopicList: z.string().describe('A list of predefined topics.'),
});
export type ProcessDocumentInput = z.infer<typeof ProcessDocumentInputSchema>;

const ProcessDocumentOutputSchema = z.object({
  questionsFound: z.number(),
  classifiedTopics: z.array(z.custom<ClassifyExamQuestionsOutput>()),
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
    output: { schema: z.object({ questions: z.array(z.string().describe("A single, complete question. For MCQs, include the stem and all options. For SEQs, include the full question text, including the clinical scenario for sub-questions. Exclude any provided answers.")) }) },
    prompt: `You are an expert AI assistant specializing in parsing medical exam documents. Your task is to meticulously extract all questions from the provided image of a document page. Analyze its visual layout and perform OCR as needed to extract the text.

{{media url=documentUri}}

Your goal is to identify and list every complete question on this single page.

**Question Formatting Rules:**

*   **For Multiple-Choice Questions (MCQs):** A complete question includes the question stem and all of its associated options (e.g., a, b, c, d, e).
*   **For Short-Essay Questions (SEQs):** If a clinical scenario is followed by sub-questions (e.g., 1.1, 1.2), you MUST combine the main scenario text with *each* sub-question. This ensures every extracted question is a standalone item with full context.

**Crucial Extraction Instructions:**

1.  **IGNORE ALL ANSWERS:** Do not include any text that is an answer, a rationale, or a principle of management. This is the most important rule. For example, if you see "1. Full blood count" or "A. The correct answer is..." following a question, you must ignore it completely.
2.  **IGNORE METADATA & NOISE:** Ignore all non-question text. This includes page headers, footers, page numbers, compiler names, timestamps, and watermarks. For example, you must ignore text like "GENERAL SIR JOHN KOTELAWALA DEFENCE UNIVERSITY", "SURGERY - MCQ", "Duration 02 Hours", "KDU SEQ Paediatrics", "Intake 27 Proper 27 August 2014", or "Scanned with CamScanner".
3.  **OUTPUT FORMAT:** Return the result as a JSON object with a single key "questions" which contains an array of strings. Each string in the array must be a full, complete question. If you cannot find any questions that match the criteria, return an empty array for the "questions" key.
`,
});

const processDocumentFlow = ai.defineFlow(
  {
    name: 'processDocumentFlow',
    inputSchema: ProcessDocumentInputSchema,
    outputSchema: ProcessDocumentOutputSchema,
  },
  async ({ fileDataUri, masterTopicList }) => {
    const allQuestions: string[] = [];
    const pdfData = Buffer.from(fileDataUri.split(',')[1], 'base64');

    const pdfDocument = await pdfjs.getDocument({
        data: pdfData,
        disableWorker: true,
    }).promise;

    const numPages = pdfDocument.numPages;
    const canvasFactory = new NodeCanvasFactory();

    for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Use a higher scale for better OCR quality
        const canvasAndContext = canvasFactory.create(viewport.width, viewport.height);

        const renderContext = {
            canvasContext: canvasAndContext.context,
            viewport,
            canvasFactory,
        };

        await page.render(renderContext).promise;
        const imageDataUri = canvasAndContext.canvas.toDataURL('image/jpeg');

        const extractionResult = await extractQuestionsPrompt({ documentUri: imageDataUri });
        const questionsOnPage = extractionResult.output?.questions || [];
        allQuestions.push(...questionsOnPage);
        
        // Clean up memory
        page.cleanup();
        canvasFactory.destroy(canvasAndContext);
    }

    const questionsFound = allQuestions.length;
    
    if (questionsFound === 0) {
      console.log("AI could not identify any questions in the document.");
      return { questionsFound: 0, classifiedTopics: [] };
    }

    // Concurrently classify all questions
    const classificationPromises = allQuestions.map(question =>
      classifyExamQuestions({ question, masterTopicList })
    );
    
    const results = await Promise.all(classificationPromises);

    // Filter out any null results from errors and non-matches
    const classifiedTopics = results.filter((result): result is ClassifyExamQuestionsOutput => !!result && result.topic !== 'Other');
    
    return { questionsFound, classifiedTopics };
  }
);
