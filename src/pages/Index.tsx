import { useState, useCallback, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ChatScreen } from '@/components/chat/ChatScreen';
import { MoodLogScreen } from '@/components/mood/MoodLogScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { BottomNav, TabType } from '@/components/navigation/BottomNav';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { MoodEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [loadingMoods, setLoadingMoods] = useState(true);
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();

  // Redirect to auth if not logged in
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Fetch mood history from database
  useEffect(() => {
    if (!user) return;

    const fetchMoods = async () => {
      const { data, error } = await supabase
        .from('mood_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching moods:', error);
      } else if (data) {
        setMoodHistory(
          data.map((m) => ({
            id: m.id,
            emoji: m.emoji,
            label: m.label,
            journal: m.journal || undefined,
            timestamp: new Date(m.created_at),
          }))
        );
      }
      setLoadingMoods(false);
    };

    fetchMoods();
  }, [user]);

  const handleSaveMood = useCallback(async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('mood_logs')
      .insert({
        user_id: user.id,
        emoji: entry.emoji,
        label: entry.label,
        journal: entry.journal || null,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Unable to save',
        description: 'There was an issue saving your mood. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    if (data) {
      const newEntry: MoodEntry = {
        id: data.id,
        emoji: data.emoji,
        label: data.label,
        journal: data.journal || undefined,
        timestamp: new Date(data.created_at),
      };
      
      setMoodHistory((prev) => [newEntry, ...prev]);
      
      toast({
        title: 'Mood saved',
        description: `Feeling ${entry.label.toLowerCase()} - thank you for checking in.`,
      });
    }
  }, [user, toast]);

  const handleLogout = useCallback(async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'Take care of yourself. See you soon.',
    });
  }, [signOut, toast]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatScreen />}
        {activeTab === 'mood' && (
          <MoodLogScreen
            onSaveMood={handleSaveMood}
            recentMoods={moodHistory}
            isLoading={loadingMoods}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            userEmail={user?.email || ''}
            displayName={user?.user_metadata?.display_name}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
