
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import LogoBee from './LogoBee';
import CommandPalette from './CommandPalette';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem } from "@/components/ui/navigation-menu";
import { NavLinks } from './navbar/NavLinks';
import { LearnMenu } from './navbar/LearnMenu';
import { NavActions } from './navbar/NavActions';

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
          <NavLinks isActive={isActive} />
        </div>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <LearnMenu isActive={isActive} />
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
        
        <NavActions setCommandOpen={setCommandOpen} />
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          aria-label="Menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <CommandPalette open={commandOpen} setOpen={setCommandOpen} />
    </header>
  );
};

export default Navbar;
