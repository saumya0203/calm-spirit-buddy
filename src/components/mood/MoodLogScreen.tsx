import { useState } from 'react';
import { Heart, Save, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoodSelector } from './MoodSelector';
import type { MoodEntry } from '@/types';
import { cn } from '@/lib/utils';

interface MoodLogScreenProps {
  onSaveMood: (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => void;
  recentMoods: MoodEntry[];
}

export function MoodLogScreen({ onSaveMood, recentMoods }: MoodLogScreenProps) {
  const [selectedMood, setSelectedMood] = useState<{ value: string; emoji: string; label: string } | null>(null);
  const [journal, setJournal] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSelectMood = (value: string, emoji: string, label: string) => {
    setSelectedMood({ value, emoji, label });
    setIsSaved(false);
  };

  const handleSave = () => {
    if (!selectedMood) return;
    
    onSaveMood({
      emoji: selectedMood.emoji,
      label: selectedMood.label,
      journal: journal.trim() || undefined,
    });
    
    setIsSaved(true);
    setTimeout(() => {
      setSelectedMood(null);
      setJournal('');
      setIsSaved(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-calm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-accent">
          <Heart className="w-5 h-5 text-accent-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground">Mood Check-in</h1>
          <p className="text-xs text-muted-foreground">How are you feeling right now?</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Mood Selection Card */}
        <Card variant="calm" className="animate-fade-in">
          <CardHeader>
            <CardTitle>Select your mood</CardTitle>
            <CardDescription>
              Choose the emoji that best represents how you're feeling
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodSelector
              selectedMood={selectedMood?.value || null}
              onSelect={handleSelectMood}
            />
          </CardContent>
        </Card>

        {/* Journal Entry */}
        {selectedMood && (
          <Card variant="calm" className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>{selectedMood.emoji}</span>
                <span>Feeling {selectedMood.label}</span>
              </CardTitle>
              <CardDescription>
                Would you like to write about it? (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={journal}
                onChange={(e) => setJournal(e.target.value)}
                placeholder="What's on your mind? This is your private space to reflect..."
                className={cn(
                  'w-full min-h-[120px] p-4 rounded-2xl resize-none',
                  'bg-secondary/50 border-2 border-border/50',
                  'text-foreground placeholder:text-muted-foreground',
                  'focus:border-primary/50 focus:outline-none',
                  'transition-colors duration-200'
                )}
              />
              
              <Button
                onClick={handleSave}
                disabled={isSaved}
                className="w-full"
                size="lg"
              >
                {isSaved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Check-in
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Moods */}
        {recentMoods.length > 0 && (
          <Card variant="glass" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Recent Check-ins</CardTitle>
              <CardDescription>Your mood journey over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentMoods.slice(0, 5).map((mood) => (
                  <div
                    key={mood.id}
                    className="flex items-start gap-3 p-3 rounded-xl bg-secondary/30"
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{mood.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {mood.timestamp.toLocaleDateString([], {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      {mood.journal && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {mood.journal}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
