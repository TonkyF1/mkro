import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Send, Bot, User } from 'lucide-react';

interface ChatMessage {
  type: 'user' | 'coach';
  content: string;
  timestamp: Date;
}

const MCROCoach = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // User profile inputs
  const [sex, setSex] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [days, setDays] = useState('');
  const [sessionLength, setSessionLength] = useState('');
  const [equipment, setEquipment] = useState('');
  const [injuries, setInjuries] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [fat, setFat] = useState('');

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Construct the coaching prompt
      const prompt = `You are MCRO, a UK PT & nutrition coach. Always tailor to the individual. Use UK units.

User message: ${currentMessage}

Known details: sex=${sex}, age=${age}, height=${height}cm, weight=${weight}kg, goal=${goal}, days=${days}, session_length=${sessionLength} mins, equipment=${equipment}, injuries=${injuries}, calories=${calories}, protein=${protein}g, fat=${fat}g.

---

Rules:
- If the user provides enough info (sex, goal, days, etc.), generate a personalised plan:
 1) Macros (kcal + P/C/F)
 2) Training Plan (7-day schedule, tailored to male/female physiology, sets/reps/RPE/rest, warm-up, finisher, swaps for limited equipment)
 3) 1-day sample meal plan (table: Meal | Ingredients g | kcal | P/C/F)
 4) Weekly shopping list grouped (Protein, Carbs, Fats, Produce, Other)
 5) Next 3 action steps
- If info is missing, ask exactly 3 onboarding questions (goal, calories or stats, training days/equipment).
- Male plans: emphasise strength/hypertrophy, heavier compounds, 6–12 rep ranges.
- Female plans: emphasise glute/lower volume, higher rep ranges (10–20), shorter rests, core stability.
- Fat loss = higher density/circuits, muscle gain = hypertrophy/progressive overload, performance = power/strength/conditioning.
- Always concise: bullets, tables, no fluff.
- Always end with 3 Next Actions.`;

      const { data, error } = await supabase.functions.invoke('hf-proxy', {
        body: { prompt }
      });

      if (error) {
        console.error('Error calling coach function:', error);
        toast({
          title: "Error",
          description: "Failed to get coach response. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const coachMessage: ChatMessage = {
        type: 'coach',
        content: data?.text || 'Sorry, I encountered an issue. Please try again.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, coachMessage]);
      setCurrentMessage('');

    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
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
            MCRO - Your AI PT & Nutrition Coach
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* User Profile Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sex">Sex</Label>
              <Select value={sex} onValueChange={setSex}>
                <SelectTrigger>
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="e.g. 175"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 75"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Select value={goal} onValueChange={setGoal}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fat_loss">Fat Loss</SelectItem>
                  <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                  <SelectItem value="performance">Performance</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Days/Week</Label>
              <Select value={days} onValueChange={setDays}>
                <SelectTrigger>
                  <SelectValue placeholder="Training days" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 days</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="4">4 days</SelectItem>
                  <SelectItem value="5">5 days</SelectItem>
                  <SelectItem value="6">6 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionLength">Session Length</Label>
              <Select value={sessionLength} onValueChange={setSessionLength}>
                <SelectTrigger>
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 mins</SelectItem>
                  <SelectItem value="45">45 mins</SelectItem>
                  <SelectItem value="60">60 mins</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="equipment">Equipment</Label>
              <Input
                id="equipment"
                value={equipment}
                onChange={(e) => setEquipment(e.target.value)}
                placeholder="e.g. gym, dumbbells, bodyweight"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Calories (optional)</Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="Daily calories"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                placeholder="Daily protein"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                placeholder="Daily fat"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="injuries">Injuries/Limitations</Label>
              <Input
                id="injuries"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
                placeholder="Any injuries or limitations"
              />
            </div>
          </div>

          <Separator />

          {/* Chat Messages */}
          <div className="space-y-4">
            <div className="h-96 overflow-y-auto border rounded-lg p-4 space-y-4 bg-muted/20">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="w-12 h-12 mx-auto mb-2 text-primary" />
                  <p>Hi! I'm MCRO, your AI PT & Nutrition Coach.</p>
                  <p>Start chatting to get your personalized fitness plan!</p>
                </div>
              )}
              
              {messages.map((message, index) => (
                <div key={index} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
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
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask MCRO about training, nutrition, or get your personalized plan..."
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

export default MCROCoach;