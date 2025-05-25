
import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import MenuLink from './MenuLink';
import LearnMenu from './LearnMenu';

const NavLinks = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="hidden md:flex items-center space-x-6">
      <LearnMenu />
      
      <MenuLink to="/arena" active={isActive('/arena')}>
        Arena
      </MenuLink>
      
      <MenuLink to="/flashcards" active={isActive('/flashcards')}>
        Flashcards
      </MenuLink>
      
      <MenuLink to="/graph-tutor" active={isActive('/graph-tutor')}>
        AI Tutor
      </MenuLink>
      
      <MenuLink to="/adaptive-quiz" active={isActive('/adaptive-quiz')}>
        Adaptive Quiz
      </MenuLink>
      
      <MenuLink to="/quorum-dashboard" active={isActive('/quorum-dashboard')}>
        QuorumForge
      </MenuLink>
      
      <MenuLink to="/analytics" active={isActive('/analytics')}>
        Analytics
      </MenuLink>
    </div>
  );
};

export default NavLinks;
