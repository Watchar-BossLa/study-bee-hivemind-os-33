
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, Command, Home } from "lucide-react";
import LogoBee from './LogoBee';
import CommandPalette from './CommandPalette';
import { ThemeToggle } from './theme/ThemeToggle';
import { NavMenu } from './navigation/NavMenu';
import { UserMenu } from './navigation/UserMenu';

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
        
        <NavMenu />
        
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
          
          <UserMenu />
          
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
