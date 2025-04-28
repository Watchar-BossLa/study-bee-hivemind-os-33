
import { Link } from 'react-router-dom';
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { MenuLink } from './MenuLink';
import { learnMenuItems } from './learn-menu-items';

interface LearnMenuProps {
  isActive: (path: string) => boolean;
}

export const LearnMenu = ({ isActive }: LearnMenuProps) => {
  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="grid gap-3 p-4 w-[400px]">
          {learnMenuItems.map((item) => (
            <MenuLink
              key={item.title}
              to={item.url}
              icon={item.icon}
              title={item.title}
              description={item.description}
              isActive={isActive}
            />
          ))}
        </div>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
};
