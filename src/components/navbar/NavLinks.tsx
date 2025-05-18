
import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinksProps {
  isActive: (path: string) => boolean;
}

export const NavLinks: React.FC<NavLinksProps> = ({ isActive }) => {
  return (
    <nav className="hidden md:flex items-center gap-6">
      <Link 
        to="/dashboard" 
        className={`text-sm font-medium ${isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Dashboard
      </Link>
      <Link 
        to="/courses" 
        className={`text-sm font-medium ${isActive('/courses') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Courses
      </Link>
      <Link 
        to="/tutor" 
        className={`text-sm font-medium ${isActive('/tutor') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        AI Tutor
      </Link>
      <Link 
        to="/arena" 
        className={`text-sm font-medium ${isActive('/arena') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
      >
        Arena
      </Link>
    </nav>
  );
};
