
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Camera, Brain, Award } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

export function NavMenu() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="grid gap-3 p-4 w-[400px]">
              <Link 
                to="/courses"
                className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive('/courses') ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">Courses</span>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Browse our extensive course catalog
                </p>
              </Link>
              <Link 
                to="/ocr"
                className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive('/ocr') ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  <span className="text-sm font-medium">OCR Flashcards</span>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Create flashcards from your notes instantly
                </p>
              </Link>
              <Link 
                to="/tutor"
                className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive('/tutor') ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="text-sm font-medium">AI Tutor</span>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Get personalized help with Graph-RAG tutoring
                </p>
              </Link>
              <Link 
                to="/arena"
                className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
                  isActive('/arena') ? 'bg-accent' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span className="text-sm font-medium">Quiz Arena</span>
                </div>
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  Compete in real-time quiz battles
                </p>
              </Link>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link 
            to="/qualifications" 
            className={`flex items-center gap-1 px-4 py-2 text-sm font-medium ${isActive('/qualifications') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Qualifications
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
