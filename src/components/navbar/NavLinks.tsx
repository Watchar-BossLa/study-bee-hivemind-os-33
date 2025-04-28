
import { Link } from 'react-router-dom';
import { Home } from "lucide-react";

interface NavLinksProps {
  isActive: (path: string) => boolean;
}

export const NavLinks = ({ isActive }: NavLinksProps) => {
  return (
    <Link 
      to="/" 
      className={`hidden md:flex items-center gap-1 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
    >
      <Home className="h-4 w-4" />
      <span>Dashboard</span>
    </Link>
  );
};
