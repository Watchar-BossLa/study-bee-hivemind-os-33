
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import LogoBee from './LogoBee';
import { NavLinks } from './navbar/NavLinks';
import { NavActions } from './navbar/NavActions';
import { MenuLink } from './navbar/MenuLink';
import { LayoutDashboard } from 'lucide-react';

const NavbarWithDashboard = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="mr-8 flex items-center space-x-2">
          <LogoBee className="h-8 w-8" />
          <span className="hidden font-bold sm:inline-block">
            Study Bee
          </span>
        </Link>
        <div className="mr-4">
          <NavLinks isActive={isActive} />
        </div>
        <div className="hidden md:flex flex-1 items-center space-x-2">
          <MenuLink 
            to="/dashboard" 
            icon={LayoutDashboard}
            title="Dashboard"
            description="Your learning overview"
            isActive={isActive}
          />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <NavActions setCommandOpen={() => {}} />
        </div>
      </div>
    </header>
  );
};

export default NavbarWithDashboard;
