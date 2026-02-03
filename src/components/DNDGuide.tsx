import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BellOff, Smartphone, CheckCircle2, Moon, Volume2 } from 'lucide-react';

interface DNDGuideProps {
  onComplete: () => void;
  onSkip?: () => void;
}

const DNDGuide = ({ onComplete, onSkip }: DNDGuideProps) => {
  const [confirmed, setConfirmed] = useState(false);

  const iosSteps = [
    { icon: Smartphone, text: "Swipe down from top-right corner" },
    { icon: Moon, text: "Tap the Focus or Do Not Disturb icon" },
    { icon: BellOff, text: "Select 'Do Not Disturb'" },
  ];

  const androidSteps = [
    { icon: Smartphone, text: "Swipe down from the top twice" },
    { icon: Volume2, text: "Tap 'Do Not Disturb' in quick settings" },
    { icon: BellOff, text: "Or long-press volume to enable DND" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BellOff className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Silence Distractions
        </h1>
        <p className="text-muted-foreground">
          Enable Do Not Disturb for a distraction-free focus session
        </p>
      </div>

      <div className="flex-1 space-y-4">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">🍎</span> iPhone
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {iosSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-muted-foreground">{step.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="text-lg">🤖</span> Android
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {androidSteps.map((step, index) => (
              <div key={index} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <span className="text-muted-foreground">{step.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div 
          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
            confirmed 
              ? 'bg-primary/10 border-primary' 
              : 'bg-muted/50 border-muted hover:border-primary/50'
          }`}
          onClick={() => setConfirmed(!confirmed)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              confirmed ? 'bg-primary border-primary' : 'border-muted-foreground'
            }`}>
              {confirmed && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
            </div>
            <span className="font-medium text-foreground">
              I've enabled Do Not Disturb
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-6">
        <Button 
          onClick={onComplete}
          disabled={!confirmed}
          className="w-full h-14 text-lg font-semibold"
        >
          Start Focus Session
        </Button>
        {onSkip && (
          <Button 
            variant="ghost" 
            onClick={onSkip}
            className="w-full text-muted-foreground"
          >
            Skip for now
          </Button>
        )}
      </div>
    </div>
  );
};

export default DNDGuide;
