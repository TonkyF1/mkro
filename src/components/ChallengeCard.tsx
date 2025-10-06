import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, Dumbbell, Droplet, Target } from 'lucide-react';
import { Challenge } from '@/hooks/useChallenges';

interface ChallengeCardProps {
  challenge: Challenge;
  compact?: boolean;
}

const typeIcons = {
  nutrition: Target,
  exercise: Dumbbell,
  hydration: Droplet,
  habit: Flame,
};

const difficultyColors = {
  easy: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  hard: 'bg-red-500/10 text-red-500',
};

export const ChallengeCard = ({ challenge, compact = false }: ChallengeCardProps) => {
  const Icon = typeIcons[challenge.challenge_type];
  const progress = (challenge.current_progress / challenge.target_value) * 100;

  if (compact) {
    return (
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center`}>
            <Icon className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="font-semibold text-sm truncate">{challenge.title}</p>
              <Badge variant="secondary" className="text-xs">
                <Trophy className="w-3 h-3 mr-1" />
                {challenge.xp_reward}
              </Badge>
            </div>
            <Progress value={progress} className="h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {challenge.current_progress} / {challenge.target_value}
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{challenge.title}</h3>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge className={difficultyColors[challenge.difficulty]}>
            {challenge.difficulty}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Trophy className="w-3 h-3" />
            {challenge.xp_reward} XP
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {challenge.current_progress} / {challenge.target_value}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-xs text-muted-foreground">
          {Math.round(progress)}% complete
        </p>
      </div>
    </Card>
  );
};
