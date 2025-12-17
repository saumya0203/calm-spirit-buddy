import { MessageCircle, Heart, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'chat' | 'mood' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const navItems = [
  { id: 'chat' as const, icon: MessageCircle, label: 'Chat' },
  { id: 'mood' as const, icon: Heart, label: 'Mood' },
  { id: 'profile' as const, icon: User, label: 'Profile' },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="flex items-center justify-around px-4 py-2 bg-card/80 backdrop-blur-md border-t border-border/50 pb-safe-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all duration-300',
              'min-w-[72px] min-h-[56px]',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            )}
            aria-label={item.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className={cn(
              'w-6 h-6 transition-transform duration-300',
              isActive && 'scale-110'
            )} />
            <span className={cn(
              'text-xs font-medium',
              isActive && 'font-semibold'
            )}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
