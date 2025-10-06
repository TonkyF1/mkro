import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Dumbbell, Play, Target } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  instructions: string[];
  videoUrl?: string;
}

const exerciseDatabase: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    category: 'Strength',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders'],
    equipment: ['Barbell', 'Bench'],
    difficulty: 'Intermediate',
    instructions: [
      'Lie flat on bench with feet on floor',
      'Grip bar slightly wider than shoulder width',
      'Lower bar to mid-chest with control',
      'Press bar up explosively until arms extended',
      'Keep shoulder blades retracted throughout'
    ],
    videoUrl: 'https://www.youtube.com/embed/rT7DgCr-3pg'
  },
  {
    id: '2',
    name: 'Barbell Back Squat',
    category: 'Strength',
    muscleGroups: ['Quadriceps', 'Glutes', 'Hamstrings'],
    equipment: ['Barbell', 'Squat Rack'],
    difficulty: 'Intermediate',
    instructions: [
      'Position bar on upper traps',
      'Stand with feet shoulder-width apart',
      'Descend by pushing hips back and bending knees',
      'Lower until thighs parallel to ground',
      'Drive through heels to return to start'
    ],
    videoUrl: 'https://www.youtube.com/embed/ultWZbUMPL8'
  },
  {
    id: '3',
    name: 'Conventional Deadlift',
    category: 'Strength',
    muscleGroups: ['Back', 'Glutes', 'Hamstrings'],
    equipment: ['Barbell'],
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend down and grip bar outside legs',
      'Keep back flat, chest up, shoulders over bar',
      'Drive through floor with legs to lift bar',
      'Stand fully upright, then lower with control'
    ],
    videoUrl: 'https://www.youtube.com/embed/op9kVnSso6Q'
  },
  {
    id: '4',
    name: 'Pull-ups',
    category: 'Strength',
    muscleGroups: ['Back', 'Biceps'],
    equipment: ['Pull-up Bar'],
    difficulty: 'Intermediate',
    instructions: [
      'Hang from bar with overhand grip',
      'Engage core and keep body straight',
      'Pull yourself up until chin over bar',
      'Lower with control to full extension',
      'Avoid swinging or kipping'
    ],
    videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g'
  },
  {
    id: '5',
    name: 'Dumbbell Shoulder Press',
    category: 'Strength',
    muscleGroups: ['Shoulders', 'Triceps'],
    equipment: ['Dumbbells'],
    difficulty: 'Beginner',
    instructions: [
      'Sit with back supported, dumbbells at shoulder height',
      'Press weights overhead until arms extended',
      'Keep core engaged throughout',
      'Lower with control back to shoulders',
      'Avoid arching lower back'
    ],
    videoUrl: 'https://www.youtube.com/embed/qEwKCR5JCog'
  },
  {
    id: '6',
    name: 'Running',
    category: 'Cardio',
    muscleGroups: ['Legs', 'Cardiovascular'],
    equipment: ['None'],
    difficulty: 'Beginner',
    instructions: [
      'Start with 5-minute warm-up walk',
      'Maintain steady pace appropriate for fitness level',
      'Keep upright posture with relaxed shoulders',
      'Land midfoot with each stride',
      'Cool down with 5-minute walk'
    ]
  },
  {
    id: '7',
    name: 'Mountain Climbers',
    category: 'HIIT',
    muscleGroups: ['Core', 'Shoulders', 'Legs'],
    equipment: ['None'],
    difficulty: 'Intermediate',
    instructions: [
      'Start in plank position',
      'Drive one knee towards chest',
      'Quickly switch legs in running motion',
      'Maintain flat back throughout',
      'Keep core engaged and hips level'
    ],
    videoUrl: 'https://www.youtube.com/embed/nmwgirgXLYM'
  },
  {
    id: '8',
    name: 'Plank',
    category: 'Core',
    muscleGroups: ['Core', 'Shoulders'],
    equipment: ['None'],
    difficulty: 'Beginner',
    instructions: [
      'Start on forearms and toes',
      'Keep body in straight line from head to heels',
      'Engage core and glutes',
      'Hold position without sagging or piking',
      'Breathe steadily throughout'
    ],
    videoUrl: 'https://www.youtube.com/embed/pSHjTRCQxIw'
  }
];

export const ExerciseLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const categories = ['All', 'Strength', 'Cardio', 'HIIT', 'Core'];

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.muscleGroups.some(mg => mg.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-primary/10 to-accent/10">
        <CardHeader>
          <CardTitle className="text-2xl">Exercise Library</CardTitle>
          <p className="text-sm text-muted-foreground">
            Browse {exerciseDatabase.length}+ exercises with video demonstrations
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search exercises or muscle groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredExercises.map(exercise => (
          <Card 
            key={exercise.id}
            className="group cursor-pointer hover:-translate-y-1 transition-all duration-300 border-0 bg-gradient-to-br from-card to-card/50 hover:shadow-xl"
            onClick={() => setSelectedExercise(exercise)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-primary" />
                </div>
                {exercise.videoUrl && (
                  <Play className="w-5 h-5 text-primary" />
                )}
              </div>
              
              <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                {exercise.name}
              </h3>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                {exercise.muscleGroups.map(muscle => (
                  <Badge key={muscle} variant="secondary" className="text-xs">
                    {muscle}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{exercise.category}</span>
                <Badge variant="outline">{exercise.difficulty}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedExercise !== null} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedExercise?.name}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            {selectedExercise && (
              <div className="space-y-6">
                {selectedExercise.videoUrl && (
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                    <iframe
                      src={selectedExercise.videoUrl}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                    <p className="text-sm text-muted-foreground mb-1">Category</p>
                    <p className="font-semibold">{selectedExercise.category}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                    <p className="text-sm text-muted-foreground mb-1">Difficulty</p>
                    <p className="font-semibold">{selectedExercise.difficulty}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Target Muscles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscleGroups.map(muscle => (
                      <Badge key={muscle} variant="secondary">{muscle}</Badge>
                    ))}
                  </div>
                </div>

                {selectedExercise.equipment.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Dumbbell className="w-4 h-4" />
                      Equipment Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedExercise.equipment.map(item => (
                        <Badge key={item} variant="outline">{item}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold mb-3">Instructions</h4>
                  <ol className="space-y-3">
                    {selectedExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                          {index + 1}
                        </span>
                        <span className="text-sm text-muted-foreground pt-0.5">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};
