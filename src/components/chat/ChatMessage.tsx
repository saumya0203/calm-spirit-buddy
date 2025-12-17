import { cn } from '@/lib/utils';
import type { Message, Sentiment } from '@/types';

interface ChatMessageProps {
  message: Message;
  index: number;
}

const sentimentConfig: Record<Sentiment, { label: string; className: string }> = {
  positive: { label: 'Positive', className: 'emotion-positive' },
  neutral: { label: 'Neutral', className: 'emotion-neutral' },
  negative: { label: 'Reflecting', className: 'emotion-negative' },
};

export function ChatMessage({ message, index }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const sentiment = message.sentiment ? sentimentConfig[message.sentiment] : null;

  return (
    <div
      className={cn(
        'flex w-full animate-fade-in',
        isUser ? 'justify-end' : 'justify-start'
      )}
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div
        className={cn(
          'max-w-[85%] md:max-w-[75%] rounded-3xl px-5 py-4 shadow-soft',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-lg'
            : 'bg-card text-card-foreground rounded-bl-lg border border-border/50'
        )}
      >
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {message.content}
        </p>
        
        {!isUser && sentiment && (
          <div className="mt-3 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                sentiment.className
              )}
            >
              {sentiment.label}
            </span>
          </div>
        )}
        
        <span className="block mt-2 text-xs opacity-50">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
}
