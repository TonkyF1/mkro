import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, Area, AreaChart
} from 'recharts';
import { Calendar, TrendingUp, Award, Flame, Target, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Mock data - in real app, this would come from Supabase
const strengthProgressData = [
  { date: 'Week 1', bench: 135, squat: 185, deadlift: 225 },
  { date: 'Week 2', bench: 140, squat: 195, deadlift: 235 },
  { date: 'Week 3', bench: 145, squat: 200, deadlift: 245 },
  { date: 'Week 4', bench: 150, squat: 210, deadlift: 255 },
  { date: 'Week 5', bench: 155, squat: 215, deadlift: 265 },
  { date: 'Week 6', bench: 160, squat: 225, deadlift: 275 },
];

const volumeData = [
  { week: 'Week 1', chest: 12000, back: 15000, legs: 18000, shoulders: 8000, arms: 6000 },
  { week: 'Week 2', chest: 13500, back: 16500, legs: 19500, shoulders: 9000, arms: 7000 },
  { week: 'Week 3', chest: 14200, back: 17200, legs: 20500, shoulders: 9500, arms: 7500 },
  { week: 'Week 4', chest: 15000, back: 18000, legs: 21500, shoulders: 10000, arms: 8000 },
];

const muscleFrequency = [
  { muscle: 'Chest', frequency: 2, fullMark: 3 },
  { muscle: 'Back', frequency: 2.5, fullMark: 3 },
  { muscle: 'Legs', frequency: 2, fullMark: 3 },
  { muscle: 'Shoulders', frequency: 1.5, fullMark: 3 },
  { muscle: 'Arms', frequency: 2, fullMark: 3 },
  { muscle: 'Core', frequency: 3, fullMark: 3 },
];

const workoutFrequencyData = [
  { month: 'Jan', workouts: 12 },
  { month: 'Feb', workouts: 15 },
  { month: 'Mar', workouts: 18 },
  { month: 'Apr', workouts: 20 },
  { month: 'May', workouts: 22 },
  { month: 'Jun', workouts: 24 },
];

const personalRecords = [
  { exercise: 'Bench Press', weight: 225, date: '2025-01-15', improvement: '+15 lbs' },
  { exercise: 'Squat', weight: 315, date: '2025-01-20', improvement: '+25 lbs' },
  { exercise: 'Deadlift', weight: 405, date: '2025-01-25', improvement: '+35 lbs' },
  { exercise: 'Pull-ups', reps: 15, date: '2025-01-30', improvement: '+3 reps' },
];

export const ProgressDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('strength');

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="text-2xl">Progress Analytics</CardTitle>
          <p className="text-sm text-muted-foreground">
            Track your fitness journey with comprehensive insights
          </p>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 bg-gradient-to-br from-blue-500/10 to-cyan-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-600">+8%</Badge>
            </div>
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-3xl font-black">24</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-pink-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-500" />
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-600">+15%</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Total Volume</p>
            <p className="text-3xl font-black">285K</p>
            <p className="text-xs text-muted-foreground">lbs lifted</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-emerald-500/10 to-teal-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Award className="w-5 h-5 text-emerald-500" />
              <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">New!</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Personal Records</p>
            <p className="text-3xl font-black">4</p>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-orange-500/10 to-red-600/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <Badge variant="secondary" className="bg-orange-500/20 text-orange-600">🔥</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-3xl font-black">12</p>
            <p className="text-xs text-muted-foreground">Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Personal Records */}
      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Personal Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {personalRecords.map((pr, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 hover:from-primary/10 hover:to-accent/10 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-black">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{pr.exercise}</p>
                    <p className="text-sm text-muted-foreground">{pr.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black">
                    {'weight' in pr ? `${pr.weight} lbs` : `${pr.reps} reps`}
                  </p>
                  <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600">
                    {pr.improvement}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="frequency">Frequency</TabsTrigger>
          <TabsTrigger value="muscle">Muscle Split</TabsTrigger>
        </TabsList>

        <TabsContent value="strength">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Strength Progression</CardTitle>
              <p className="text-sm text-muted-foreground">Track your strength gains over time</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={strengthProgressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="bench" stroke="#8b5cf6" strokeWidth={3} name="Bench Press" />
                  <Line type="monotone" dataKey="squat" stroke="#ec4899" strokeWidth={3} name="Squat" />
                  <Line type="monotone" dataKey="deadlift" stroke="#06b6d4" strokeWidth={3} name="Deadlift" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volume">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Training Volume by Muscle Group</CardTitle>
              <p className="text-sm text-muted-foreground">Total weight lifted per muscle group</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="chest" fill="#8b5cf6" name="Chest" />
                  <Bar dataKey="back" fill="#ec4899" name="Back" />
                  <Bar dataKey="legs" fill="#06b6d4" name="Legs" />
                  <Bar dataKey="shoulders" fill="#f59e0b" name="Shoulders" />
                  <Bar dataKey="arms" fill="#10b981" name="Arms" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="frequency">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Workout Frequency</CardTitle>
              <p className="text-sm text-muted-foreground">Monthly workout consistency</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={workoutFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="workouts" 
                    stroke="#8b5cf6" 
                    fill="url(#colorWorkouts)" 
                    strokeWidth={3}
                  />
                  <defs>
                    <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="muscle">
          <Card className="border-0">
            <CardHeader>
              <CardTitle>Muscle Group Training Frequency</CardTitle>
              <p className="text-sm text-muted-foreground">Weekly training frequency per muscle group</p>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={muscleFrequency}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="muscle" stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
                  <Radar 
                    name="Training Frequency" 
                    dataKey="frequency" 
                    stroke="#8b5cf6" 
                    fill="#8b5cf6" 
                    fillOpacity={0.3} 
                    strokeWidth={2}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '12px'
                    }} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
