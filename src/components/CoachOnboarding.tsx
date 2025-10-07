import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useCoach } from '@/hooks/useCoach';
import { Loader2 } from 'lucide-react';

export const CoachOnboarding = () => {
  const { generating, generatePlan } = useCoach();
  const [weeks, setWeeks] = useState(4);

  const handleGenerate = async () => {
    try {
      await generatePlan(weeks);
    } catch (error) {
      console.error('Failed to generate plan:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to MKRO Coach</CardTitle>
        <CardDescription>
          Get started with your personalized training and nutrition plan
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Plan Duration (weeks)
          </label>
          <div className="flex gap-2">
            {[4, 6, 8, 12].map((w) => (
              <Button
                key={w}
                variant={weeks === w ? 'default' : 'outline'}
                onClick={() => setWeeks(w)}
                size="sm"
              >
                {w} weeks
              </Button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full"
          size="lg"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating your plan...
            </>
          ) : (
            'Generate My Plan'
          )}
        </Button>

        <p className="text-sm text-muted-foreground">
          Your plan will be based on your profile information. Make sure your profile is complete for the best results.
        </p>
      </CardContent>
    </Card>
  );
};
