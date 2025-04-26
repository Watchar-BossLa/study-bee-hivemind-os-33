
import { Progress } from "@/components/ui/progress";

interface ProcessingIndicatorProps {
  progress: number;
}

export const ProcessingIndicator = ({ progress }: ProcessingIndicatorProps) => {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>Processing...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-1" />
    </div>
  );
};
