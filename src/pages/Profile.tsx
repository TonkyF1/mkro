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
  Sun,
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
import { useTheme } from 'next-themes';
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
  const { theme, setTheme } = useTheme();
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
      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">Manage your fitness journey</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              variant="outline" 
              size="sm" 
              className="gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              {theme === 'dark' ? 'Light' : 'Dark'}
            </Button>
            <Button onClick={() => setEditingProfile(true)} size="sm" className="gap-1.5">
              <Edit className="w-3.5 h-3.5" />
              Edit Profile
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm" className="gap-1.5">
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Premium Status Banner */}
        <Card className={`p-4 ${isPremium ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-500/20' : 'bg-gradient-to-r from-muted/50 to-muted/30'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPremium ? 'bg-gradient-to-br from-amber-400 to-yellow-600' : 'bg-muted'}`}>
                {isPremium ? (
                  <Crown className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className="text-base font-bold flex items-center gap-1.5">
                  {isPremium ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Premium Member
                    </>
                  ) : (
                    'Free Trial'
                  )}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isPremium 
                    ? 'Full access to all features' 
                    : isTrialExpired && !isDevelopmentMode
                    ? 'Trial ended - upgrade to continue'
                    : 'Upgrade for unlimited access'}
                </p>
              </div>
            </div>
            {!isPremium && (
              <Button 
                size="sm" 
                onClick={() => navigate('/premium')}
                className="gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
              >
                <Crown className="w-3 h-3" />
                <span className="text-xs font-semibold">Upgrade</span>
              </Button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column - User Info & Nutrition */}
          <div className="lg:col-span-2 space-y-4">
            {/* Account Info */}
            <Card className="p-4 bg-gradient-to-br from-card to-card/50 border-primary/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-lg font-bold text-white">
                  {profile?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold truncate">{profile?.name || 'User'}</h2>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-3 h-3 flex-shrink-0" />
                    <span className="text-xs truncate">{user?.email}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <User className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="text-base font-bold">{profile?.age || '--'}</p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <TrendingUp className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="text-base font-bold">
                    {profile?.height ? `${profile.height}${profile.height_unit}` : '--'}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Activity className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-base font-bold">
                    {profile?.weight ? `${profile.weight}${profile.weight_unit}` : '--'}
                  </p>
                </div>
                <div className="text-center p-2 bg-muted/50 rounded-lg">
                  <Droplet className="w-4 h-4 mx-auto mb-1 text-primary" />
                  <p className="text-xs text-muted-foreground">Sleep</p>
                  <p className="text-base font-bold">{profile?.sleep_hours ? `${profile.sleep_hours}h` : '--'}</p>
                </div>
              </div>
            </Card>

            {/* Nutrition Macros */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Flame className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Daily Nutrition</h3>
                    <p className="text-xs text-muted-foreground">Macro goals</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingMacros(true)}
                  className="gap-1.5 h-7"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
              </div>

              <div className="space-y-3">
                {/* Protein */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-blue-600">Protein</span>
                    <span className="text-base font-bold">{profile?.target_protein || 0}g</span>
                  </div>
                  <Progress value={proteinPercent} className="h-2 bg-blue-100" />
                  <p className="text-xs text-muted-foreground mt-0.5">{proteinPercent.toFixed(0)}% of total</p>
                </div>

                {/* Carbs */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-green-600">Carbs</span>
                    <span className="text-base font-bold">{profile?.target_carbs || 0}g</span>
                  </div>
                  <Progress value={carbsPercent} className="h-2 bg-green-100" />
                  <p className="text-xs text-muted-foreground mt-0.5">{carbsPercent.toFixed(0)}% of total</p>
                </div>

                {/* Fats */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold text-orange-600">Fats</span>
                    <span className="text-base font-bold">{profile?.target_fats || 0}g</span>
                  </div>
                  <Progress value={fatsPercent} className="h-2 bg-orange-100" />
                  <p className="text-xs text-muted-foreground mt-0.5">{fatsPercent.toFixed(0)}% of total</p>
                </div>
              </div>

              {/* Hydration */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Droplet className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">Daily Water Goal</p>
                      <p className="text-xs text-muted-foreground">Stay hydrated</p>
                    </div>
                  </div>
                  <span className="text-base font-bold text-blue-500">
                    {profile?.hydration_goal ? `${profile.hydration_goal}ml` : '--'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Goals & Preferences */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">Goals & Lifestyle</h3>
                    <p className="text-xs text-muted-foreground">Fitness journey</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingMacros(true)}
                  className="gap-1.5 h-7"
                >
                  <Edit className="w-3 h-3" />
                  Edit
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Primary Goal</p>
                  <p className="text-sm font-semibold">{goalLabel}</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Activity Level</p>
                  <p className="text-sm font-semibold">{activityLabel}</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Meal Frequency</p>
                  <p className="text-sm font-semibold">{profile?.meal_frequency || '--'} meals/day</p>
                </div>
                <div className="p-2 bg-muted/30 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-0.5">Stress Level</p>
                  <p className="text-sm font-semibold">{profile?.stress_level ? `${profile.stress_level}/10` : '--'}</p>
                </div>
              </div>
            </Card>

            {/* Dietary Info */}
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <ChefHat className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Dietary Preferences</h3>
                  <p className="text-xs text-muted-foreground">Food choices</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold mb-1.5 text-muted-foreground">Preferences</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile?.dietary_preferences && profile.dietary_preferences.length > 0 ? (
                      profile.dietary_preferences.map((pref) => (
                        <Badge key={pref} variant="secondary" className="text-xs">
                          {pref.replace('-', ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">None set</span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold mb-1.5 text-muted-foreground">Allergies</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile?.allergies && profile.allergies.length > 0 ? (
                      profile.allergies.map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergy.replace('-', ' ')}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">None set</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Cooking Time</p>
                      <p className="font-semibold text-xs">{cookingTimeLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-semibold text-xs">{budgetOption?.label || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Premium Features */}
          <div className="space-y-4">
            {!isPremium && (
              <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border-amber-500/20">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mx-auto">
                    <Crown className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold mb-1">Upgrade to Premium</h3>
                    <p className="text-xs text-muted-foreground">
                      Unlock all features
                    </p>
                  </div>
                  <div className="space-y-1.5 text-left">
                    {premiumFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-primary" />
                        </div>
                        <span className="text-xs">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/premium')}
                    className="w-full gap-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    Get Premium
                  </Button>
                </div>
              </Card>
            )}

            {/* Kitchen Equipment */}
            <Card className="p-4">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                <ChefHat className="w-4 h-4 text-primary" />
                Kitchen Equipment
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {profile?.kitchen_equipment && profile.kitchen_equipment.length > 0 ? (
                  profile.kitchen_equipment.map((equipment) => (
                    <Badge key={equipment} variant="outline" className="text-xs">
                      {equipment.replace('-', ' ')}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground text-xs">None set</span>
                )}
              </div>
            </Card>

            {/* Health Conditions */}
            {profile?.health_conditions && profile.health_conditions.length > 0 && (
              <Card className="p-4">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-primary" />
                  Health Considerations
                </h3>
                <div className="flex flex-wrap gap-1.5">
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
              <Card className="p-4">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-primary" />
                  Supplements
                </h3>
                <div className="flex flex-wrap gap-1.5">
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
