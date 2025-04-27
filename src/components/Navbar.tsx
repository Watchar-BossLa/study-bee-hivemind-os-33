import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, Command, BookOpen, Camera, Brain, Award } from "lucide-react";
import LogoBee from './LogoBee';
import CommandPalette from './CommandPalette';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const Navbar = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" aria-label="Home">
            <LogoBee />
          </Link>
        </div>
        
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
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => setCommandOpen(true)}
            aria-label="Command palette"
          >
            <Command className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden md:flex">Sign In</Button>
          <Button className="hidden md:flex">Get Started</Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </header>
  );
};

export default Navbar;
