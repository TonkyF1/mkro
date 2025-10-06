import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Trophy, Flame, TrendingUp, Plus } from 'lucide-react';
import { useChallenges } from '@/hooks/useChallenges';
import { useUserStats } from '@/hooks/useUserStats';
import { ChallengeCard } from '@/components/ChallengeCard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const Challenges = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeChallenges, completedChallenges, loading } = useChallenges();
  const { stats, getXPProgress } = useUserStats();

  if (!user) {
    return (
      <Card className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Sign In Required</h2>
        <p className="text-muted-foreground mb-6">Sign in to view and complete challenges</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Challenges</h1>
          <p className="text-muted-foreground">Complete challenges to earn XP and level up</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Challenge
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">Level {stats?.level || 1}</p>
                <p className="text-sm text-muted-foreground">{stats?.total_xp || 0} Total XP</p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Progress value={getXPProgress()} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {Math.round(getXPProgress())}% to next level
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.current_streak || 0} Days</p>
                <p className="text-sm text-muted-foreground">Current Streak</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Longest: {stats?.longest_streak || 0} days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats?.challenges_completed || 0}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {activeChallenges.length} active challenges
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Challenges List */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="w-full max-w-md">
          <TabsTrigger value="active" className="flex-1">
            Active ({activeChallenges.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex-1">
            Completed ({completedChallenges.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Loading challenges...</p>
            </Card>
          ) : activeChallenges.length === 0 ? (
            <Card className="p-8 text-center">
              <Trophy className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Active Challenges</h3>
              <p className="text-muted-foreground mb-4">
                Start a new challenge to earn XP and level up!
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Challenge
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4 mt-6">
          {completedChallenges.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No completed challenges yet</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedChallenges.map((challenge) => (
                <ChallengeCard key={challenge.id} challenge={challenge} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Challenges;
