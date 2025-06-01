
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from '@/components/ui/command';
import { Book, Search, Brain, Camera, Users, Award, Home, GraduationCap } from 'lucide-react';

interface CommandPaletteProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Core Features">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/'))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
            <span className="ml-auto text-xs text-muted-foreground">Home page</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/courses'))}
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Browse Courses</span>
            <span className="ml-auto text-xs text-muted-foreground">Find your next learning path</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/graph-tutor'))}
          >
            <Brain className="mr-2 h-4 w-4" />
            <span>AI Tutor</span>
            <span className="ml-auto text-xs text-muted-foreground">Graph-RAG powered tutoring</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/ocr'))}
          >
            <Camera className="mr-2 h-4 w-4" />
            <span>OCR Flashcards</span>
            <span className="ml-auto text-xs text-muted-foreground">Convert notes to flashcards</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Quick Access">
          <CommandItem onSelect={() => runCommand(() => navigate('/qualifications'))}>
            <GraduationCap className="mr-2 h-4 w-4" />
            <span>Qualifications</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/arena'))}>
            <Users className="mr-2 h-4 w-4" />
            <span>Quiz Arena</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/flashcards'))}>
            <Award className="mr-2 h-4 w-4" />
            <span>Spaced Repetition</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => navigate('/'))}>
            <Search className="mr-2 h-4 w-4" />
            <span>Search All Content</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
