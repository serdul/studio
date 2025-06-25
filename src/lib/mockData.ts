import type { Subject } from './types';
import { Heart, Brain, Wind, Bone, Activity, Stethoscope, Baby, Scissors } from 'lucide-react';

export const MASTER_SUBJECTS: Subject[] = [
  { 
    name: 'Cardiology',
    icon: Heart,
    topics: [
      { name: 'Myocardial Infarction', count: 0, files: [], questions: [] },
      { name: 'Hypertension', count: 0, files: [], questions: [] },
      { name: 'Atrial Fibrillation', count: 0, files: [], questions: [] },
      { name: 'Heart Failure', count: 0, files: [], questions: [] },
      { name: 'Valvular Heart Disease', count: 0, files: [], questions: [] },
    ]
  },
  {
    name: 'Neurology',
    icon: Brain,
    topics: [
      { name: 'Ischemic Stroke', count: 0, files: [], questions: [] },
      { name: 'Parkinson\'s Disease', count: 0, files: [], questions: [] },
      { name: 'Epilepsy', count: 0, files: [], questions: [] },
      { name: 'Multiple Sclerosis', count: 0, files: [], questions: [] },
      { name: 'Migraine', count: 0, files: [], questions: [] },
    ]
  },
  {
    name: 'Pulmonology',
    icon: Wind,
    topics: [
      { name: 'Asthma', count: 0, files: [], questions: [] },
      { name: 'COPD', count: 0, files: [], questions: [] },
      { name: 'Pneumonia', count: 0, files: [], questions: [] },
      { name: 'Pulmonary Embolism', count: 0, files: [], questions: [] },
      { name: 'Tuberculosis', count: 0, files: [], questions: [] },
    ]
  },
  {
    name: 'Endocrinology',
    icon: Activity,
    topics: [
      { name: 'Diabetes Mellitus Type 2', count: 0, files: [], questions: [] },
      { name: 'Hypothyroidism', count: 0, files: [], questions: [] },
      { name: 'Cushing\'s Syndrome', count: 0, files: [], questions: [] },
      { name: 'Addison\'s Disease', count: 0, files: [], questions: [] },
      { name: 'Hyperthyroidism', count: 0, files: [], questions: [] },
    ]
  },
   {
    name: 'Gastroenterology',
    icon: Stethoscope,
    topics: [
      { name: 'Gastroesophageal Reflux Disease (GERD)', count: 0, files: [], questions: [] },
      { name: 'Inflammatory Bowel Disease', count: 0, files: [], questions: [] },
      { name: 'Peptic Ulcer Disease', count: 0, files: [], questions: [] },
      { name: 'Cirrhosis', count: 0, files: [], questions: [] },
    ]
  },
  {
    name: 'Rheumatology',
    icon: Bone,
    topics: [
      { name: 'Rheumatoid Arthritis', count: 0, files: [], questions: [] },
      { name: 'Systemic Lupus Erythematosus', count: 0, files: [], questions: [] },
      { name: 'Gout', count: 0, files: [], questions: [] },
      { name: 'Osteoarthritis', count: 0, files: [], questions: [] },
    ]
  },
  {
    name: 'Surgery',
    icon: Scissors,
    topics: [
        { name: 'Appendicitis', count: 0, files: [], questions: [] },
        { name: 'Hernia', count: 0, files: [], questions: [] },
        { name: 'Cholecystitis', count: 0, files: [], questions: [] },
        { name: 'Bowel Obstruction', count: 0, files: [], questions: [] },
        { name: 'Trauma Management', count: 0, files: [], questions: [] },
    ]
  },
  {
    name: 'Paediatrics',
    icon: Baby,
    topics: [
        { name: 'Neonatal Jaundice', count: 0, files: [], questions: [] },
        { name: 'Febrile Seizures', count: 0, files: [], questions: [] },
        { name: 'Bronchiolitis', count: 0, files: [], questions: [] },
        { name: 'Gastroenteritis', count: 0, files: [], questions: [] },
        { name: 'Growth and Development', count: 0, files: [], questions: [] },
    ]
  }
];
