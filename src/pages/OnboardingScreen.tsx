import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { BrainrotStats } from '@/components/BrainrotStats';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { ArrowLeft, ArrowRight, Shield, Lock } from 'lucide-react';

const TOTAL_STEPS = 6;

const TASK_SUGGESTIONS = ['Study', 'Write', 'Work task', 'Read', 'Plan'];
const WHY_TEMPLATES = [
  'I want to finish this so I can ___',
  'This helps me become ___',
  'I need this done to feel ___',
];
const TIME_PRESETS = [25, 45, 90];
const DISTRACTION_APPS = ['Instagram', 'TikTok', 'YouTube', 'Twitter / X', 'Browser'];

export default function OnboardingScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isDemo = searchParams.get('demo') === 'true';
  
  const { onboardingData, updateOnboardingData, completeOnboarding, startSession } = useApp();
  const [step, setStep] = useState(0);
  
  // Local state for form fields
  const [focusTask, setFocusTask] = useState(onboardingData.focus_task || '');
  const [focusWhy, setFocusWhy] = useState(onboardingData.focus_why || '');
  const [duration, setDuration] = useState(isDemo ? 5 : onboardingData.focus_duration_minutes || 25);
  const [customDuration, setCustomDuration] = useState('');
  const [distractionApps, setDistractionApps] = useState<string[]>(onboardingData.distraction_apps || []);
  const [otherDistraction, setOtherDistraction] = useState('');
  const [focusMode, setFocusMode] = useState<'light' | 'reminder'>(onboardingData.focus_mode || 'light');
  const [allowNotifications, setAllowNotifications] = useState(onboardingData.allow_notifications ?? true);

  const canProceed = () => {
    switch (step) {
      case 0: return focusTask.trim().length > 0;
      case 1: return focusWhy.trim().length > 0;
      case 2: return duration >= 5 && duration <= 180;
      case 3: return true; // Optional selection
      case 4: return true; // Mode selection always valid
      case 5: return true; // Final step
      default: return false;
    }
  };

  const handleNext = () => {
    // Save current step data
    switch (step) {
      case 0:
        updateOnboardingData({ focus_task: focusTask.trim() });
        break;
      case 1:
        updateOnboardingData({ focus_why: focusWhy.trim() });
        break;
      case 2:
        updateOnboardingData({ focus_duration_minutes: duration });
        break;
      case 3:
        const apps = [...distractionApps];
        if (otherDistraction.trim()) {
          apps.push(otherDistraction.trim());
        }
        updateOnboardingData({ distraction_apps: apps });
        break;
      case 4:
        updateOnboardingData({ focus_mode: focusMode });
        break;
      case 5:
        updateOnboardingData({ allow_notifications: allowNotifications });
        completeOnboarding();
        startSession();
        navigate('/focus');
        return;
    }
    
    setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step === 0) {
      navigate('/');
    } else {
      setStep(s => s - 1);
    }
  };

  const toggleDistraction = (app: string) => {
    setDistractionApps(prev => 
      prev.includes(app) 
        ? prev.filter(a => a !== app)
        : [...prev, app]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={handleBack}
          className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <ProgressIndicator currentStep={step} totalSteps={TOTAL_STEPS} />
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {step === 0 && (
          <StepContainer>
            <StepTitle>What do you want to focus on right now?</StepTitle>
            <Input
              value={focusTask}
              onChange={(e) => setFocusTask(e.target.value.slice(0, 60))}
              placeholder="Enter your focus task..."
              className="text-lg h-14 rounded-xl"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-right">{focusTask.length}/60</p>
            
            <div className="flex flex-wrap gap-2 mt-4">
              {TASK_SUGGESTIONS.map(suggestion => (
                <ChipButton
                  key={suggestion}
                  selected={focusTask === suggestion}
                  onClick={() => setFocusTask(suggestion)}
                >
                  {suggestion}
                </ChipButton>
              ))}
            </div>
          </StepContainer>
        )}

        {step === 1 && (
          <StepContainer>
            <StepTitle>Why does this matter to you?</StepTitle>
            <Textarea
              value={focusWhy}
              onChange={(e) => setFocusWhy(e.target.value.slice(0, 140))}
              placeholder="What motivates you to complete this?"
              className="text-lg min-h-[120px] rounded-xl resize-none"
              autoFocus
            />
            <p className="text-sm text-muted-foreground text-right">{focusWhy.length}/140</p>
            
            <div className="space-y-2 mt-4">
              {WHY_TEMPLATES.map(template => (
                <button
                  key={template}
                  onClick={() => setFocusWhy(template)}
                  className="w-full text-left p-3 rounded-xl bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors text-sm"
                >
                  "{template}"
                </button>
              ))}
            </div>
          </StepContainer>
        )}

        {step === 2 && (
          <StepContainer>
            <StepTitle>How long will you focus?</StepTitle>
            
            <div className="flex gap-3 mb-6">
              {TIME_PRESETS.map(preset => (
                <ChipButton
                  key={preset}
                  selected={duration === preset}
                  onClick={() => {
                    setDuration(preset);
                    setCustomDuration('');
                  }}
                  className="flex-1 py-4"
                >
                  {preset} min
                </ChipButton>
              ))}
            </div>
            
            <div className="relative">
              <Input
                type="number"
                value={customDuration}
                onChange={(e) => {
                  const val = e.target.value;
                  setCustomDuration(val);
                  const num = parseInt(val);
                  if (num >= 5 && num <= 180) {
                    setDuration(num);
                  }
                }}
                placeholder="Custom (5-180 min)"
                className="text-lg h-14 rounded-xl"
                min={5}
                max={180}
              />
            </div>
            
            {isDemo && (
              <p className="text-sm text-primary mt-4">
                ✨ Demo mode: Timer set to 5 minutes
              </p>
            )}
          </StepContainer>
        )}

        {step === 3 && (
          <StepContainer>
            <StepTitle>Which apps usually distract you?</StepTitle>
            <p className="text-muted-foreground mb-4">
              Select all that apply (optional)
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {DISTRACTION_APPS.map(app => (
                <ChipButton
                  key={app}
                  selected={distractionApps.includes(app)}
                  onClick={() => toggleDistraction(app)}
                >
                  {app}
                </ChipButton>
              ))}
            </div>
            
            <Input
              value={otherDistraction}
              onChange={(e) => setOtherDistraction(e.target.value)}
              placeholder="Other..."
              className="text-lg h-14 rounded-xl mb-6"
            />

            {/* Personalized brainrot stats with motivational quote */}
            <BrainrotStats selectedApps={distractionApps} showQuote={true} />
          </StepContainer>
        )}

        {step === 4 && (
          <StepContainer>
            <StepTitle>How strict should this focus be?</StepTitle>
            
            <div className="space-y-4">
              <FocusModeOption
                title="Light Focus"
                description="Silences notifications and keeps you in a focused window"
                selected={focusMode === 'light'}
                onClick={() => setFocusMode('light')}
                isDefault
              />
              <FocusModeOption
                title="Reminder-only"
                description="Just a timer and journaling"
                selected={focusMode === 'reminder'}
                onClick={() => setFocusMode('reminder')}
              />
            </div>
          </StepContainer>
        )}

        {step === 5 && (
          <StepContainer>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-success" />
              </div>
              <StepTitle className="mb-0">Safety & Privacy</StepTitle>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-lg">🚨</span>
                </div>
                <p className="text-foreground">
                  You can exit anytime using the <strong>emergency button</strong>
                </p>
              </div>
              
              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <p className="text-foreground">
                  Your journal is stored <strong>only on your device</strong>
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-card border border-border">
              <span className="text-foreground">Allow focus notifications</span>
              <Switch 
                checked={allowNotifications}
                onCheckedChange={setAllowNotifications}
              />
            </div>
          </StepContainer>
        )}
      </div>

      {/* Footer */}
      <div className="pt-6">
        <Button
          size="lg"
          className="w-full text-lg h-14 rounded-xl"
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {step === 5 ? (
            <>Start Focus Session</>
          ) : (
            <>Continue <ArrowRight className="ml-2 w-5 h-5" /></>
          )}
        </Button>
      </div>
    </div>
  );
}

function StepContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 animate-fade-in">
      {children}
    </div>
  );
}

function StepTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl font-bold text-foreground mb-6", className)}>
      {children}
    </h2>
  );
}

function ChipButton({ 
  children, 
  selected, 
  onClick,
  className 
}: { 
  children: React.ReactNode; 
  selected: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-xl font-medium transition-all",
        selected 
          ? "bg-primary text-primary-foreground" 
          : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        className
      )}
    >
      {children}
    </button>
  );
}

function FocusModeOption({
  title,
  description,
  selected,
  onClick,
  isDefault,
}: {
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  isDefault?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-5 rounded-xl border-2 transition-all",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border bg-card hover:border-muted-foreground/30"
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-foreground">{title}</span>
        {isDefault && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
            Default
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}
