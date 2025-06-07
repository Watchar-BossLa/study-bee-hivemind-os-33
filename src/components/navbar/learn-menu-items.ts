
import { Brain, BookOpen, Users, Video, Target, BarChart3, Activity } from 'lucide-react';

export const learnMenuItems = [
  {
    label: 'AI Tutor',
    href: '/tutor',
    description: 'Get personalized help from our AI tutor',
    icon: Brain,
  },
  {
    label: 'Courses',
    href: '/courses',
    description: 'Browse available courses',
    icon: BookOpen,
  },
  {
    label: 'Live Sessions',
    href: '/live-sessions',
    description: 'Join collaborative study sessions',
    icon: Video,
  },
  {
    label: 'Study Groups',
    href: '/study-groups',
    description: 'Connect with other learners',
    icon: Users,
  },
  {
    label: 'Arena',
    href: '/arena',
    description: 'Compete in quiz battles',
    icon: Target,
  },
  {
    label: 'Analytics',
    href: '/analytics',
    description: 'Track your learning progress',
    icon: BarChart3,
  },
  {
    label: 'QuorumForge Analytics',
    href: '/quorum-analytics',
    description: 'AI system performance insights',
    icon: Activity,
  },
];
