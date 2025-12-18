import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Message, Sentiment } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello, I'm Serenity. I'm here to listen and support you through whatever you're experiencing. This is a safe space — feel free to share anything that's on your mind. How are you feeling today?",
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map(m => ({
        role: m.role,
        content: m.content
      }));

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          message: content,
          conversationHistory 
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        role: 'assistant',
        sentiment: data.sentiment as Sentiment,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Connection issue",
        description: "Having trouble connecting. Please try again.",
        variant: "destructive",
      });
      
      // Add a fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm having a moment of reflection. Could you share that with me again?",
        role: 'assistant',
        sentiment: 'neutral',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border/50">
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-lg font-semibold text-foreground">Serenity</h1>
          <p className="text-xs text-muted-foreground">Your mental wellness companion</p>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className={cn(
          'flex-1 overflow-y-auto p-4 space-y-4',
          'scrollbar-calm'
        )}
      >
        {messages.map((message, index) => (
          <ChatMessage key={message.id} message={message} index={index} />
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card rounded-3xl rounded-bl-lg px-5 py-4 shadow-soft border border-border/50">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-muted-foreground ml-2">Reflecting...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 pb-safe-bottom">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
