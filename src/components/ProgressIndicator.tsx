import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({ currentStep, totalSteps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full transition-all duration-300",
            i < currentStep 
              ? "bg-primary w-8" 
              : i === currentStep 
                ? "bg-primary w-8"
                : "bg-muted w-2"
          )}
        />
      ))}
    </div>
  );
}
