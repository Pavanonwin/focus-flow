import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Sparkles, Clock, PenLine } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12">
      {/* Logo & App Name */}
      <div className="flex items-center gap-3 mb-4 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <Brain className="w-9 h-9 text-primary-foreground" />
        </div>
      </div>
      
      <h1 className="text-4xl font-bold text-foreground mb-2 animate-fade-in">
        BrainGain
      </h1>
      
      <p className="text-lg text-muted-foreground text-center mb-10 animate-fade-in">
        Turn distraction into focused progress.
      </p>

      {/* Feature highlights */}
      <div className="space-y-4 mb-12 w-full max-w-sm">
        <FeatureItem 
          icon={<Sparkles className="w-5 h-5" />} 
          text="Set your focus intention"
        />
        <FeatureItem 
          icon={<Clock className="w-5 h-5" />} 
          text="Timed focus sessions"
        />
        <FeatureItem 
          icon={<PenLine className="w-5 h-5" />} 
          text="Journal your progress"
        />
      </div>

      {/* CTAs */}
      <div className="space-y-3 w-full max-w-sm">
        <Button 
          size="lg" 
          className="w-full text-lg h-14 rounded-xl"
          onClick={() => navigate('/onboarding')}
        >
          Start My First Focus
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          className="w-full text-lg h-14 rounded-xl"
          onClick={() => navigate('/onboarding?demo=true')}
        >
          Try a 5-minute demo
        </Button>
      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border animate-fade-in">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
        {icon}
      </div>
      <span className="text-foreground font-medium">{text}</span>
    </div>
  );
}
