import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTrial } from '@/hooks/useTrial';
import UpgradePrompt from './UpgradePrompt';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const MKROCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { canUseFeature, promptsRemaining, incrementPromptUsage, isDevelopmentMode, isTrialExpired } = useTrial();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendCoachingMessage = async (userInput: string, history: ChatMessage[]) => {
    setIsLoading(true);
    try {
      let prompt = `Conversation history:`;
      const recentHistory = history.slice(-3);
      recentHistory.forEach(msg => {
        prompt += `\n${msg.type === 'user' ? 'User' : 'Coach'}: ${msg.content}`;
      });
      prompt += `\nUser: ${userInput}\nCoach:`;

      console.log('Sending prompt to Supabase:', prompt);

      const { data, error } = await supabase.functions.invoke('hf-proxy', {
        body: { prompt }
      });

      if (error) {
        console.error('Supabase function error:', error);
        toast({
          title: "Error",
          description: "Failed to get coaching response. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const coachResponse = data?.text?.trim();
      if (!coachResponse) {
        console.error('Empty response from Supabase:', data);
        throw new Error('Empty response from AI');
      }

      console.log('Received response:', coachResponse);

      const isRepetitive = messages.some(msg => msg.type === 'coach' && msg.content === coachResponse);
      if (isRepetitive) {
        console.warn('Repetitive response detected:', coachResponse);
        toast({
          title: "Warning",
          description: "Received a repetitive response. Please try rephrasing your question.",
          variant: "default"
        });
        return;
      }

      const coachMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        type: 'coach',
        content: coachResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    // Check if user can send more prompts
    const canSend = await incrementPromptUsage();
    if (!canSend) return;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setCurrentMessage('');

    await sendCoachingMessage(currentMessage, updatedMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show upgrade prompt if trial expired and not in development
  if (!canUseFeature('coach') && !isDevelopmentMode) {
    return (
      <UpgradePrompt 
        feature="MKRO Coach" 
        description="Your free trial has ended. Upgrade to Premium to continue getting personalized coaching advice."
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            MKRO - Your AI PT & Nutrition Coach
            {!isDevelopmentMode && promptsRemaining <= 5 && promptsRemaining > 0 && (
              <span className="text-sm text-muted-foreground">
                ({promptsRemaining} prompts left)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/20">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p>Hi! I'm MKRO, your AI PT & Nutrition Coach.</p>
                  <p>Start chatting to get your personalized fitness plan!</p>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                      {message.type === 'user' ? (
                        <User className="w-4 h-4 text-primary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-secondary-foreground" />
                      )}
                    </div>
                    <div className={`rounded-lg p-3 ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border'}`}>
                      <pre className="whitespace-pre-wrap text-sm font-sans">{message.content}</pre>
                      <div className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-secondary-foreground" />
                  </div>
                  <div className="bg-card border rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask MKRO about training, nutrition, or get your personalized plan..."
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isLoading}
                size="lg"
                className="px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MKROCoach;