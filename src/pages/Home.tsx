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

const Home = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: 'AI Food Scanner',
      description: 'Scan meals instantly to get calories & macros in seconds',
      action: () => navigate('/nutrition'),
      gradient: 'from-violet-600 to-purple-600'
    },
    {
      icon: <Scan className="w-8 h-8" />,
      title: 'Barcode Scanner',
      description: 'Quick UK product lookup with comprehensive nutritional data',
      action: () => navigate('/nutrition'),
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <BrainCircuit className="w-8 h-8" />,
      title: 'AI MKRO Coach',
      description: 'Personalised advice & plans tailored to your goals 24/7',
      action: () => navigate('/coach'),
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: <ChefHat className="w-8 h-8" />,
      title: 'AI Recipes',
      description: 'Recipes tailored to your diet, preferences & goals',
      action: () => navigate('/recipes'),
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <Dumbbell className="w-8 h-8" />,
      title: 'Training Generator',
      description: 'Goal-based fitness plans that adapt to your progress',
      action: () => navigate('/exercise'),
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Auto Plans & Lists',
      description: 'Automatic meal planning with smart grocery lists',
      action: () => navigate('/planner'),
      gradient: 'from-amber-500 to-orange-600'
    }
  ];

  const howItWorksSteps = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Set Your Goals',
      description: 'Tell MKRO what you want to achieve',
      gradient: 'from-violet-600 to-purple-600'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'AI Generates Plans',
      description: 'Get personalised meal & training plans',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: 'Shop Smart',
      description: 'Follow your auto-generated grocery list',
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Track & Achieve',
      description: 'Monitor progress and hit your goals',
      gradient: 'from-orange-500 to-red-600'
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
    <div className="space-y-24 pb-12 relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Hero Section */}
      <section className="text-center space-y-12 pt-12 animate-fade-in relative z-10 max-w-7xl mx-auto px-6">
        <div className="inline-block">
          <Badge className="px-6 py-3 bg-gradient-to-r from-violet-500/10 to-purple-500/10 text-violet-700 dark:text-violet-300 border-2 border-violet-200 dark:border-violet-800 text-sm font-semibold rounded-full">
            <Sparkles className="w-4 h-4 mr-2" />
            Your AI-Powered Health Platform
          </Badge>
        </div>
        
        <div className="space-y-8">
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">
            <span className="block">Plan smarter.</span>
            <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Eat better.
            </span>
            <span className="block bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              Train stronger.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl mx-auto leading-relaxed font-medium">
            Your complete AI health coach with smart meal planning, food scanning, and personalised training programs
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
          <Button size="lg" onClick={() => navigate('/coach')} className="gap-2 text-lg px-8 py-6 h-auto">
            <MessageSquare className="w-5 h-5" />
            Start Free Today
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/recipes')} className="gap-2 text-lg px-8 py-6 h-auto">
            Explore Features
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Trust Signal */}
        <div className="flex items-center justify-center gap-12 pt-12 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold">Early Adopters</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-sm font-semibold">AI Powered</span>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="space-y-12 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black">
            Everything You Need to{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Powerful AI-driven features to help you achieve your health goals
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainFeatures.map((feature, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-transparent transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl cursor-pointer overflow-hidden"
              onClick={feature.action}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              <div className="relative space-y-4">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="space-y-12 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black">
            How{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              MKRO
            </span>{' '}
            Works
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Four simple steps to transform your health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-2 border-slate-200 dark:border-slate-800 hover:border-transparent hover:shadow-2xl transition-all duration-500 text-center h-full overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                <CardHeader className="space-y-6 pb-8 relative">
                  <div className={`mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">{step.icon}</div>
                  </div>
                  <CardTitle className="text-xl flex items-center justify-center gap-3">
                    <span className={`text-3xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                      {index + 1}
                    </span>
                    <span>{step.title}</span>
                  </CardTitle>
                  <CardDescription className="text-base">{step.description}</CardDescription>
                </CardHeader>
              </Card>
              {index < howItWorksSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute top-1/2 -right-4 w-8 h-8 text-slate-300 dark:text-slate-700 z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="space-y-12 max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-black">
            Loved by Our{' '}
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Community
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            See what early users are saying about MKRO
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-2 border-slate-200 dark:border-slate-800 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <CardHeader className="space-y-6 relative">
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <CardDescription className="text-base italic text-foreground font-medium">
                  "{testimonial.text}"
                </CardDescription>
              </CardHeader>
              <CardContent className="relative">
                <div>
                  <p className="font-bold text-lg">{testimonial.name}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Streak Section */}
      <section className="space-y-12 max-w-5xl mx-auto px-6 relative z-10">
        <Card className="border-2 border-amber-300 dark:border-amber-700 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
          
          <CardHeader className="text-center space-y-6 relative z-10">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <Award className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-4xl md:text-5xl font-black">
              Unlock Rewards with Your{' '}
              <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                5-Day Streak!
              </span>
            </CardTitle>
            <CardDescription className="text-lg text-slate-600 dark:text-slate-400">
              Track your meals for 5 days in a row and unlock a premium celebration experience with confetti, achievements, and progress insights
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-8 p-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mb-4 shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-lg mb-2">Check Off Meals</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Mark each meal as complete</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 shadow-lg">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-lg mb-2">Track 5 Days</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Build your weekly streak</p>
              </div>
              <div className="text-center p-6 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-800">
                <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-lg mb-2">Get Rewarded</p>
                <p className="text-sm text-slate-600 dark:text-slate-400">Unlock celebrations</p>
              </div>
            </div>

            <div className="text-center">
              <Button size="lg" onClick={() => navigate('/nutrition')} className="gap-2 px-8 py-6 h-auto text-lg">
                <Calendar className="w-5 h-5" />
                Start Tracking Today
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Final CTA */}
      <section className="max-w-5xl mx-auto px-6 relative z-10">
        <div className="text-center space-y-12 py-20 px-8 rounded-3xl bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-5xl md:text-6xl font-black">
              Ready to Transform Your Health?
            </h2>
            <p className="text-xl text-violet-100 max-w-2xl mx-auto font-medium">
              Join MKRO today and start your journey to a healthier, stronger you
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Button 
                size="lg" 
                onClick={() => navigate('/coach')} 
                className="gap-2 text-lg px-8 py-6 h-auto bg-white text-violet-600 hover:bg-slate-100 shadow-xl hover:shadow-2xl"
              >
                <Sparkles className="w-5 h-5" />
                Start Free Today
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/nutrition')} 
                className="gap-2 text-lg px-8 py-6 h-auto border-2 border-white text-white hover:bg-white hover:text-violet-600"
              >
                <Calendar className="w-5 h-5" />
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
