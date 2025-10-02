import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useTrial } from '@/hooks/useTrial';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import UpgradePrompt from './UpgradePrompt';
import { Send, Bot, User, Calendar, Dumbbell, Loader2, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { detectPlanType, parseMealPlan, parseWorkoutPlan } from '@/utils/coachResponseParser';

interface ChatMessage {
  id: string;
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const formatCoachMessage = (text: string) => {
  const lines = text.split('\n');
  const formatted: JSX.Element[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) {
      formatted.push(<div key={index} className="h-3" />);
      return;
    }
    
    // Detect headings (all caps or ending with colon)
    if (trimmedLine === trimmedLine.toUpperCase() || trimmedLine.endsWith(':')) {
      formatted.push(
        <h3 key={index} className="font-bold text-base mt-4 mb-2 first:mt-0 border-b-2 border-primary/20 pb-1">
          {trimmedLine}
        </h3>
      );
      return;
    }
    
    // Detect bullet points
    if (trimmedLine.match(/^[-•*]\s/)) {
      const content = trimmedLine.replace(/^[-•*]\s/, '');
      formatted.push(
        <li key={index} className="ml-4 mb-2 leading-relaxed">
          {formatInlineText(content)}
        </li>
      );
      return;
    }
    
    // Detect numbered lists
    if (trimmedLine.match(/^\d+\.\s/)) {
      const content = trimmedLine.replace(/^\d+\.\s/, '');
      formatted.push(
        <li key={index} className="ml-4 mb-2 list-decimal leading-relaxed">
          {formatInlineText(content)}
        </li>
      );
      return;
    }
    
    // Regular paragraph
    formatted.push(
      <p key={index} className="mb-3 leading-relaxed">
        {formatInlineText(trimmedLine)}
      </p>
    );
  });
  
  return <div className="space-y-1">{formatted}</div>;
};

const formatInlineText = (text: string) => {
  // Bold text between **asterisks** or __underscores__
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-primary">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('__') && part.endsWith('__')) {
      return <u key={i} className="underline decoration-2 underline-offset-2">{part.slice(2, -2)}</u>;
    }
    return <span key={i}>{part}</span>;
  });
};

const MKROCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { canUseFeature, promptsRemaining, incrementPromptUsage, isDevelopmentMode, isTrialExpired } = useTrial();
  const { profile } = useUserProfile();
  
  const { 
    isConnected: isVoiceConnected, 
    isSpeaking, 
    status: voiceStatus,
    connect: connectVoice, 
    disconnect: disconnectVoice,
    sendText: sendVoiceText 
  } = useRealtimeVoice(profile, {
    onTranscript: (text, isFinal) => {
      if (isFinal && text.trim()) {
        const coachMessage: ChatMessage = {
          id: `${Date.now()}-${Math.random()}`,
          type: 'coach',
          content: text,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, coachMessage]);
      }
    }
  });

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

      // Detect and save plans
      const planType = detectPlanType(coachResponse);
      console.log('Detected plan type:', planType);
      
      if (planType === 'meal' || planType === 'both') {
        const mealPlan = parseMealPlan(coachResponse);
        console.log('Parsed meal plan:', mealPlan);
        if (mealPlan.length > 0) {
          localStorage.setItem('mkro_meal_plan', JSON.stringify(mealPlan));
          // Trigger storage event for same-window updates
          window.dispatchEvent(new Event('storage'));
          toast({
            title: "Meal Plan Ready! 🍽️",
            description: "Check the Nutrition tab to view your personalized meal plan.",
          });
        }
      }
      
      if (planType === 'workout' || planType === 'both') {
        const workoutPlan = parseWorkoutPlan(coachResponse);
        console.log('Parsed workout plan:', workoutPlan);
        if (workoutPlan.length > 0) {
          localStorage.setItem('mkro_workout_plan', JSON.stringify(workoutPlan));
          // Trigger storage event for same-window updates
          window.dispatchEvent(new Event('storage'));
          toast({
            title: "Workout Plan Ready! 💪",
            description: "Check the Exercise tab to view your personalized training plan.",
          });
        }
      }
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
    
    const messageText = currentMessage;
    setCurrentMessage('');

    // If in voice mode and connected, use voice
    if (mode === 'voice' && isVoiceConnected) {
      sendVoiceText(messageText);
      return;
    }

    // Otherwise use text mode
    await sendCoachingMessage(messageText, updatedMessages);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMode = async () => {
    if (mode === 'text') {
      setMode('voice');
      await connectVoice();
    } else {
      setMode('text');
      disconnectVoice();
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
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Bot className="w-8 h-8 text-primary" />
              <div className="flex flex-col gap-1">
                <span className="font-bold">MKRO</span>
                <span className="text-sm font-normal text-muted-foreground">Your AI PT & Nutrition Coach</span>
              </div>
              {!isDevelopmentMode && promptsRemaining <= 5 && promptsRemaining > 0 && (
                <span className="text-sm text-muted-foreground ml-auto">
                  {promptsRemaining} prompts left
                </span>
              )}
            </CardTitle>
          </div>
          {mode === 'voice' && (
            <div className="text-sm text-muted-foreground mt-2">
              {isSpeaking && <span className="text-primary animate-pulse">● AI is speaking...</span>}
              {isVoiceConnected && !isSpeaking && <span className="text-green-600">● Connected - Start speaking!</span>}
              {voiceStatus === 'connecting' && <span className="text-yellow-600">● Connecting...</span>}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/20">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <Bot className="w-16 h-16 mx-auto mb-4 text-primary" />
                  <h2 className="text-xl font-bold mb-2 text-foreground">Hi! I'm MKRO</h2>
                  <p className="text-base mb-1">Your AI PT & Nutrition Coach</p>
                  <p className="text-sm">Start chatting to get your personalized fitness plan!</p>
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
                     <div className={cn(
                      "rounded-lg p-4",
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border shadow-sm'
                    )}>
                      {message.type === 'user' ? (
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      ) : (
                        <>
                          <div className="text-sm">
                            {formatCoachMessage(message.content)}
                          </div>
                          {(() => {
                            const planType = detectPlanType(message.content);
                            return planType !== 'none' && (
                              <div className="flex gap-2 mt-4 pt-3 border-t border-current/10">
                                {(planType === 'meal' || planType === 'both') && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => window.location.href = '/nutrition'}
                                    className="text-xs"
                                  >
                                    <Calendar className="h-3 w-3 mr-1" />
                                    View in Nutrition
                                  </Button>
                                )}
                                {(planType === 'workout' || planType === 'both') && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => window.location.href = '/exercise'}
                                    className="text-xs"
                                  >
                                    <Dumbbell className="h-3 w-3 mr-1" />
                                    View in Exercise
                                  </Button>
                                )}
                              </div>
                            );
                          })()}
                        </>
                      )}
                      <div className="text-xs opacity-70 mt-3 pt-2 border-t border-current/10">
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
                placeholder={mode === 'voice' && isVoiceConnected 
                  ? "Type or speak your message..." 
                  : "Ask MKRO about training, nutrition, or get your personalized plan..."}
                className="flex-1 min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={toggleMode}
                  disabled={isLoading}
                  size="lg"
                  variant={mode === 'voice' && isVoiceConnected ? "default" : "outline"}
                  className={cn(
                    "px-6",
                    mode === 'voice' && isVoiceConnected && "bg-green-600 hover:bg-green-700",
                    mode === 'voice' && voiceStatus === 'connecting' && "animate-pulse"
                  )}
                  title={mode === 'voice' && isVoiceConnected ? "Disconnect voice" : "Start voice conversation"}
                >
                  {mode === 'voice' && voiceStatus === 'connecting' ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : mode === 'voice' && isVoiceConnected ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MKROCoach;