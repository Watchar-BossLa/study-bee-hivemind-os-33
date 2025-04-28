
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface MenuLinkProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  isActive: (path: string) => boolean;
}

export const MenuLink = ({ to, icon: Icon, title, description, isActive }: MenuLinkProps) => (
  <Link 
    to={to}
    className={`block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground ${
      isActive(to) ? 'bg-accent' : ''
    }`}
  >
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
      {description}
    </p>
  </Link>
);
