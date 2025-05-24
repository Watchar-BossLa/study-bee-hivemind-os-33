
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { learnMenuItems } from './learn-menu-items';

const LearnMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 text-sm font-medium text-muted-foreground hover:text-primary">
          Learn
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg">
        {learnMenuItems.map((item) => (
          <DropdownMenuItem key={item.label} asChild>
            <Link
              to={item.href}
              className="flex items-center px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
            >
              <item.icon className="mr-2 h-4 w-4" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">{item.description}</div>
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LearnMenu;
