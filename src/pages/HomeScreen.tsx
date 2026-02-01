import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getCompletedSessionsThisWeek, getLastSession } from '@/lib/storage';
import { Brain, Clock, Target, Calendar } from 'lucide-react';

export default function HomeScreen() {
  const navigate = useNavigate();
  const sessionsThisWeek = getCompletedSessionsThisWeek();
  const lastSession = getLastSession();

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
          <Brain className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">BrainGain</h1>
          <p className="text-sm text-muted-foreground">Ready to focus?</p>
        </div>
      </div>

      {/* Stats Card */}
      <Card className="mb-6 animate-fade-in">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground">{sessionsThisWeek}</p>
              <p className="text-sm text-muted-foreground">
                focus {sessionsThisWeek === 1 ? 'session' : 'sessions'} this week
              </p>
            </div>
          </div>
          
          {sessionsThisWeek === 0 && (
            <p className="text-muted-foreground text-sm">
              Start your first focus session to begin tracking!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Last Session Summary */}
      {lastSession && lastSession.completed && (
        <Card className="mb-6 animate-fade-in">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Last Session
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">{lastSession.focus_task}</p>
                  <p className="text-sm text-muted-foreground">{lastSession.focus_why}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  {lastSession.duration_minutes} minutes focused
                </p>
              </div>
              
              {lastSession.journal_reflection?.takeaway && (
                <div className="p-3 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">
                    <strong>Takeaway:</strong> {lastSession.journal_reflection.takeaway}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Start Button */}
      <Button
        size="lg"
        className="w-full text-lg h-16 rounded-xl animate-pulse-glow"
        onClick={() => navigate('/onboarding')}
      >
        <Target className="w-6 h-6 mr-2" />
        Start Focus
      </Button>
    </div>
  );
}
