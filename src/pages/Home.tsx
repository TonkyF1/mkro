import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { 
  MessageSquare, 
  Camera, 
  ShoppingCart, 
  Calendar, 
  Dumbbell, 
  BookOpen,
  Sparkles,
  Target,
  TrendingUp,
  ChefHat
} from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: 'MKRO AI Coach',
      description: 'Get personalized nutrition and training advice from your AI-powered personal coach available 24/7.',
      action: () => navigate('/coach'),
      buttonText: 'Chat with Coach',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: Camera,
      title: 'Smart Food Scanner',
      description: 'Instantly scan any food item to get detailed nutritional information and track your macros effortlessly.',
      action: () => navigate('/food-diary'),
      buttonText: 'Scan Food',
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: ShoppingCart,
      title: 'Shopping List Generator',
      description: 'Automatically generate shopping lists from your meal plans and never forget an ingredient again.',
      action: () => navigate('/planner'),
      buttonText: 'Create List',
      gradient: 'from-secondary/20 to-secondary/5'
    },
    {
      icon: Calendar,
      title: 'Meal Planner',
      description: 'Plan your entire week of meals with our intelligent meal planning system tailored to your goals.',
      action: () => navigate('/planner'),
      buttonText: 'Plan Meals',
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: Dumbbell,
      title: 'Exercise Tracker',
      description: 'Log your workouts, track progress, and stay motivated with comprehensive exercise tracking.',
      action: () => navigate('/exercise'),
      buttonText: 'Track Workout',
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: ChefHat,
      title: 'Recipe Library',
      description: 'Explore hundreds of healthy, delicious recipes with detailed nutritional information and instructions.',
      action: () => navigate('/'),
      buttonText: 'Browse Recipes',
      gradient: 'from-secondary/20 to-secondary/5'
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: 'Reach Your Goals',
      description: 'Whether it\'s weight loss, muscle gain, or healthy living, MKRO adapts to your objectives.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Intelligence',
      description: 'Leveraging cutting-edge AI to provide personalized recommendations and insights.'
    },
    {
      icon: TrendingUp,
      title: 'Track Your Progress',
      description: 'Monitor your journey with comprehensive tracking and analytics for continuous improvement.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-6 space-y-16 pb-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8">
        <div className="inline-block">
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your AI-Powered Health Companion</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Transform Your Health
          <span className="block text-primary mt-2">With MKRO</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Your complete training and meal planning coach. Get personalized nutrition advice, 
          track your meals, plan your workouts, and achieve your fitness goals with AI-powered intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => navigate('/coach')} className="gap-2">
            <MessageSquare className="w-5 h-5" />
            Talk to Your Coach
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/planner')} className="gap-2">
            <Calendar className="w-5 h-5" />
            Start Planning Meals
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="border-2">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you achieve your health and fitness goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={feature.action}
                >
                  {feature.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/20">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Join thousands of users who are transforming their health with MKRO's intelligent coaching platform
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => navigate('/coach')} className="gap-2">
            <Sparkles className="w-5 h-5" />
            Get Started Free
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/profile')}>
            View Your Profile
          </Button>
        </div>
      </section>
      </div>
    </div>
  );
};

export default Home;
