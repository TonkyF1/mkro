import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Play, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface Exercise {
  id: string;
  title: string;
  youtube_id: string;
  muscle_groups: string[];
  tips: string;
  warmup: string;
  cooldown: string;
}

const ExerciseLibrary = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = exercises.filter(
        (ex) =>
          ex.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ex.muscle_groups?.some((mg) => mg.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredExercises(filtered);
    } else {
      setFilteredExercises(exercises);
    }
  }, [searchQuery, exercises]);

  const fetchExercises = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('exercises_library')
      .select('*')
      .order('title');

    if (!error && data) {
      setExercises(data);
      setFilteredExercises(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" onClick={() => navigate('/exercise')} className="mb-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Exercise
          </Button>
          <h1 className="text-4xl font-bold">Exercise Library</h1>
          <p className="text-muted-foreground">Browse video tutorials and form tips</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder="Search exercises or muscle groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <p className="text-center py-8">Loading exercises...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => setSelectedExercise(exercise)}
            >
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-2">
                  <Play className="w-12 h-12 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">{exercise.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {exercise.muscle_groups?.map((mg) => (
                    <Badge key={mg} variant="secondary" className="text-xs">
                      {mg}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Video Modal */}
      <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.title}</DialogTitle>
          </DialogHeader>
          {selectedExercise && (
            <div className="space-y-4">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedExercise.youtube_id}`}
                  title={selectedExercise.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>

              {selectedExercise.muscle_groups && (
                <div>
                  <h3 className="font-semibold mb-2">Target Muscles</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedExercise.muscle_groups.map((mg) => (
                      <Badge key={mg} variant="secondary">
                        {mg}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedExercise.tips && (
                <div>
                  <h3 className="font-semibold mb-2">Form Tips</h3>
                  <p className="text-sm text-muted-foreground">{selectedExercise.tips}</p>
                </div>
              )}

              {selectedExercise.warmup && (
                <div>
                  <h3 className="font-semibold mb-2">Warm-up</h3>
                  <p className="text-sm text-muted-foreground">{selectedExercise.warmup}</p>
                </div>
              )}

              {selectedExercise.cooldown && (
                <div>
                  <h3 className="font-semibold mb-2">Cool-down</h3>
                  <p className="text-sm text-muted-foreground">{selectedExercise.cooldown}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExerciseLibrary;
