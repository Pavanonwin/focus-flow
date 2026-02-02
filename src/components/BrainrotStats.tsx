import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  getStatsForApps, 
  calculateTotalWeeklyHours, 
  getImpactLevel, 
  getImpactMessage,
  getRandomQuote 
} from '@/lib/brainrotStats';
import { Brain, Clock, AlertTriangle, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrainrotStatsProps {
  selectedApps: string[];
  showQuote?: boolean;
}

export function BrainrotStats({ selectedApps, showQuote = false }: BrainrotStatsProps) {
  const stats = useMemo(() => getStatsForApps(selectedApps), [selectedApps]);
  const totalHours = useMemo(() => calculateTotalWeeklyHours(selectedApps), [selectedApps]);
  const impactLevel = useMemo(() => getImpactLevel(totalHours), [totalHours]);
  const impactMessage = useMemo(() => getImpactMessage(impactLevel), [impactLevel]);
  const quote = useMemo(() => getRandomQuote(), []);

  const impactColors = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-destructive',
    critical: 'text-destructive'
  };

  const impactBgColors = {
    low: 'bg-success/10',
    medium: 'bg-warning/10',
    high: 'bg-destructive/10',
    critical: 'bg-destructive/20'
  };

  if (selectedApps.length === 0) {
    return (
      <div className="animate-fade-in">
        {showQuote && (
          <Card className="mb-4 border-primary/20 bg-primary/5">
            <CardContent className="p-4">
              <p className="text-sm text-foreground italic text-center">
                "{quote}"
              </p>
            </CardContent>
          </Card>
        )}
        <p className="text-muted-foreground text-sm text-center">
          Select apps to see personalized insights
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Motivational Quote */}
      {showQuote && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <p className="text-sm text-foreground italic text-center">
              "{quote}"
            </p>
          </CardContent>
        </Card>
      )}

      {/* Impact Summary */}
      <Card className={cn("border-2", impactBgColors[impactLevel])}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", impactBgColors[impactLevel])}>
              <Brain className={cn("w-5 h-5", impactColors[impactLevel])} />
            </div>
            <div>
              <p className={cn("text-2xl font-bold", impactColors[impactLevel])}>
                {totalHours.toFixed(1)} hrs/week
              </p>
              <p className="text-xs text-muted-foreground">
                potential time lost to these apps
              </p>
            </div>
          </div>
          <p className="text-sm text-foreground">
            {impactMessage}
          </p>
        </CardContent>
      </Card>

      {/* Individual App Stats */}
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <Card key={stat.app} className="overflow-hidden animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">{stat.app}</span>
                <span className="text-xs text-muted-foreground">{stat.globalUsers} users</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>Avg: {stat.dailyUsage}/day</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <TrendingDown className="w-3 h-3" />
                  <span>{stat.attentionSpanEffect}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-1.5 mt-2 text-xs text-destructive/80">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{stat.mentalHealthImpact}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
