import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Brain,
  Camera,
  ChefHat,
  Target,
  TrendingUp,
  Dumbbell,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Target,
      title: 'Tell Us Your Goals',
      description: 'Complete a quick 5-step questionnaire about your fitness goals, dietary preferences, and lifestyle.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Brain,
      title: 'AI Builds Your Plan',
      description: 'Our AI coach creates a personalized meal and workout plan tailored specifically to you.',
      gradient: 'from-purple-500 to-violet-600',
    },
    {
      icon: Camera,
      title: 'Scan & Track Food',
      description: 'Use your camera to scan food items and instantly get nutritional information and log meals.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: ChefHat,
      title: 'Follow Meal Plans',
      description: 'Get daily meal recommendations with recipes, macros, and shopping lists.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Dumbbell,
      title: 'Track Workouts',
      description: 'Follow personalized workout plans with video guides and progress tracking.',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: TrendingUp,
      title: 'Monitor Progress',
      description: 'View detailed analytics, charts, and insights to stay motivated and on track.',
      gradient: 'from-amber-500 to-yellow-600',
    },
  ];

  const features = [
    'AI-powered personalized plans',
    'Smart food scanning & tracking',
    'Comprehensive recipe library',
    'Workout plans with video guides',
    'Detailed progress analytics',
    'Macro and calorie tracking',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="max-w-7xl mx-auto p-6 space-y-12">
        {/* Header */}
        <div className="text-center space-y-6 pt-8">
          <h1 className="text-5xl md:text-6xl font-black">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-300% animate-gradient-shift">
              How MKRO Works
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your personal AI health coach that makes fitness and nutrition simple, personalized, and effective
          </p>
        </div>

        {/* Privacy Badge */}
        <Card className="max-w-2xl mx-auto p-6 bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
          <div className="flex items-center gap-4 justify-center">
            <Shield className="w-8 h-8 text-primary" />
            <div className="text-center">
              <h3 className="font-bold text-lg">Your Data Stays Private</h3>
              <p className="text-sm text-muted-foreground">
                We use industry-standard encryption and never share your personal health data
              </p>
            </div>
          </div>
        </Card>

        {/* Steps */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Simple Steps to Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <Card 
                key={index}
                className="p-6 hover:-translate-y-2 transition-all duration-300 border-primary/10 bg-gradient-to-br from-card to-card/50"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg`}>
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-4xl font-black text-primary/20">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-8">
          <h2 className="text-3xl font-bold text-center">What You Get</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-primary/50 transition-all"
              >
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="max-w-3xl mx-auto p-12 text-center space-y-6 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/20">
          <Sparkles className="w-16 h-16 text-primary mx-auto" />
          <h2 className="text-4xl font-black">Ready to Start Your Journey?</h2>
          <p className="text-xl text-muted-foreground">
            Join thousands who are transforming their health with MKRO's AI-powered guidance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="gap-2 text-lg px-8 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] transition-all duration-300 group min-h-[56px]"
              onClick={() => navigate('/profile')}
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="gap-2 text-lg px-8 py-6 border-2 min-h-[56px]"
              onClick={() => navigate('/')}
            >
              Learn More
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;
