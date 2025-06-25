
'use server';
/**
 * @fileOverview A flow for classifying medical questions into subjects and topics.
 * This file implements a robust, concurrent approach to question classification by processing questions in batches.
 */

import {ai} from '@/ai/genkit';
import {
  type ClassifyQuestionsInput,
  type ClassifiedQuestion,
} from '@/ai/schemas';
import {z} from 'genkit';

// This is the main function exported to the rest of the application.
// It orchestrates the classification of multiple questions by processing them in batches to avoid overwhelming the server or hitting API rate limits.
export async function classifyQuestions(
  input: ClassifyQuestionsInput
): Promise<{classifiedQuestions: ClassifiedQuestion[]}> {
  const classifiedQuestions: ClassifiedQuestion[] = [];
  const batchSize = 10; // Process 10 questions at a time for stability.

  for (let i = 0; i < input.questions.length; i += batchSize) {
    const batch = input.questions.slice(i, i + batchSize);
    const promises = batch.map(question => classifyQuestionFlow({question}));

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      const originalQuestionIndex = i + index;
      if (result.status === 'fulfilled' && result.value) {
        // Combine the original question with the AI's classification.
        const fullQuestionData: ClassifiedQuestion = {
          question: input.questions[originalQuestionIndex],
          ...result.value,
        };

        // Provide a default rationale if the AI omits it.
        if (!fullQuestionData.rationale) {
          fullQuestionData.rationale =
            'The AI did not provide a rationale for this question.';
        }

        classifiedQuestions.push(fullQuestionData);
      } else if (result.status === 'rejected') {
        console.error(
          `Failed to classify question #${originalQuestionIndex + 1}: "${input.questions[
            originalQuestionIndex
          ].substring(0, 100)}..."`,
          result.reason
        );
        // We are choosing to skip failed questions instead of crashing the app.
      }
    });
  }

  return {classifiedQuestions};
}

// Define a schema for just the parts the AI will generate to save tokens.
const AIClassificationResultSchema = z.object({
  subject: z
    .string()
    .describe(
      "The major medical subject the question belongs to (e.g., 'Cardiology')."
    ),
  topic: z
    .string()
    .describe(
      "The specific, granular topic being tested (e.g., 'Atrial Fibrillation')."
    ),
  rationale: z
    .string()
    .optional()
    .describe(
      'A brief explanation for the chosen classification.'
    ),
});
type AIClassificationResult = z.infer<typeof AIClassificationResultSchema>;

// This flow is for classifying a SINGLE question.
const classifyQuestionFlow = ai.defineFlow(
  {
    name: 'classifyQuestionFlow',
    inputSchema: z.object({question: z.string()}),
    outputSchema: AIClassificationResultSchema,
  },
  async ({question}) => {
    const {output} = await classifyQuestionPrompt({question});

    if (!output) {
      throw new Error(
        'The AI failed to generate a classification for the question.'
      );
    }
    return output;
  }
);

// This prompt is for a SINGLE question.
const classifyQuestionPrompt = ai.definePrompt({
  name: 'classifyQuestionPrompt',
  input: {schema: z.object({question: z.string()})},
  output: {schema: AIClassificationResultSchema},
  prompt: `You are an expert medical educator and AI assistant. Your task is to analyze a single multiple-choice question (MCQ) and classify it into a major medical subject and a specific, granular topic.

**Major Subject List (You MUST use one of these):**
- Cardiology
- Pulmonology
- Gastroenterology
- Neurology
- Endocrinology
- Nephrology
- Hematology
- Rheumatology
- Infectious Disease
- Surgery
- Pediatrics
- Obstetrics & Gynecology
- Miscellaneous

**Instructions:**

1.  **Analyze the Question:** Read the provided question carefully.
2.  **Assign a Subject:** Assign ONE of the major subjects from the list above. Choose 'Miscellaneous' only if no other subject is a clear fit.
3.  **Define a Specific Topic:** Identify the most granular, specific topic being tested. For example, for a heart rhythm question, 'Atrial Fibrillation' is better than 'Arrhythmias'. For an IBD question, 'Crohn's Disease' is better than 'Gastroenterology'.
4.  **Provide Rationale (Optional but Recommended):** Write a brief, one-sentence rationale explaining *why* you chose that subject and topic.
5.  **Output Format:** Your final output MUST be a single, valid JSON object that strictly adheres to the output schema. It should only contain 'subject', 'topic', and optional 'rationale' fields. DO NOT include the original question text.

**Input Question:**
"{{{question}}}"
`,
});
