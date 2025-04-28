
import { Link } from 'react-router-dom';
import { BookOpen, Camera, Brain, Award, Users, User, FileText } from "lucide-react";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

interface LearnMenuProps {
  isActive: (path: string) => boolean;
}

export const LearnMenu = ({ isActive }: LearnMenuProps) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 w-[400px]">
          <MenuLink 
            to="/courses"
            icon={<BookOpen className="h-4 w-4" />}
            title="Courses"
            description="Browse our extensive course catalog"
            isActive={isActive}
          />
          <MenuLink 
            to="/ocr"
            icon={<Camera className="h-4 w-4" />}
            title="OCR Flashcards"
            description="Create flashcards from your notes instantly"
            isActive={isActive}
          />
          <MenuLink 
            to="/tutor"
            icon={<Brain className="h-4 w-4" />}
            title="AI Tutor"
            description="Get personalized help with Graph-RAG tutoring"
            isActive={isActive}
          />
          <MenuLink 
            to="/arena"
            icon={<Award className="h-4 w-4" />}
            title="Quiz Arena"
            description="Compete in real-time quiz battles"
            isActive={isActive}
          />
          <MenuLink 
            to="/study-groups"
            icon={<Users className="h-4 w-4" />}
            title="Study Groups"
            description="Join study groups and learn together"
            isActive={isActive}
          />
          <MenuLink 
            to="/peer-learning"
            icon={<User className="h-4 w-4" />}
            title="Peer Learning"
            description="Connect with study partners"
            isActive={isActive}
          />
          <MenuLink 
            to="/collaborative-notes"
            icon={<FileText className="h-4 w-4" />}
            title="Collaborative Notes"
            description="Create and share study notes"
            isActive={isActive}
          />
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};

interface MenuLinkProps {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive: (path: string) => boolean;
}

const MenuLink = ({ to, icon, title, description, isActive }: MenuLinkProps) => (
  <Link 
    to={to}
    className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
      isActive(to) ? 'bg-accent' : ''
    }`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
      {description}
    </p>
  </Link>
);
