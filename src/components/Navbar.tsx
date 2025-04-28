
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, Command, BookOpen, Camera, Brain, Award, Home, LogOut, User } from "lucide-react";
import LogoBee from './LogoBee';
import CommandPalette from './CommandPalette';
import { ThemeToggle } from './theme/ThemeToggle';
import { useAuth } from './auth/AuthContext';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
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

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" aria-label="Home">
            <LogoBee />
          </Link>
          
          <Link 
            to="/" 
            className={`hidden md:flex items-center gap-1 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
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
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
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
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.email}</p>
                  <p className="text-xs text-muted-foreground">
                    Student
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" className="hidden md:flex" onClick={() => navigate('/auth')}>Sign In</Button>
              <Button className="hidden md:flex" onClick={() => navigate('/auth')}>Get Started</Button>
            </>
          )}
          
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
