import { config } from 'dotenv';
config();

import '@/ai/flows/classify-exam-questions.ts';
import '@/ai/flows/extract-questions.ts';
import '@/ai/flows/classify-questions.ts';
