import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MKROCoach from '@/components/MKROCoach';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, LogIn } from 'lucide-react';

const Coach = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-mesh)]" />
        <div className="relative text-center space-y-4 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center shadow-[var(--shadow-glow-primary)] animate-pulse">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <p className="text-muted-foreground text-lg">Loading your AI Coach...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-mesh)]" />
        <div className="relative container mx-auto p-8 flex items-center justify-center min-h-screen">
          <Card className="max-w-md p-8 text-center space-y-6 border-0 bg-card/50 backdrop-blur-xl shadow-[var(--shadow-2xl)]">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center shadow-[var(--shadow-glow-primary)]">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sign In Required
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Access your AI MKRO Coach for personalized meal plans and training programs tailored to your goals
              </p>
            </div>
            <Button 
              onClick={() => navigate('/profile')} 
              className="w-full gap-2 py-6 bg-gradient-to-r from-primary to-accent hover:shadow-[var(--shadow-glow-primary)] transition-all duration-300"
              size="lg"
            >
              <LogIn className="w-5 h-5" />
              Sign In / Sign Up
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return <MKROCoach />;
};

export default Coach;
