
'use server';

/**
 * @fileOverview An AI flow for explaining medical multiple-choice questions.
 *
 * - explainQuestion - Takes a medical MCQ and returns a detailed explanation,
 *   including rationale for the correct answer, explanations for distractors,
 *   and cited sources.
 */

import { ai } from '@/ai/genkit';
import {
  ExplainQuestionInputSchema,
  type ExplainQuestionInput,
  ExplainQuestionOutputSchema,
  type ExplainQuestionOutput,
} from '@/ai/schemas';

export async function explainQuestion(
  input: ExplainQuestionInput
): Promise<ExplainQuestionOutput> {
  return explainQuestionFlow(input);
}

const explainQuestionPrompt = ai.definePrompt({
  name: 'explainQuestionPrompt',
  input: { schema: ExplainQuestionInputSchema },
  output: { schema: ExplainQuestionOutputSchema },
  prompt: `You are an expert medical educator and AI assistant. Your task is to analyze a given multiple-choice question (MCQ) and provide a comprehensive, clear, and well-cited explanation.

**Input Question:**
{{{question}}}

**Your Task:**

1.  **Identify the Correct Answer:** First, determine which of the provided options is the correct answer to the question.
2.  **Explain the Correct Answer:** Provide a detailed rationale for why the correct answer is correct. Explain the underlying medical principles, pathology, or clinical reasoning.
3.  **Explain the Distractors:** For each incorrect option, provide a specific explanation for why it is wrong. Do not simply say "it is incorrect." Explain the concept behind the distractor and why it doesn't apply to this specific clinical scenario.
4.  **Cite Your Sources:** You MUST provide at least two credible, well-known medical sources to support your explanation. Examples include Harrison's Principles of Internal Medicine, Kumar & Clark's Clinical Medicine, NICE guidelines, or other authoritative medical textbooks or clinical guidelines. Format them clearly in the 'citations' array.
5.  **Output Format:** Your response MUST be a valid JSON object that strictly adheres to the provided output schema. Ensure all fields are populated correctly.

Example of a good explanation:
- **Correct Answer Explanation:** "This patient's presentation of sudden-onset, crushing chest pain radiating to the left arm, along with ECG changes showing ST-segment elevation in the anterior leads, is classic for an acute myocardial infarction (MI). The primary mechanism is the rupture of an atherosclerotic plaque leading to coronary artery thrombosis..."
- **Distractor Explanation (for 'Pulmonary Embolism'):** "While pulmonary embolism can present with sudden chest pain and shortness of breath, the pain is typically pleuritic (worse on inspiration), and the classic ECG finding is S1Q3T3, not ST elevation in leads V1-V4."
`,
});

const explainQuestionFlow = ai.defineFlow(
  {
    name: 'explainQuestionFlow',
    inputSchema: ExplainQuestionInputSchema,
    outputSchema: ExplainQuestionOutputSchema,
  },
  async ({ question }) => {
    const { output } = await explainQuestionPrompt({ question });

    if (!output) {
      throw new Error('The AI failed to generate an explanation for the question.');
    }
    
    return output;
  }
);
