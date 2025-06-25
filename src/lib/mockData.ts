import type { Subject } from './types';
import { Heart, Brain, Wind, Bone, Activity, Stethoscope, Baby, Scissors } from 'lucide-react';

export const MASTER_SUBJECTS: Subject[] = [
  { 
    name: 'Cardiology',
    icon: Heart,
    topics: []
  },
  {
    name: 'Neurology',
    icon: Brain,
    topics: []
  },
  {
    name: 'Pulmonology',
    icon: Wind,
    topics: []
  },
  {
    name: 'Endocrinology',
    icon: Activity,
    topics: []
  },
   {
    name: 'Gastroenterology',
    icon: Stethoscope,
    topics: []
  },
  {
    name: 'Rheumatology',
    icon: Bone,
    topics: []
  },
  {
    name: 'Surgery',
    icon: Scissors,
    topics: []
  },
  {
    name: 'Paediatrics',
    icon: Baby,
    topics: []
  }
];
