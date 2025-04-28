
import { BookOpen, Camera, Brain, Award, Users, User, FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface LearnMenuItem {
  title: string;
  url: string;
  icon: LucideIcon;
  description: string;
}

export const learnMenuItems: LearnMenuItem[] = [
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
    description: "Browse our extensive course catalog"
  },
  {
    title: "OCR Flashcards",
    url: "/ocr",
    icon: Camera,
    description: "Create flashcards from your notes instantly"
  },
  {
    title: "AI Tutor",
    url: "/tutor",
    icon: Brain,
    description: "Get personalized help with Graph-RAG tutoring"
  },
  {
    title: "Quiz Arena",
    url: "/arena",
    icon: Award,
    description: "Compete in real-time quiz battles"
  },
  {
    title: "Study Groups",
    url: "/study-groups",
    icon: Users,
    description: "Join study groups and learn together"
  },
  {
    title: "Peer Learning",
    url: "/peer-learning",
    icon: User,
    description: "Connect with study partners"
  },
  {
    title: "Collaborative Notes",
    url: "/collaborative-notes",
    icon: FileText,
    description: "Create and share study notes"
  }
];
