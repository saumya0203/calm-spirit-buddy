import { useState, useCallback } from 'react';
import { ChatScreen } from '@/components/chat/ChatScreen';
import { MoodLogScreen } from '@/components/mood/MoodLogScreen';
import { ProfileScreen } from '@/components/profile/ProfileScreen';
import { BottomNav, TabType } from '@/components/navigation/BottomNav';
import type { MoodEntry } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const { toast } = useToast();

  // Demo user - will be replaced with auth
  const userEmail = 'user@example.com';

  const handleSaveMood = useCallback((entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setMoodHistory((prev) => [newEntry, ...prev]);
    
    toast({
      title: 'Mood saved',
      description: `Feeling ${entry.label.toLowerCase()} - thank you for checking in.`,
    });
  }, [toast]);

  const handleLogout = useCallback(() => {
    toast({
      title: 'Signed out',
      description: 'Take care of yourself. See you soon.',
    });
  }, [toast]);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {activeTab === 'chat' && <ChatScreen />}
        {activeTab === 'mood' && (
          <MoodLogScreen
            onSaveMood={handleSaveMood}
            recentMoods={moodHistory}
          />
        )}
        {activeTab === 'profile' && (
          <ProfileScreen
            userEmail={userEmail}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
