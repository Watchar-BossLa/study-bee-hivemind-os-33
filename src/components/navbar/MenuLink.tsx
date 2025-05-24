
import React from 'react';
import { Link } from 'react-router-dom';

interface MenuLinkProps {
  to: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const MenuLink = ({ to, active = false, children, onClick }: MenuLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-sm font-medium transition-colors hover:text-primary ${
        active
          ? 'text-primary border-b-2 border-primary'
          : 'text-muted-foreground'
      }`}
    >
      {children}
    </Link>
  );
};

export default MenuLink;
