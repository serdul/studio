
'use server';

/**
 * @fileOverview A flow for classifying exam questions into subjects and dynamically identifying topics.
 *
 * - classifyQuestion - A function that handles the classification of an exam question.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {
  ClassifyQuestionInputSchema,
  type ClassifyQuestionInput,
  ClassifiedQuestionSchema,
  type ClassifiedQuestion,
} from '@/ai/schemas';

export async function classifyQuestion(
  input: ClassifyQuestionInput
): Promise<ClassifiedQuestion> {
  // Note: We are intentionally not returning the full ClassifiedQuestion schema from the flow
  // because the `question` text is already available in the input. We'll add it back in the
  // flow's return statement to avoid unnecessary data transfer from the AI model.
  const { subject, topic, rationale } = await classifyQuestionFlow(input);
  return {
    question: input.question,
    subject,
    topic,
    rationale,
  };
}

const classifyQuestionPrompt = ai.definePrompt({
  name: 'classifyQuestionPrompt',
  input: {schema: ClassifyQuestionInputSchema},
  output: {schema: z.object({
    subject: z.string().describe('The classified subject for the question. Must be one of the provided subjects.'),
    topic: z.string().describe('The dynamically identified, generalized topic for the question.'),
    rationale: z.string().describe("A brief explanation of why this subject and topic were chosen. Explain your reasoning, especially if the topic is newly improvised or the question was ambiguous."),
  })},
  prompt: `You are an expert medical exam question classifier. Your task is to analyze a given medical question and assign it to a single subject and a single, generalized topic. You should also provide a brief rationale for your choice.

**Input Question:**
{{{question}}}

**Guidelines for Analysis:**

1.  **Subject Classification:** Your first goal is to classify the question into one, and only one, of the following subjects:
    {{#each subjectList}}
    - {{{this}}}
    {{/each}}
    Choose the single best fit.

2.  **Topic Generalization:** Your second goal is to identify the core medical topic. It's important that your topic is a general, high-level concept.
    *   **Guideline:** Consolidate specific variations into a single, core topic. For example, a question about 'management of inflammatory bowel disease' and a question about 'pathology of inflammatory bowel disease' should both be assigned the topic 'Inflammatory Bowel Disease'. Similarly, 'treatment of myocardial infarction' should be assigned the topic 'Myocardial Infarction'. Use this principle to improvise and create generalized topics for other questions.

3.  **Rationale:** Briefly explain your reasoning for the classification in the 'rationale' field. For example: "This question concerns the treatment of a specific heart condition, so it was classified under Cardiology with the topic 'Myocardial Infarction'."

4.  **Output Format:** Your response MUST be a JSON object with three keys: "subject", "topic", and "rationale".
  `,
});

const classifyQuestionFlow = ai.defineFlow(
  {
    name: 'classifyQuestionFlow',
    inputSchema: ClassifyQuestionInputSchema,
    // Note: The flow's output schema is different from the prompt's output schema
    // because the prompt only generates the core fields, and we add the question back in the flow.
    outputSchema: ClassifiedQuestionSchema.omit({ question: true }),
  },
  async input => {
    const {output} = await classifyQuestionPrompt(input);
    
    if (!output || !output.subject || !output.topic) {
        // This will be caught by Promise.allSettled in the calling flow.
        throw new Error('AI failed to return a valid classification for the question.');
    }

    return {
      subject: output.subject,
      topic: output.topic,
      rationale: output.rationale || 'No rationale provided by AI.',
    };
  }
);
