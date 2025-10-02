import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Sparkles,
  Camera,
  Scan,
  BrainCircuit,
  ChefHat,
  Dumbbell,
  ShoppingCart,
  Star,
  CheckCircle2,
  Target,
  TrendingUp,
  Clock,
  Users,
  Crown,
  Bell,
  Leaf,
  Award,
  Zap,
  ArrowRight,
  Calendar
} from 'lucide-react';
import aiCoachIcon from '@/assets/ai-coach-icon.png';
import foodScannerIcon from '@/assets/food-scanner-icon.png';
import shoppingListIcon from '@/assets/shopping-list-icon.png';
import mealPlannerIcon from '@/assets/meal-planner-icon.png';
import exerciseTrackerIcon from '@/assets/exercise-tracker-icon.png';
import recipeLibraryIcon from '@/assets/recipe-library-icon.png';

const Home = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'AI Food Scanner',
      description: 'Scan meals instantly to get calories & macros in seconds',
      action: () => navigate('/food-diary'),
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Scan className="w-6 h-6" />,
      title: 'Barcode Scanner',
      description: 'Quick UK product lookup with comprehensive nutritional data',
      action: () => navigate('/food-diary'),
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <BrainCircuit className="w-6 h-6" />,
      title: 'AI MKRO Coach',
      description: 'Personalised advice & plans tailored to your goals 24/7',
      action: () => navigate('/coach'),
      gradient: 'from-hydration/20 to-hydration/5'
    },
    {
      icon: <ChefHat className="w-6 h-6" />,
      title: 'AI Recipes',
      description: 'Recipes tailored to your diet, preferences & goals',
      action: () => navigate('/recipes'),
      gradient: 'from-primary/20 to-primary/5'
    },
    {
      icon: <Dumbbell className="w-6 h-6" />,
      title: 'Training Generator',
      description: 'Goal-based fitness plans that adapt to your progress',
      action: () => navigate('/exercise'),
      gradient: 'from-accent/20 to-accent/5'
    },
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      title: 'Auto Plans & Lists',
      description: 'Automatic meal planning with smart grocery lists',
      action: () => navigate('/planner'),
      gradient: 'from-hydration/20 to-hydration/5'
    }
  ];

  const howItWorksSteps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Set Your Goals',
      description: 'Tell MKRO what you want to achieve'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Generates Plans',
      description: 'Get personalised meal & training plans'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Shop Smart',
      description: 'Follow your auto-generated grocery list'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Track & Achieve',
      description: 'Monitor progress and hit your goals'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Weight Loss Journey',
      rating: 5,
      text: 'MKRO transformed how I approach nutrition. Lost 15kg in 4 months!'
    },
    {
      name: 'James P.',
      role: 'Muscle Building',
      rating: 5,
      text: 'The AI coach knows exactly what I need. Best fitness app I\'ve used.'
    },
    {
      name: 'Emma L.',
      role: 'Healthy Lifestyle',
      rating: 5,
      text: 'Finally an app that makes meal planning actually enjoyable!'
    }
  ];

  return (
    <div className="space-y-24 pb-16 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-hydration/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-8 pt-12 animate-fade-in">
        <div className="inline-block">
          <Badge className="px-4 py-2 bg-primary/10 text-primary border-primary/20 text-sm font-medium">
            <Sparkles className="w-4 h-4 mr-2" />
            Your AI-Powered Health Platform
          </Badge>
        </div>
        
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            Plan smarter.
            <span className="block text-primary">Eat better.</span>
            <span className="block text-accent">Train stronger.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your complete AI health coach with smart meal planning, food scanning, and personalised training programs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" onClick={() => navigate('/coach')} className="gap-2 text-lg h-14 px-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <MessageSquare className="w-5 h-5" />
            Start Free Today
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/recipes')} className="gap-2 text-lg h-14 px-8 border-2 transition-all duration-300 hover:scale-105">
            Explore Features
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Trust Signal */}
        <div className="flex items-center justify-center gap-8 pt-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Used by early adopters</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <span className="text-sm font-medium">Powered by AI</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful AI-driven features to help you achieve your health goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainFeatures.map((feature, index) => (
            <Card 
              key={index} 
              className="border-2 border-border hover:border-primary/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
              onClick={feature.action}
            >
              <CardHeader className="space-y-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            How <span className="text-primary">MKRO</span> Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-2 border-border hover:border-primary/40 transition-all duration-300 text-center h-full">
                <CardHeader className="space-y-4 pb-6">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary">
                    {step.icon}
                  </div>
                  <CardTitle className="text-lg flex items-center justify-center gap-2">
                    <span className="text-primary font-bold">{index + 1}</span>
                    {step.title}
                  </CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
              {index < howItWorksSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-8 w-6 h-6 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Loved by Our <span className="text-primary">Community</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            See what early users are saying about MKRO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-accent text-accent" />
                  ))}
                </div>
                <CardDescription className="text-base italic text-foreground">
                  "{testimonial.text}"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Progress & Motivation Section */}
      <section className="space-y-8 max-w-4xl mx-auto">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <Clock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-3xl">Stay on Track with 7-Day Check-ins</CardTitle>
            <CardDescription className="text-lg">
              Regular motivation and progress reviews to keep you accountable and moving forward
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Weekly Progress Reviews</p>
                  <p className="text-sm text-muted-foreground">Track your journey with detailed insights</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Bell className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Smart Reminders</p>
                  <p className="text-sm text-muted-foreground">Push notifications coming soon</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Target className="w-6 h-6 text-hydration flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Goal Adjustments</p>
                  <p className="text-sm text-muted-foreground">Plans that adapt to your progress</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
                <Award className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold">Milestone Celebrations</p>
                  <p className="text-sm text-muted-foreground">Badges & streaks coming soon</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Smart Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Smart Features That <span className="text-accent">Stand Out</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <Card 
            className="border-2 border-border hover:border-accent/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onClick={() => navigate('/recipes')}
          >
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                <ChefHat className="w-7 h-7 text-accent" />
              </div>
              <CardTitle className="text-2xl">Smart Leftovers</CardTitle>
              <CardDescription className="text-base">
                MKRO suggests creative recipes to use your leftover ingredients, helping you reduce waste and save money
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="border-2 border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg cursor-pointer"
            onClick={() => navigate('/recipes')}
          >
            <CardHeader className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Leaf className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-2xl">Seasonal UK Ingredients</CardTitle>
              <CardDescription className="text-base">
                Get recommendations based on what's fresh and in season in the UK for the best taste and value
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Premium Preview Section */}
      <section className="max-w-4xl mx-auto">
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          
          <CardHeader className="text-center space-y-4 relative z-10">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl md:text-4xl">Premium Features Coming Soon</CardTitle>
            <CardDescription className="text-lg">
              Get early access to exclusive features and priority support
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Advanced AI Coaching</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Custom Meal Plans</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Priority Support</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">Unlimited Scans</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Button size="lg" disabled className="gap-2">
                <Crown className="w-5 h-5" />
                Join Waitlist (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Final CTA Section */}
      <section className="text-center space-y-8 py-16 px-6 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-hydration/5 border-2 border-primary/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-float" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/20 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        
        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join MKRO today and start your journey to a healthier, stronger you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" onClick={() => navigate('/coach')} className="gap-2 text-lg h-14 px-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Sparkles className="w-5 h-5" />
              Start Free Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/nutrition')} className="gap-2 text-lg h-14 px-8 border-2 transition-all duration-300 hover:scale-105">
              <Calendar className="w-5 h-5" />
              Explore Features
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;