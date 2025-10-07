import { useAuth } from '@/hooks/useAuth';
import { useCoach } from '@/hooks/useCoach';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Loader2, RefreshCw } from 'lucide-react';
import { CoachOnboarding } from '@/components/CoachOnboarding';
import { TodaysWorkout } from '@/components/TodaysWorkout';
import { TodaysMeals } from '@/components/TodaysMeals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Coach = () => {
  const { user, loading: authLoading } = useAuth();
  const { todayPlan, loading, generating, fetchTodayPlan, generatePlan } = useCoach();

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="text-center space-y-4">
          <Brain className="w-16 h-16 mx-auto text-primary animate-pulse" />
          <p className="text-muted-foreground">Loading your AI Coach...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Brain className="w-12 h-12 mx-auto mb-4 text-primary" />
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Sign in to access your AI-powered fitness and nutrition coach
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              className="w-full"
              onClick={() => window.location.href = '/profile'}
            >
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasActivePlan = todayPlan && (todayPlan.workout || todayPlan.meals.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              MKRO Coach
            </h1>
            <p className="text-muted-foreground">Your AI-powered fitness and nutrition coach</p>
          </div>
          {hasActivePlan && (
            <Button
              variant="outline"
              onClick={() => fetchTodayPlan()}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          )}
        </div>

        {/* Content */}
        {!hasActivePlan ? (
          <div className="max-w-2xl mx-auto">
            <CoachOnboarding />
          </div>
        ) : (
          <Tabs defaultValue="today" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="today">Today's Plan</TabsTrigger>
              <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="today" className="mt-6 space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Today's Workout</h2>
                  <TodaysWorkout workout={todayPlan?.workout} />
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4">Today's Nutrition</h2>
                  <TodaysMeals
                    meals={todayPlan?.meals || []}
                    dailyTargets={todayPlan?.daily_targets}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Generate New Plan</CardTitle>
                    <CardDescription>Create a fresh training and nutrition plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => generatePlan(4)}
                      disabled={generating}
                      className="w-full"
                    >
                      {generating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate 4-Week Plan'
                      )}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Weekly Check-in</CardTitle>
                    <CardDescription>Log your progress and get feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Adjust Plan</CardTitle>
                    <CardDescription>Make changes to your current plan</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" disabled>
                      Coming Soon
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Coach;
