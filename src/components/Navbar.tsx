
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu } from "lucide-react";
import LogoBee from './LogoBee';

const Navbar = () => {
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
    </header>
  );
};

export default Navbar;
