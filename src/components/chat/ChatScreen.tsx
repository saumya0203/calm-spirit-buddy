import { useState, useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { Message, Sentiment } from '@/types';
import { cn } from '@/lib/utils';

// Simple sentiment analysis (will be replaced with AI backend)
function analyzeSentiment(text: string): Sentiment {
  const positiveWords = ['happy', 'good', 'great', 'wonderful', 'excited', 'love', 'grateful', 'thankful', 'joy', 'amazing', 'better', 'hope', 'hopeful'];
  const negativeWords = ['sad', 'angry', 'upset', 'depressed', 'anxious', 'worried', 'stressed', 'tired', 'exhausted', 'lonely', 'scared', 'hurt', 'pain', 'bad', 'terrible', 'awful'];
  
  const lowerText = text.toLowerCase();
  const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
  
  if (positiveCount > negativeCount) return 'positive';
  if (negativeCount > positiveCount) return 'negative';
  return 'neutral';
}

// Empathetic response generator (will be replaced with AI backend)
function generateResponse(userMessage: string, sentiment: Sentiment): string {
  const responses: Record<Sentiment, string[]> = {
    positive: [
      "I'm so glad to hear that! It's wonderful when we can recognize and celebrate the good moments in our lives. What do you think contributed to this positive feeling?",
      "That's beautiful to hear. Positive emotions are worth savoring. Would you like to tell me more about what's bringing you joy?",
      "How lovely! It sounds like things are going well. Remember to take a moment to appreciate these feelings.",
    ],
    neutral: [
      "Thank you for sharing that with me. I'm here to listen whenever you need to talk. Is there anything specific on your mind today?",
      "I appreciate you opening up. Sometimes just expressing our thoughts can bring clarity. How are you feeling about things overall?",
      "I hear you. It's okay to just be present with whatever you're experiencing right now. Would you like to explore any particular thoughts?",
    ],
    negative: [
      "I'm really sorry you're going through this. Your feelings are valid, and it takes courage to express them. I'm here with you. Would you like to tell me more?",
      "That sounds really difficult, and I want you to know that it's okay to feel this way. You don't have to face these feelings alone. What would feel most supportive right now?",
      "I hear you, and I'm truly sorry you're experiencing this. Remember, seeking support is a sign of strength. Let's take this one moment at a time together.",
    ],
  };

  const options = responses[sentiment];
  return options[Math.floor(Math.random() * options.length)];
}

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

    // Simulate AI processing delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const sentiment = analyzeSentiment(content);
    const responseText = generateResponse(content, sentiment);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: responseText,
      role: 'assistant',
      sentiment,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
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
