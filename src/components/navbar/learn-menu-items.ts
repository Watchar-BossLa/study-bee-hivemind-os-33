
import { BookOpen, GraduationCap, Users, Trophy, BarChart3, Brain } from 'lucide-react';

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
    label: 'AI Tutor',
    href: '/graph-tutor',
    description: 'Get personalized help from our AI tutor',
    icon: Brain,
  },
  {
    label: 'Live Sessions',
    href: '/live-sessions',
    description: 'Join collaborative learning sessions',
    icon: Users,
  },
  {
    label: 'Arena',
    href: '/arena',
    description: 'Compete in knowledge challenges',
    icon: Trophy,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    description: 'Track your learning progress',
    icon: BarChart3,
  },
  {
    label: 'Qualifications',
    href: '/qualifications',
    description: 'Explore certification pathways',
    icon: GraduationCap,
  },
];
