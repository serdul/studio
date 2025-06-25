'use server';
import {config} from 'dotenv';
config();

import '@/ai/flows/classify-exam-questions';
import '@/ai/flows/explain-question-flow';
