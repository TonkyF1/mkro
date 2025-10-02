import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useTrial } from '@/hooks/useTrial';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useWeeklyPlans } from '@/hooks/useWeeklyPlans';
import { useRealtimeVoice } from '@/hooks/useRealtimeVoice';
import { Send, Mic, MicOff, Volume2, VolumeX, Brain, Loader2, Calendar, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpgradePrompt from './UpgradePrompt';
import { supabase } from '@/integrations/supabase/client';
import { parseCoachOutput } from '@/utils/coachOutputParser';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const formatCoachMessage = (text: string) => {
  // Remove machine output blocks from display
  const cleanText = text.replace(/<!--MKRO_OUTPUT-->[\s\S]*?<!--\/MKRO_OUTPUT-->/g, '').trim();
  
  const lines = cleanText.split('\n');
  let html = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    if (!trimmed) {
      html += '<br/>';
      continue;
    }
    
    // Headers
    if (trimmed.match(/^#{1,3}\s/)) {
      const level = trimmed.match(/^(#{1,3})/)?.[0].length || 1;
      const text = trimmed.replace(/^#{1,3}\s/, '');
      html += `<h${level} class="font-bold text-lg mt-4 mb-2">${text}</h${level}>`;
      continue;
    }
    
    // Bullet points
    if (trimmed.match(/^[-•*]\s/)) {
      const content = trimmed.replace(/^[-•*]\s/, '');
      html += `<li class="ml-4 mb-1">${formatInlineText(content)}</li>`;
      continue;
    }
    
    // Numbered lists
    if (trimmed.match(/^\d+\.\s/)) {
      const content = trimmed.replace(/^\d+\.\s/, '');
      html += `<li class="ml-4 mb-1 list-decimal">${formatInlineText(content)}</li>`;
      continue;
    }
    
    // Regular paragraph
    html += `<p class="mb-2">${formatInlineText(trimmed)}</p>`;
  }
  
  return html;
};

const formatInlineText = (text: string): string => {
  // Bold
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-bold text-primary">$1</strong>');
  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
};

const MKROCoach = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isTrialExpired, isDevelopmentMode, canUseFeature } = useTrial();
  const { profile, saveProfile } = useUserProfile();
  const { savePlans } = useWeeklyPlans();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [pendingSave, setPendingSave] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    isConnected,
    isSpeaking,
    connect,
    disconnect,
  } = useRealtimeVoice(
    profile || undefined,
    {
      onTranscript: (text, isFinal) => {
        if (isFinal && text) {
          // Voice responses come through as transcripts
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage?.role === 'assistant') {
              // Update existing assistant message
              return [...prev.slice(0, -1), {
                ...lastMessage,
                content: text,
              }];
            }
            // Add new assistant message
            return [...prev, {
              role: 'assistant',
              content: text,
            }];
          });
        }
      },
    }
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendCoachingMessage = async (userInput: string, history: ChatMessage[]) => {
    const { data, error } = await supabase.functions.invoke('mkro-coach', {
      body: {
        messages: [
          ...history.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: userInput }
        ],
        profile: profile || undefined
      }
    });

    if (error) {
      console.error('Error sending coaching message:', error);
      throw new Error(error.message || 'Failed to send message');
    }

    if (!data || !data.response) {
      throw new Error('Invalid response from server');
    }

    return data.response;
  };

  const handleSaveAction = async (action: 'nutrition' | 'training' | 'both' | 'none') => {
    if (!pendingSave || action === 'none') {
      setPendingSave(null);
      return;
    }

    try {
      setIsLoading(true);
      const saveDirectives = {
        ...pendingSave,
        write: action === 'nutrition' 
          ? { nutrition: pendingSave.write.nutrition }
          : action === 'training'
          ? { training: pendingSave.write.training }
          : pendingSave.write
      };

      await savePlans(saveDirectives);
      setPendingSave(null);
      
      toast({
        title: 'Plans Saved',
        description: 'Your weekly plans have been saved successfully!',
      });
    } catch (error) {
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!canUseFeature('ai-coach')) {
      toast({
        variant: 'destructive',
        title: 'Trial Limit Reached',
        description: 'Please upgrade to continue using MKRO Coach.',
      });
      return;
    }

    if (mode === 'voice' && !isConnected) {
      await connect();
      return;
    }

    if (mode === 'text') {
      await sendTextMessage();
    }
  };

  const sendTextMessage = async () => {
    const userMessage = inputValue;
    setInputValue('');
    
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
    }]);
    
    setIsLoading(true);
    
    try {
      const response = await sendCoachingMessage(userMessage, messages);
      const { humanText, machineOutput } = parseCoachOutput(response);
      
      // Add human-readable response to messages
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: humanText,
      }]);
      
      // Handle machine output
      if (machineOutput) {
        switch (machineOutput.type) {
          case 'PLAN_PROPOSAL':
            setPendingSave({
              week_start_iso: machineOutput.data.week_start_iso,
              write: {
                nutrition: {
                  days: Object.keys(machineOutput.data.nutrition_week_partial || {}),
                  data: machineOutput.data.nutrition_week_partial
                },
                training: {
                  days: Object.keys(machineOutput.data.training_week_partial || {}),
                  data: machineOutput.data.training_week_partial
                }
              }
            });
            break;
            
          case 'SAVE_DIRECTIVES':
            await savePlans(machineOutput.data);
            break;
            
          case 'PROFILE_UPDATE':
            if (machineOutput.data.patch) {
              await saveProfile({ ...profile, ...machineOutput.data.patch } as any);
              toast({
                title: 'Profile Updated',
                description: 'Your profile has been updated successfully!',
              });
            }
            break;
        }
      }
      
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = async () => {
    if (mode === 'voice' && isConnected) {
      await disconnect();
    }
    setMode(prev => prev === 'text' ? 'voice' : 'text');
  };

  if (!isDevelopmentMode && isTrialExpired) {
    return <UpgradePrompt feature="AI Coach" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">MKRO Coach</h1>
                <p className="text-sm text-muted-foreground">
                  {mode === 'voice' ? (
                    isConnected ? (
                      isSpeaking ? 'Speaking...' : 'Listening...'
                    ) : 'Voice mode ready'
                  ) : 'Your AI fitness & nutrition coach'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={toggleMode}
                variant={mode === 'voice' ? 'default' : 'outline'}
                size="sm"
                className="gap-2"
              >
                {mode === 'voice' ? (
                  <>
                    <Mic className="w-4 h-4" />
                    Voice
                  </>
                ) : (
                  <>
                    <MicOff className="w-4 h-4" />
                    Text
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Chat Area */}
        <Card className="p-6 min-h-[500px] max-h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-center">
                <div className="space-y-4 p-8">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Welcome to MKRO Coach!</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                      I'm here to help you with personalized meal plans, training programs, and fitness guidance.
                      Just ask me what you need!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <div className={`w-full h-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-primary text-white' 
                        : 'bg-gradient-to-br from-primary/80 to-primary/60 text-white'
                    }`}>
                      {message.role === 'user' ? (
                        profile?.name?.charAt(0).toUpperCase() || 'U'
                      ) : (
                        <Brain className="w-5 h-5" />
                      )}
                    </div>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {message.role === 'user' ? (profile?.name || 'You') : 'MKRO Coach'}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {message.role === 'user' ? 'You' : 'AI'}
                      </Badge>
                    </div>
                    {message.role === 'assistant' && (
                      <div 
                        className="prose prose-sm max-w-none dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: formatCoachMessage(message.content) }}
                      />
                    )}
                    {message.role === 'user' && (
                      <p className="text-sm">{message.content}</p>
                    )}
                  </div>
                </div>
                
                {/* Save buttons after plan proposal */}
                {index === messages.length - 1 && message.role === 'assistant' && pendingSave && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-14">
                    <Button 
                      onClick={() => handleSaveAction('both')}
                      disabled={isLoading}
                      size="sm"
                      className="gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Save Both
                    </Button>
                    <Button 
                      onClick={() => handleSaveAction('nutrition')}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      Food Only
                    </Button>
                    <Button 
                      onClick={() => handleSaveAction('training')}
                      disabled={isLoading}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Dumbbell className="w-4 h-4" />
                      Training Only
                    </Button>
                    <Button 
                      onClick={() => handleSaveAction('none')}
                      disabled={isLoading}
                      variant="ghost"
                      size="sm"
                    >
                      Don't Save
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/80 to-primary/60 text-white">
                    <Brain className="w-5 h-5" />
                  </div>
                </Avatar>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">MKRO Coach is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {mode === 'text' && (
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask me anything about nutrition, training, or your goals..."
                className="min-h-[60px] resize-none"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !inputValue.trim()}
                size="lg"
                className="gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          )}

          {mode === 'voice' && (
            <div className="flex justify-center">
              <Button
                onClick={isConnected ? disconnect : connect}
                size="lg"
                variant={isConnected ? 'destructive' : 'default'}
                className="gap-2"
              >
                {isConnected ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    End Session
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Voice Chat
                  </>
                )}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default MKROCoach;