import { cn } from '@/lib/utils';
import { MOOD_OPTIONS } from '@/types';

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelect: (mood: string, emoji: string, label: string) => void;
}

export function MoodSelector({ selectedMood, onSelect }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {MOOD_OPTIONS.map((mood) => (
        <button
          key={mood.value}
          onClick={() => onSelect(mood.value, mood.emoji, mood.label)}
          className={cn(
            'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300',
            'border-2 hover:scale-105 active:scale-95',
            selectedMood === mood.value
              ? 'bg-primary/10 border-primary shadow-soft'
              : 'bg-card border-border/50 hover:border-primary/30 hover:bg-secondary/50'
          )}
        >
          <span className="text-4xl" role="img" aria-label={mood.label}>
            {mood.emoji}
          </span>
          <span className={cn(
            'text-sm font-medium',
            selectedMood === mood.value ? 'text-primary' : 'text-muted-foreground'
          )}>
            {mood.label}
          </span>
        </button>
      ))}
    </div>
  );
}
