
import { Book, BookOpen, FlaskConical, Dumbbell, PencilRuler, Brain, FlipVertical } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface LearnMenuItem {
  title: string;
  description: string;
  url: string;
  icon: LucideIcon;
}

export const learnMenuItems: LearnMenuItem[] = [
  {
    title: "Courses",
    description: "Browse our structured learning courses",
    url: "/courses",
    icon: BookOpen
  },
  {
    title: "Flashcards",
    description: "Create and review flashcards with spaced repetition",
    url: "/flashcards",
    icon: FlipVertical
  },
  {
    title: "AI Tutor",
    description: "Get personalized help from our AI tutor",
    url: "/tutor",
    icon: Brain
  },
  {
    title: "Live Sessions",
    description: "Join interactive live study sessions",
    url: "/live-sessions",
    icon: Book
  },
  {
    title: "Practice Arena",
    description: "Test your knowledge in competitive quizzes",
    url: "/arena",
    icon: Dumbbell
  },
  {
    title: "OCR Flashcards",
    description: "Create flashcards by scanning notes",
    url: "/ocr",
    icon: PencilRuler
  },
  {
    title: "Labs",
    description: "Experimental learning features",
    url: "/labs",
    icon: FlaskConical
  }
];
