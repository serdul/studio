import {
  Heart,
  AirVent,
  BrainCircuit,
  Droplets,
  Bone,
  Bug,
  Scissors,
  Baby,
  HeartHandshake,
  Filter,
  FlaskConical,
  Shield,
  HelpCircle,
  type LucideIcon,
} from 'lucide-react';

const subjectIconMap: Record<string, LucideIcon> = {
  Cardiology: Heart,
  Pulmonology: AirVent,
  Gastroenterology: Shield,
  Neurology: BrainCircuit,
  Endocrinology: FlaskConical,
  Nephrology: Filter,
  Hematology: Droplets,
  Rheumatology: Bone,
  'Infectious Disease': Bug,
  Surgery: Scissors,
  Pediatrics: Baby,
  'Obstetrics & Gynecology': HeartHandshake,
  Miscellaneous: HelpCircle,
};

export function getSubjectIcon(subject: string): LucideIcon {
  return subjectIconMap[subject] || HelpCircle;
}
