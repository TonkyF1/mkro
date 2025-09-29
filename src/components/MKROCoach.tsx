import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
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
    if (!currentMessage.trim()) return;

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            MKRO - Your AI PT & Nutrition Coach
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
                    <div className={`w-