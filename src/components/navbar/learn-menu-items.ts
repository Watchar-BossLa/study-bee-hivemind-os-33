
import { BookOpen, GraduationCap, Users, Camera, FileText, PaintBucket, UsersRound } from 'lucide-react';

export interface LearnMenuItem {
  label: string;
  href: string;
  description: string;
  icon: typeof BookOpen;
}

export const learnMenuItems: LearnMenuItem[] = [
  {
    label: 'Courses',
    href: '/courses',
    description: 'Browse our comprehensive course catalog',
    icon: BookOpen,
  },
  {
    label: 'Live Sessions',
    href: '/live-sessions',
    description: 'Join collaborative learning sessions',
    icon: Users,
  },
  {
    label: 'OCR Flashcards',
    href: '/ocr/flashcards',
    description: 'Create flashcards from photos with AI',
    icon: Camera,
  },
  {
    label: 'Study Groups',
    href: '/study-groups',
    description: 'Join or create collaborative study groups',
    icon: UsersRound,
  },
  {
    label: 'Peer Learning',
    href: '/peer-learning',
    description: 'Connect with study partners and peers',
    icon: Users,
  },
  {
    label: 'Collaborative Notes',
    href: '/collaborative-notes',
    description: 'Create and share notes with your study groups',
    icon: FileText,
  },
  {
    label: 'Theme Settings',
    href: '/theme-settings',
    description: 'Customize your learning environment',
    icon: PaintBucket,
  },
  {
    label: 'Qualifications',
    href: '/qualifications',
    description: 'Explore certification pathways',
    icon: GraduationCap,
  },
];
