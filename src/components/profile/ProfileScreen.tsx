import { User, Moon, Sun, Monitor, LogOut, Shield, Heart } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ProfileScreenProps {
  userEmail: string;
  onLogout: () => void;
}

export function ProfileScreen({ userEmail, onLogout }: ProfileScreenProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const themeOptions = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-calm">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-secondary">
          <User className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground">Profile</h1>
          <p className="text-xs text-muted-foreground">Manage your preferences</p>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* User Info Card */}
        <Card variant="calm" className="animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Welcome</CardTitle>
                <CardDescription className="text-sm break-all">
                  {userEmail}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Theme Selection */}
        <Card variant="calm" className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Choose a theme that feels right for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-2xl transition-all duration-300',
                      'border-2 hover:scale-105 active:scale-95',
                      theme === option.value
                        ? 'bg-primary/10 border-primary shadow-soft'
                        : 'bg-card border-border/50 hover:border-primary/30 hover:bg-secondary/50'
                    )}
                  >
                    <Icon className={cn(
                      'w-6 h-6',
                      theme === option.value ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      theme === option.value ? 'text-primary' : 'text-muted-foreground'
                    )}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card variant="glass" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              About Serenity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Serenity is your personal mental wellness companion, designed to provide
              a safe space for reflection and emotional support.
            </p>
            <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/50">
              <Shield className="w-4 h-4 text-accent-foreground mt-0.5 shrink-0" />
              <p className="text-xs">
                <strong className="text-foreground">Important:</strong> This app is not a substitute
                for professional mental health care. If you're in crisis, please reach out
                to a mental health professional or crisis helpline.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Logout */}
        <Button
          variant="gentle"
          onClick={onLogout}
          className="w-full animate-fade-in"
          style={{ animationDelay: '0.3s' }}
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
