import type { Subject } from './types';
import { Heart, Brain, Wind, Bone, Activity, Stethoscope, Baby, Scissors } from 'lucide-react';

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
  },
  {
    name: 'Surgery',
    icon: Scissors,
    topics: [
        { name: 'Appendicitis', count: 0, files: [] },
        { name: 'Hernia', count: 0, files: [] },
        { name: 'Cholecystitis', count: 0, files: [] },
        { name: 'Bowel Obstruction', count: 0, files: [] },
        { name: 'Trauma Management', count: 0, files: [] },
    ]
  },
  {
    name: 'Paediatrics',
    icon: Baby,
    topics: [
        { name: 'Neonatal Jaundice', count: 0, files: [] },
        { name: 'Febrile Seizures', count: 0, files: [] },
        { name: 'Bronchiolitis', count: 0, files: [] },
        { name: 'Gastroenteritis', count: 0, files: [] },
        { name: 'Growth and Development', count: 0, files: [] },
    ]
  }
];
