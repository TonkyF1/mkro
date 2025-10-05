import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { useTrial } from '@/hooks/useTrial';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import ProfileEdit from '@/components/ProfileEdit';
import { MacroGoalEditor } from '@/components/MacroGoalEditor';
import { 
  User, 
  Mail, 
  Crown, 
  TrendingUp, 
  Activity, 
  Droplet,
  Moon,
  Flame,
  Target,
  ChefHat,
  ShoppingCart,
  Clock,
  Edit,
  LogOut,
  Sparkles,
  Lock,
  Check,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GOALS, ACTIVITY_LEVELS, BUDGET_OPTIONS, COOKING_TIME_OPTIONS } from '@/types/profile';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const Profile = () => {
  const { profile, loading } = useUserProfile();
  const { user, signOut } = useAuth();
  const { isTrialExpired, isDevelopmentMode } = useTrial();
  const { toast } = useToast();
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingMacros, setEditingMacros] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const navigate = useNavigate();

  const signUpForm = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const signInForm = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const isPremium = profile?.is_premium || false;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const onSignUp = async (data) => {
    setIsAuthLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/questionnaire`;
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { name: data.name },
        },
      });

      if (error) throw error;
      toast({
        title: 'Check your email',
        description: "We've sent you a confirmation link to complete your registration.",
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description: error.message,
      });
    } finally {
      setIsAuthLoading(false);
      signUpForm.reset();
    }
  };

  const onSignIn = async (data) => {
    setIsAuthLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      toast({
        title: 'Sign in successful',
        description: 'Welcome back!',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: error.message,
      });
    } finally {
      setIsAuthLoading(false);
      signInForm.reset();
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    signUpForm.reset();
    signInForm.reset();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">
                {isSignUp ? 'Create Your Account' : 'Welcome to MKRO'}
              </CardTitle>
              <CardDescription>
                {isSignUp
                  ? 'Join us to start your personalized nutrition journey'
                  : 'Sign in to view your profile and access personalized features'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSignUp ? (
                <Form {...signUpForm}>
                  <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                    <FormField
                      control={signUpForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your full name" {...field} disabled={isAuthLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} disabled={isAuthLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signUpForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Create a password" {...field} disabled={isAuthLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isAuthLoading}>
                      {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </form>
                </Form>
              ) : (
                <Form {...signInForm}>
                  <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                    <FormField
                      control={signInForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter your email" {...field} disabled={isAuthLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={signInForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter your password" {...field} disabled={isAuthLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isAuthLoading}>
                      {isAuthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </form>
                </Form>
              )}
              <div className="mt-6 text-center text-sm text-muted-foreground">
                {isSignUp ? (
                  <>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      disabled={isAuthLoading}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={toggleAuthMode}
                      disabled={isAuthLoading}
                      className="text-primary hover:underline font-medium"
                    >
                      Sign up here
                    </button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (editingProfile) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <ProfileEdit 
          profile={profile!} 
          onBack={() => setEditingProfile(false)} 
          onSave={async (data) => {
            setEditingProfile(false);
          }}
        />
      </div>
    );
  }

  const goalLabel = GOALS.find(g => g.value === profile?.goal)?.label || 'Not set';
  const activityLabel = ACTIVITY_LEVELS.find(a => a.value === profile?.activity_level)?.label || 'Not set';
  const budgetOption = BUDGET_OPTIONS.find(b => b.value === profile?.budget_preference);
  const cookingTimeLabel = COOKING_TIME_OPTIONS.find(c => c.value === profile?.cooking_time_preference)?.label || 'Not set';

  // Calculate macro percentages for visual representation
  const totalMacros = (profile?.target_protein || 0) + (profile?.target_carbs || 0) + (profile?.target_fats || 0);
  const proteinPercent = totalMacros > 0 ? ((profile?.target_protein || 0) / totalMacros) * 100 : 0;
  const carbsPercent = totalMacros > 0 ? ((profile?.target_carbs || 0) / totalMacros) * 100 : 0;
  const fatsPercent = totalMacros > 0 ? ((profile?.target_fats || 0) / totalMacros) * 100 : 0;

  const premiumFeatures = [
    'Unlimited AI Coach Access',
    'Personalized Meal Plans',
    'Advanced Nutrition Tracking',
    'Custom Workout Programs',
    'Priority Support',
    'Recipe Scanner & Generator'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-muted-foreground mt-1">Manage your fitness journey</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => setEditingProfile(true)} size="lg" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="lg" className="gap-2">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Premium Status Banner */}
        <Card className={`p-6 ${isPremium ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-500/20' : 'bg-gradient-to-r from-muted/50 to-muted/30'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-amber-400 to-yellow-600' : 'bg-muted'}`}>
                {isPremium ? (
                  <Crown className="w-8 h-8 text-white" />
                ) : (
                  <Lock className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  {isPremium ? (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-500" />
                      Premium Member
                    </>
                  ) : (
                    'Free Trial'
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isPremium 
                    ? 'You have full access to all features' 
                    : isTrialExpired && !isDevelopmentMode
                    ? 'Your trial has ended - upgrade to continue'
                    : 'Enjoying your trial? Upgrade for unlimited access'}
                </p>
              </div>
            </div>
            {!isPremium && (
              <Button 
                size="sm" 
                onClick={() => navigate('/premium')}
                className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 shadow-md hover:shadow-lg transition-all mt-3 min-h-[40px] min-w-[40px]"
              >
                <Crown className="w-3.5 h-3.5" />
                <span className="text-sm font-semibold">Upgrade</span>
              </Button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info & Nutrition */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Info */}
            <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-2xl font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">{profile?.name || 'User'}</h2>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <User className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="text-xl font-bold">{profile?.age || '--'}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="text-xl font-bold">
                    {profile?.height ? `${profile.height}${profile.height_unit}` : '--'}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Activity className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="text-xl font-bold">
                    {profile?.weight ? `${profile.weight}${profile.weight_unit}` : '--'}
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Moon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Sleep</p>
                  <p className="text-xl font-bold">{profile?.sleep_hours ? `${profile.sleep_hours}h` : '--'}</p>
                </div>
              </div>
            </Card>

            {/* Nutrition Macros */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Daily Nutrition Targets</h3>
                    <p className="text-sm text-muted-foreground">Your personalized macro goals</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingMacros(true)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>

              <div className="space-y-6">
                {/* Protein */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-600">Protein</span>
                    <span className="text-xl font-bold">{profile?.target_protein || 0}g</span>
                  </div>
                  <Progress value={proteinPercent} className="h-3 bg-blue-100" />
                  <p className="text-xs text-muted-foreground mt-1">{proteinPercent.toFixed(0)}% of total macros</p>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-600">Carbs</span>
                    <span className="text-xl font-bold">{profile?.target_carbs || 0}g</span>
                  </div>
                  <Progress value={carbsPercent} className="h-3 bg-green-100" />
                  <p className="text-xs text-muted-foreground mt-1">{carbsPercent.toFixed(0)}% of total macros</p>
                </div>

                {/* Fats */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-orange-600">Fats</span>
                    <span className="text-xl font-bold">{profile?.target_fats || 0}g</span>
                  </div>
                  <Progress value={fatsPercent} className="h-3 bg-orange-100" />
                  <p className="text-xs text-muted-foreground mt-1">{fatsPercent.toFixed(0)}% of total macros</p>
                </div>
              </div>

              {/* Hydration */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Daily Water Goal</p>
                      <p className="text-sm text-muted-foreground">Stay hydrated</p>
                    </div>
                  </div>
                  <span className="text-2xl font-bold text-blue-500">
                    {profile?.hydration_goal ? `${profile.hydration_goal}ml` : '--'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Goals & Preferences */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Goals & Lifestyle</h3>
                    <p className="text-sm text-muted-foreground">Your fitness journey details</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingMacros(true)}
                  className="gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Primary Goal</p>
                  <p className="font-semibold">{goalLabel}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Activity Level</p>
                  <p className="font-semibold">{activityLabel}</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Meal Frequency</p>
                  <p className="font-semibold">{profile?.meal_frequency || '--'} meals/day</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Stress Level</p>
                  <p className="font-semibold">{profile?.stress_level ? `${profile.stress_level}/10` : '--'}</p>
                </div>
              </div>
            </Card>

            {/* Dietary Info */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Dietary Preferences</h3>
                  <p className="text-sm text-muted-foreground">Your food choices and restrictions</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2 text-muted-foreground">Preferences</p>
                  <div className="flex flex-wrap gap-2">
                    {profile?.dietary_preferences && profile.dietary_preferences.length > 0 ? (
                      profile.dietary_preferences.map((pref) => (
                        <Badge key={pref} variant="secondary" className="text-sm">
                          {pref.replace('-', ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">None set</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2 text-muted-foreground">Allergies</p>
                  <div className="flex flex-wrap gap-2">
                    {profile?.allergies && profile.allergies.length > 0 ? (
                      profile.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-sm">
                          {allergy.replace('-', ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-sm">None set</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cooking Time</p>
                      <p className="font-semibold text-sm">{cookingTimeLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-semibold text-sm">{budgetOption?.label || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Premium Features */}
          <div className="space-y-6">
            {!isPremium && (
              <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mx-auto">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
                    <p className="text-sm text-muted-foreground">
                      Unlock all features and take your fitness to the next level
                    </p>
                  </div>
                  <div className="space-y-2 text-left">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="lg" 
                    onClick={() => navigate('/premium')}
                    className="w-full gap-2 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                  >
                    <Crown className="w-4 h-4" />
                    Get Premium
                  </Button>
                </div>
              </Card>
            )}

            {/* Kitchen Equipment */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-primary" />
                Kitchen Equipment
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile?.kitchen_equipment && profile.kitchen_equipment.length > 0 ? (
                  profile.kitchen_equipment.map((equipment) => (
                    <Badge key={equipment} variant="outline" className="text-xs">
                      {equipment.replace('-', ' ')}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-sm">None set</span>
                )}
              </div>
            </Card>

            {/* Health Conditions */}
            {profile?.health_conditions && profile.health_conditions.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Health Considerations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.health_conditions.map((condition) => (
                    <Badge key={condition} variant="secondary" className="text-xs">
                      {condition.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Supplements */}
            {profile?.supplement_usage && profile.supplement_usage.length > 0 && (
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Supplements
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.supplement_usage.map((supplement) => (
                    <Badge key={supplement} variant="outline" className="text-xs">
                      {supplement.replace('-', ' ')}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Macro & Goal Editor Modal */}
      {profile && (
        <MacroGoalEditor 
          open={editingMacros} 
          onOpenChange={setEditingMacros}
          profile={profile}
        />
      )}
    </div>
  );
};

export default Profile;
