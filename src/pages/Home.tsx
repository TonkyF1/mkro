import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import {
  ChefHat,
  Utensils,
  Dumbbell,
  Brain,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Apple,
  Activity,
  Target,
  Zap,
  Check,
  Star,
  Award
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import mkroLogo from '@/assets/mkro-logo-new.svg';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: ChefHat,
      title: 'Smart Recipe Library',
      description: 'Discover nutritious recipes tailored to your goals with detailed macros and cooking times',
      gradient: 'from-emerald-500/10 to-teal-600/10',
      iconGradient: 'from-emerald-500 to-teal-600',
      action: () => navigate('/recipes')
    },
    {
      icon: Apple,
      title: 'Nutrition Tracking',
      description: 'Track your daily intake with visual progress bars, charts, and macro breakdowns',
      gradient: 'from-blue-500/10 to-cyan-600/10',
      iconGradient: 'from-blue-500 to-cyan-600',
      action: () => navigate('/nutrition')
    },
    {
      icon: Dumbbell,
      title: 'Workout Plans',
      description: 'Follow personalized exercise routines with progress tracking and video guides',
      gradient: 'from-rose-500/10 to-pink-600/10',
      iconGradient: 'from-rose-500 to-pink-600',
      action: () => navigate('/exercise')
    },
    {
      icon: Brain,
      title: 'AI Coach',
      description: 'Get personalized meal plans and training programs from your AI health assistant',
      gradient: 'from-purple-500/10 to-violet-600/10',
      iconGradient: 'from-purple-500 to-violet-600',
      action: () => navigate('/coach')
    }
  ];

  const benefits = [
    'Personalized meal plans based on your goals',
    'Detailed nutrition tracking and insights',
    'Custom workout programs',
    'AI-powered recommendations',
    'Recipe scanning and generation',
    'Progress tracking and analytics'
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-20 pb-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center space-y-8 animate-fade-in">
              {/* Logo */}
              <div className="flex justify-center mb-8">
                <img 
                  src={mkroLogo} 
                  alt="MKRO" 
                  className="h-32 w-auto drop-shadow-2xl animate-float"
                />
              </div>
              
              {/* Headline */}
              <div className="space-y-4">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient-shift">
                    Your AI Health
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-accent via-hydration to-accent bg-clip-text text-transparent bg-300% animate-gradient-shift">
                    Coach
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-medium">
                  Transform your lifestyle with personalized nutrition plans, smart workouts, and AI-powered guidance
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button 
                  size="lg" 
                  className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] transition-all duration-300 group"
                  onClick={() => navigate(user ? '/nutrition' : '/profile')}
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {user ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="gap-2 text-lg px-8 py-6 border-2 hover:bg-primary/5"
                  onClick={() => navigate('/recipes')}
                >
                  <ChefHat className="w-5 h-5" />
                  Explore Recipes
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-16">
                <div className="text-center">
                  <p className="text-4xl font-black bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">500+</p>
                  <p className="text-sm text-muted-foreground mt-1">Recipes</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black bg-gradient-to-r from-accent to-hydration bg-clip-text text-transparent">AI</p>
                  <p className="text-sm text-muted-foreground mt-1">Powered</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-black bg-gradient-to-r from-hydration to-primary bg-clip-text text-transparent">24/7</p>
                  <p className="text-sm text-muted-foreground mt-1">Support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-black">
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Everything You Need
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                All-in-one platform for nutrition, fitness, and wellness
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`group p-8 cursor-pointer border-0 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-gradient-to-br ${feature.gradient}`}
                  onClick={feature.action}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.iconGradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-2xl font-bold group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent transition-all">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary font-semibold pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 px-6 bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-black">
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Why Choose MKRO?
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join thousands transforming their health with our comprehensive, AI-powered platform
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div 
                      key={index} 
                      className="flex items-center gap-4 p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all duration-300"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/50 flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <div className="aspect-square bg-gradient-to-br from-primary/20 via-accent/20 to-hydration/20 p-12">
                    <div className="h-full rounded-2xl bg-card/50 backdrop-blur-sm border-2 border-primary/20 p-8 flex flex-col justify-center items-center text-center space-y-6">
                      <Target className="w-20 h-20 text-primary animate-pulse-glow" />
                      <h3 className="text-3xl font-black">Reach Your Goals</h3>
                      <p className="text-muted-foreground">
                        Whether it's weight loss, muscle gain, or healthy living, MKRO adapts to your unique journey
                      </p>
                      <Button 
                        className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] group"
                        onClick={() => navigate('/profile')}
                      >
                        <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                        Start Your Journey
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-black">
              <span className="bg-gradient-to-r from-primary via-accent to-hydration bg-clip-text text-transparent bg-300% animate-gradient-shift">
                Ready to Transform?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground">
              Join MKRO today and start your personalized health journey with AI-powered guidance
            </p>
            <Button 
              size="lg"
              className="gap-2 text-lg px-12 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] transition-all duration-300 group"
              onClick={() => navigate(user ? '/nutrition' : '/profile')}
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              {user ? 'Go to Dashboard' : 'Get Started Now'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
