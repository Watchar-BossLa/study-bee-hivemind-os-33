
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, Command } from "lucide-react";
import LogoBee from './LogoBee';
import CommandPalette from './CommandPalette';

const Navbar = () => {
  const [commandOpen, setCommandOpen] = useState(false);
  
  // Keyboard shortcut for command palette
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/">
            <LogoBee />
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/courses" className="text-sm font-medium transition-colors hover:text-primary">
            Courses
          </Link>
          <Link to="#" className="text-sm font-medium transition-colors hover:text-primary">
            Flashcards
          </Link>
          <Link to="#" className="text-sm font-medium transition-colors hover:text-primary">
            Quizzes
          </Link>
          <Link to="#" className="text-sm font-medium transition-colors hover:text-primary">
            Tutoring
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden md:flex"
            onClick={() => setCommandOpen(true)}
          >
            <Command className="h-5 w-5" />
            <span className="sr-only">Command palette</span>
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button variant="outline" className="hidden md:flex">Sign In</Button>
          <Button className="hidden md:flex">Get Started</Button>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>
      
      {/* Command Palette */}
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </header>
  );
};

export default Navbar;
