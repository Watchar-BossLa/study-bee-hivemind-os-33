
import React from 'react';
import { Link } from 'react-router-dom';
import NavLinks from './navbar/NavLinks';
import NavActions from './navbar/NavActions';
import LogoBee from './LogoBee';

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <LogoBee />
              <span className="text-xl font-bold text-primary">Study Bee</span>
            </Link>
            <NavLinks />
          </div>
          <NavActions />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
