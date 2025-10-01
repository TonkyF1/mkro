import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-16 pb-16 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-hydration/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-6 pt-8 animate-fade-in">
        <div className="inline-block animate-float">
          <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full border-2 border-primary/30 mb-6 shadow-lg backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-primary animate-pulse-glow" />
            <span className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Your AI-Powered Health Companion</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight animate-fade-in-up">
          Transform Your Health
          <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mt-2 animate-pulse-glow">With MKRO</span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          Your complete training and meal planning coach. Get personalized nutrition advice, 
          track your meals, plan your workouts, and achieve your fitness goals with AI-powered intelligence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Button size="lg" onClick={() => navigate('/coach')} className="gap-2 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <MessageSquare className="w-5 h-5" />
            Talk to Your Coach
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/nutrition')} className="gap-2 border-2 border-primary/30 hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105">
            <Calendar className="w-5 h-5" />
            Start Planning Meals
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br from-card to-primary/5 backdrop-blur-sm group"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <benefit.icon className="w-6 h-6 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{benefit.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-8 animate-fade-in" style={{ animationDelay: '1s' }}>
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Succeed</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you achieve your health and fitness goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 border-primary/20 hover:border-accent/40 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-card to-secondary/20 backdrop-blur-sm group overflow-hidden relative"
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-hydration/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">{feature.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <Button 
                  variant="outline" 
                  className="w-full border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300 group-hover:shadow-md" 
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
      <section className="text-center space-y-6 py-12 px-6 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-hydration/10 border-2 border-primary/30 shadow-2xl relative overflow-hidden backdrop-blur-sm animate-fade-in" style={{ animationDelay: '1.2s' }}>
        {/* Animated background circles */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-accent to-hydration bg-clip-text text-transparent">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto font-medium">
            Join thousands of users who are transforming their health with MKRO&apos;s intelligent coaching platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/coach')} className="gap-2 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 border-2 border-primary/20">
              <Sparkles className="w-5 h-5 animate-pulse-glow" />
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/profile')} className="border-2 border-primary/30 hover:border-accent hover:bg-accent/10 transition-all duration-300 hover:scale-105">
              View Your Profile
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
