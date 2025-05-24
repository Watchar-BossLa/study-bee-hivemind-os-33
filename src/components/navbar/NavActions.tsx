
import { Button } from "@/components/ui/button";
import { Search, Command, Settings } from "lucide-react";
import { ThemeToggle } from '../theme/ThemeToggle';
import { Link } from "react-router-dom";

interface NavActionsProps {
  setCommandOpen?: (open: boolean) => void;
}

const NavActions = ({ setCommandOpen = () => {} }: NavActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Link to="/settings/theme" aria-label="Theme settings">
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Settings className="h-5 w-5" />
        </Button>
      </Link>
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
      <Button variant="outline" className="hidden md:flex">Sign In</Button>
      <Button className="hidden md:flex">Get Started</Button>
    </div>
  );
};

export default NavActions;
