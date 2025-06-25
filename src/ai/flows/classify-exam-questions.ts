'use server';
/**
 * @fileOverview A flow for classifying medical questions into subjects and topics.
 */

import {ai} from '@/ai/genkit';
import {
  ClassifyQuestionsInputSchema,
  type ClassifyQuestionsInput,
  ClassifyQuestionsOutputSchema,
  type ClassifyQuestionsOutput,
} from '@/ai/schemas';
import {z} from 'zod';

export async function classifyQuestions(
  input: ClassifyQuestionsInput
): Promise<ClassifyQuestionsOutput> {
  const anwser = await classifyQuestionsFlow(input);
  // Due to a bug in Genkit we have to manually validate the output.
  // TODO: remove this once the bug is fixed.
  for (const q of anwser.classifiedQuestions) {
    if (!q.rationale) {
      q.rationale = 'The AI did not provide a rationale for this question.';
    }
  }
  return anwser;
}

const classifyQuestionsPrompt = ai.definePrompt({
  name: 'classifyQuestionsPrompt',
  input: {schema: ClassifyQuestionsInputSchema},
  output: {schema: ClassifyQuestionsOutputSchema},
  prompt: `You are an expert medical educator and AI assistant. Your task is to analyze a list of multiple-choice questions (MCQs) and classify each one into a major medical subject and a specific, granular topic.

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

1.  **Analyze Each Question:** For each question in the input array, perform the following steps.
2.  **Assign a Subject:** Assign one of the major subjects from the list above. Choose 'Miscellaneous' only if no other subject is a clear fit.
3.  **Define a Specific Topic:** Identify the most granular, specific topic being tested. For example, for a question about heart rhythms, 'Atrial Fibrillation' is better than 'Arrhythmias'. For a question about IBD, 'Crohn's Disease' is better than 'Gastroenterology'.
4.  **Provide Rationale:** Write a brief, one-sentence rationale explaining *why* you chose that subject and topic. This is especially important for complex questions or when you need to improvise a topic not explicitly mentioned.
5.  **Maintain Original Question:** The 'question' field in your output object MUST be the exact, unmodified text of the original question.
6.  **Output Format:** Your final output MUST be a single, valid JSON object that strictly adheres to the provided output schema. It must contain a single key, "classifiedQuestions", which is an array of objects.

**Input Questions:**
\`\`\`json
{{{jsonStringify questions}}}
\`\`\`
`,
});

const classifyQuestionsFlow = ai.defineFlow(
  {
    name: 'classifyQuestionsFlow',
    inputSchema: ClassifyQuestionsInputSchema,
    outputSchema: ClassifyQuestionsOutputSchema,
  },
  async ({questions}) => {
    const {output} = await classifyQuestionsPrompt({questions});

    if (!output) {
      throw new Error(
        'The AI failed to generate a classification for the questions.'
      );
    }
    return output;
  }
);
