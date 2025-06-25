import type { Subject } from './types';
import { Heart, Brain, Wind, Bone, Activity, Stethoscope, Baby, Scissors } from 'lucide-react';

export const MASTER_SUBJECTS: Subject[] = [
  { 
    name: 'Cardiology',
    icon: Heart,
    topics: [
      { name: 'Myocardial Infarction', questions: [] },
      { name: 'Hypertension', questions: [] },
      { name: 'Atrial Fibrillation', questions: [] },
      { name: 'Heart Failure', questions: [] },
      { name: 'Valvular Heart Disease', questions: [] },
    ]
  },
  {
    name: 'Neurology',
    icon: Brain,
    topics: [
      { name: 'Ischemic Stroke', questions: [] },
      { name: 'Parkinson\'s Disease', questions: [] },
      { name: 'Epilepsy', questions: [] },
      { name: 'Multiple Sclerosis', questions: [] },
      { name: 'Migraine', questions: [] },
    ]
  },
  {
    name: 'Pulmonology',
    icon: Wind,
    topics: [
      { name: 'Asthma', questions: [] },
      { name: 'COPD', questions: [] },
      { name: 'Pneumonia', questions: [] },
      { name: 'Pulmonary Embolism', questions: [] },
      { name: 'Tuberculosis', questions: [] },
    ]
  },
  {
    name: 'Endocrinology',
    icon: Activity,
    topics: [
      { name: 'Diabetes Mellitus Type 2', questions: [] },
      { name: 'Hypothyroidism', questions: [] },
      { name: 'Cushing\'s Syndrome', questions: [] },
      { name: 'Addison\'s Disease', questions: [] },
      { name: 'Hyperthyroidism', questions: [] },
    ]
  },
   {
    name: 'Gastroenterology',
    icon: Stethoscope,
    topics: [
      { name: 'Gastroesophageal Reflux Disease (GERD)', questions: [] },
      { name: 'Inflammatory Bowel Disease', questions: [] },
      { name: 'Peptic Ulcer Disease', questions: [] },
      { name: 'Cirrhosis', questions: [] },
    ]
  },
  {
    name: 'Rheumatology',
    icon: Bone,
    topics: [
      { name: 'Rheumatoid Arthritis', questions: [] },
      { name: 'Systemic Lupus Erythematosus', questions: [] },
      { name: 'Gout', questions: [] },
      { name: 'Osteoarthritis', questions: [] },
    ]
  },
  {
    name: 'Surgery',
    icon: Scissors,
    topics: [
        { name: 'Appendicitis', questions: [] },
        { name: 'Hernia', questions: [] },
        { name: 'Cholecystitis', questions: [] },
        { name: 'Bowel Obstruction', questions: [] },
        { name: 'Trauma Management', questions: [] },
    ]
  },
  {
    name: 'Paediatrics',
    icon: Baby,
    topics: [
        { name: 'Neonatal Jaundice', questions: [] },
        { name: 'Febrile Seizures', questions: [] },
        { name: 'Bronchiolitis', questions: [] },
        { name: 'Gastroenteritis', questions: [] },
        { name: 'Growth and Development', questions: [] },
    ]
  }
];
