
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
import { Book, Search, Calendar, Brain, Camera, Users, Award } from 'lucide-react';

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
        
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/'))}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Home</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/courses'))}
          >
            <Book className="mr-2 h-4 w-4" />
            <span>Courses</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/flashcards'))}
          >
            <Calendar className="mr-2 h-4 w-4" />
            <span>Flashcards</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="AI Features">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/tutor'))}
          >
            <Brain className="mr-2 h-4 w-4" />
            <span>AI Tutor</span>
            <span className="ml-auto text-xs text-muted-foreground">Graph-RAG</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/ocr'))}
          >
            <Camera className="mr-2 h-4 w-4" />
            <span>OCR Flashcards</span>
            <span className="ml-auto text-xs text-muted-foreground">Capture notes</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => navigate('/arena'))}
          >
            <Users className="mr-2 h-4 w-4" />
            <span>Quiz Arena</span>
            <span className="ml-auto text-xs text-muted-foreground">Live competition</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        
        <CommandGroup heading="Learning">
          <CommandItem
            onSelect={() => runCommand(() => navigate('/spaced-repetition'))}
          >
            <Award className="mr-2 h-4 w-4" />
            <span>Spaced Repetition</span>
            <span className="ml-auto text-xs text-muted-foreground">SM-2+</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default CommandPalette;
