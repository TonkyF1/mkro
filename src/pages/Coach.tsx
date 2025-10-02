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
      <div className="container mx-auto p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Brain className="w-12 h-12 animate-pulse text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <Card className="max-w-md mx-auto p-8 text-center">
          <Brain className="w-16 h-16 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">
            You need to be signed in to access the MKRO Coach. The coach provides personalized meal plans and training programs based on your profile.
          </p>
          <Button onClick={() => navigate('/profile')} className="w-full gap-2">
            <LogIn className="w-4 h-4" />
            Sign In / Sign Up
          </Button>
        </Card>
      </div>
    );
  }

  return <MKROCoach />;
};

export default Coach;
