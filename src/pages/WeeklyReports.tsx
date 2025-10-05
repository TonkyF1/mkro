import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PremiumGate } from '@/components/PremiumGate';
import { Loader2, TrendingUp, Target, Sparkles, Calendar, Award, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WeeklyReport {
  summary: string;
  nutrition_insights: string;
  training_insights: string;
  recommendations: string[];
  achievements: string[];
  week_start: string;
  week_end: string;
}

const WeeklyReports = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<WeeklyReport | null>(null);

  const isPremium = profile?.is_premium || profile?.subscription_status === 'premium';

  useEffect(() => {
    if (isPremium && user) {
      generateReport();
    }
  }, [isPremium, user]);

  const generateReport = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-weekly-report', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      if (data?.report) {
        setReport(data.report);
      }
    } catch (error: any) {
      console.error('Error generating report:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate weekly report. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isPremium) {
    return (
      <PremiumGate 
        feature="Weekly AI Reports"
        description="Get personalized weekly insights and recommendations powered by AI to optimize your nutrition and training."
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gradient-to-br from-violet-500/20 to-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-5xl mx-auto p-6 space-y-8 relative z-10">
        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-purple-500 to-pink-600 bg-clip-text text-transparent">
                Weekly AI Reports
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">AI-powered insights & recommendations</p>
            </div>
          </div>

          <Button 
            onClick={generateReport} 
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Generate New Report
              </>
            )}
          </Button>
        </div>

        {loading && !report && (
          <Card className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">AI is analyzing your data...</p>
          </Card>
        )}

        {report && (
          <div className="space-y-6">
            {/* Week Range */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  <CardTitle>Report Period</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  <span className="font-semibold">{new Date(report.week_start).toLocaleDateString()}</span>
                  {' - '}
                  <span className="font-semibold">{new Date(report.week_end).toLocaleDateString()}</span>
                </p>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <CardTitle>Weekly Summary</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{report.summary}</p>
              </CardContent>
            </Card>

            {/* Nutrition Insights */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-emerald-500" />
                  <CardTitle>Nutrition Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{report.nutrition_insights}</p>
              </CardContent>
            </Card>

            {/* Training Insights */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-blue-500" />
                  <CardTitle>Training Insights</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{report.training_insights}</p>
              </CardContent>
            </Card>

            {/* Achievements */}
            {report.achievements && report.achievements.length > 0 && (
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border-amber-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-500" />
                    <CardTitle>Achievements This Week</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {report.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-500 mt-1">🏆</span>
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Recommendations */}
            {report.recommendations && report.recommendations.length > 0 && (
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 border-purple-500/20">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-500" />
                    <CardTitle>AI Recommendations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {report.recommendations.map((rec, idx) => (
                      <div key={idx} className="p-4 bg-background rounded-lg border border-purple-500/20">
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {!loading && !report && (
          <Card className="p-12 text-center space-y-4">
            <Sparkles className="w-16 h-16 text-muted-foreground mx-auto" />
            <div>
              <h3 className="text-xl font-bold mb-2">Generate Your First Report</h3>
              <p className="text-muted-foreground">
                Click the button above to get AI-powered insights about your progress this week
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WeeklyReports;
