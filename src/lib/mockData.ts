import type { Subject } from './types';
import { Heart, Brain, Wind, Bone, Activity, Stethoscope, Baby } from 'lucide-react';

export const MASTER_SUBJECTS: Subject[] = [
  { 
    name: 'Cardiology',
    icon: Heart,
    topics: [
      { name: 'Myocardial Infarction', count: 0, files: [] },
      { name: 'Hypertension', count: 0, files: [] },
      { name: 'Atrial Fibrillation', count: 0, files: [] },
      { name: 'Heart Failure', count: 0, files: [] },
      { name: 'Valvular Heart Disease', count: 0, files: [] },
    ]
  },
  {
    name: 'Neurology',
    icon: Brain,
    topics: [
      { name: 'Ischemic Stroke', count: 0, files: [] },
      { name: 'Parkinson\'s Disease', count: 0, files: [] },
      { name: 'Epilepsy', count: 0, files: [] },
      { name: 'Multiple Sclerosis', count: 0, files: [] },
      { name: 'Migraine', count: 0, files: [] },
    ]
  },
  {
    name: 'Pulmonology',
    icon: Wind,
    topics: [
      { name: 'Asthma', count: 0, files: [] },
      { name: 'COPD', count: 0, files: [] },
      { name: 'Pneumonia', count: 0, files: [] },
      { name: 'Pulmonary Embolism', count: 0, files: [] },
      { name: 'Tuberculosis', count: 0, files: [] },
    ]
  },
  {
    name: 'Endocrinology',
    icon: Activity,
    topics: [
      { name: 'Diabetes Mellitus Type 2', count: 0, files: [] },
      { name: 'Hypothyroidism', count: 0, files: [] },
      { name: 'Cushing\'s Syndrome', count: 0, files: [] },
      { name: 'Addison\'s Disease', count: 0, files: [] },
      { name: 'Hyperthyroidism', count: 0, files: [] },
    ]
  },
   {
    name: 'Gastroenterology',
    icon: Stethoscope,
    topics: [
      { name: 'Gastroesophageal Reflux Disease (GERD)', count: 0, files: [] },
      { name: 'Inflammatory Bowel Disease', count: 0, files: [] },
      { name: 'Peptic Ulcer Disease', count: 0, files: [] },
      { name: 'Cirrhosis', count: 0, files: [] },
    ]
  },
  {
    name: 'Rheumatology',
    icon: Bone,
    topics: [
      { name: 'Rheumatoid Arthritis', count: 0, files: [] },
      { name: 'Systemic Lupus Erythematosus', count: 0, files: [] },
      { name: 'Gout', count: 0, files: [] },
      { name: 'Osteoarthritis', count: 0, files: [] },
    ]
  }
];

// This simulates the text extracted from an uploaded PDF.
export const MOCK_QUESTIONS: string[] = [
  "A 65-year-old male with a history of smoking presents with sudden onset of crushing substernal chest pain radiating to his left arm. ECG shows ST-segment elevation in leads V1-V4. What is the most likely diagnosis?",
  "A 55-year-old female is found to have a blood pressure of 160/100 mmHg on three separate occasions. She has no other medical problems. What is the most appropriate initial medication?",
  "A 72-year-old patient with a history of hypertension and diabetes presents with an irregularly irregular rhythm on ECG. What is the primary goal of management to prevent stroke?",
  "A 45-year-old patient with chronic shortness of breath and wheezing, which worsens at night and with exercise. Spirometry shows a reversible obstructive pattern. What is the cornerstone of long-term management?",
  "A 78-year-old male presents with sudden-onset right-sided weakness and aphasia. A non-contrast CT scan of the head is negative for hemorrhage. What is the next best step in management?",
  "A 68-year-old retired teacher complains of a resting tremor, bradykinesia, and rigidity. What is the underlying pathophysiology of this condition?",
  "A 25-year-old female presents with recurrent episodes of severe, throbbing unilateral headache, accompanied by photophobia and phonophobia. What class of medication is used for abortive therapy?",
  "A 60-year-old obese male complains of frequent urination, excessive thirst, and unexplained weight loss. A random blood glucose level is 250 mg/dL. Which diagnosis is most likely?",
  "A 40-year-old female presents with fatigue, weight gain, and cold intolerance. Physical exam reveals a diffusely enlarged, non-tender thyroid gland. TSH is elevated and free T4 is low. What is the diagnosis?",
  "A patient with known chronic obstructive pulmonary disease presents with increased dyspnea and sputum production. What is the most common bacterial cause of an acute exacerbation?",
  "A patient is admitted with pleuritic chest pain and shortness of breath after a long-haul flight. A V/Q scan shows a high probability mismatch. What is the standard treatment?",
  "A patient complains of burning epigastric pain that is relieved by food. Endoscopy reveals a small ulcer in the duodenal bulb. What is the most common etiology?",
  "A 30-year-old woman with a history of recurrent oral ulcers and arthritis presents with chronic bloody diarrhea. Colonoscopy shows continuous inflammation from the rectum proximally. What is the likely diagnosis?",
];
