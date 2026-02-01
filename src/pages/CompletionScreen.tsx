import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useApp } from '@/contexts/AppContext';
import { JournalReflection } from '@/lib/storage';
import { PartyPopper, Clock, ArrowRight } from 'lucide-react';

export default function CompletionScreen() {
  const navigate = useNavigate();
  const { currentSession, completeSession, resetForNewSession } = useApp();
  
  const [reflection, setReflection] = useState<JournalReflection>({
    did: '',
    distracted_by: '',
    takeaway: '',
  });

  if (!currentSession) {
    navigate('/');
    return null;
  }

  const handleSave = () => {
    completeSession(reflection);
    resetForNewSession();
    navigate('/home');
  };

  const handleStartAnother = () => {
    completeSession(reflection);
    resetForNewSession();
    navigate('/onboarding');
  };

  const minutesFocused = currentSession.duration_minutes;

  return (
    <div className="min-h-screen bg-background flex flex-col px-6 py-8">
      {/* Celebration Header */}
      <div className="flex flex-col items-center mb-8 animate-scale-in">
        <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
          <PartyPopper className="w-10 h-10 text-success" />
        </div>
        
        <h1 className="text-3xl font-bold text-foreground text-center">
          🎉 Focus Session Complete
        </h1>
        
        <div className="flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-primary/10">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-primary font-medium">
            {minutesFocused} minutes focused
          </span>
        </div>
      </div>

      {/* Reflection Form */}
      <div className="flex-1 space-y-6">
        <ReflectionField
          label="What did you actually do?"
          value={reflection.did}
          onChange={(did) => setReflection(prev => ({ ...prev, did }))}
          placeholder="Describe what you accomplished..."
        />
        
        <ReflectionField
          label="What distracted you most?"
          value={reflection.distracted_by}
          onChange={(distracted_by) => setReflection(prev => ({ ...prev, distracted_by }))}
          placeholder="Any interruptions or distractions?"
        />
        
        <ReflectionField
          label="One takeaway for next time"
          value={reflection.takeaway}
          onChange={(takeaway) => setReflection(prev => ({ ...prev, takeaway }))}
          placeholder="What will you do differently?"
        />
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-6">
        <Button
          size="lg"
          className="w-full text-lg h-14 rounded-xl"
          onClick={handleSave}
        >
          Save Reflection
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          className="w-full text-lg h-14 rounded-xl"
          onClick={handleStartAnother}
        >
          Start Another Session
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

function ReflectionField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="animate-fade-in">
      <label className="block text-sm font-medium text-foreground mb-2">
        {label}
      </label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[80px] rounded-xl resize-none"
      />
    </div>
  );
}
