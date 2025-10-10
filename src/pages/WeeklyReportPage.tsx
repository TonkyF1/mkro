import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Award, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface WeeklyReport {
  id: string;
  week_start: string;
  week_end: string;
  summary: string;
  badges: string[];
  suggestions: string;
  ai_raw: any;
  created_at: string;
}

const WeeklyReportPage = () => {
  const { toast } = useToast();
  const [reports, setReports] = useState<WeeklyReport[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('weekly_reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReports(data);
    }
    setIsLoading(false);
  };

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-weekly-report', {
        body: { week_start: new Date().toISOString().split('T')[0] },
      });

      if (error) throw error;

      toast({
        title: 'Report Generated',
        description: 'Your weekly report is ready!',
      });

      fetchReports();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate report',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading reports...</div>;
  }

  const latestReport = reports[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <TrendingUp className="w-10 h-10" />
            Weekly Report
          </h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>
        <Button onClick={generateReport} disabled={isGenerating}>
          {isGenerating ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      {latestReport && (
        <>
          {/* Latest Report */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>This Week</CardTitle>
                <Badge variant="secondary">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(latestReport.week_start).toLocaleDateString()} -{' '}
                  {new Date(latestReport.week_end).toLocaleDateString()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <p className="text-muted-foreground">{latestReport.summary}</p>
              </div>

              {latestReport.ai_raw && (
                <div>
                  <h3 className="font-semibold mb-3">Progress</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Meal Adherence</span>
                        <span className="font-medium">
                          {latestReport.ai_raw.adherence?.toFixed(0) || 0}%
                        </span>
                      </div>
                      <Progress value={latestReport.ai_raw.adherence || 0} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Meals Completed</p>
                        <p className="text-2xl font-bold">
                          {latestReport.ai_raw.completedMeals || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Hydration Days</p>
                        <p className="text-2xl font-bold">
                          {latestReport.ai_raw.hydrationMet || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Exercise Volume</p>
                        <p className="text-2xl font-bold">
                          {latestReport.ai_raw.totalVolume || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {latestReport.badges && latestReport.badges.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Badges Earned
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {latestReport.badges.map((badge, idx) => (
                      <Badge key={idx} variant="default" className="text-sm px-3 py-1">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {latestReport.suggestions && (
                <div>
                  <h3 className="font-semibold mb-2">Suggestions</h3>
                  <p className="text-muted-foreground">{latestReport.suggestions}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Reports */}
          {reports.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Past Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {reports.slice(1).map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">
                        {new Date(report.week_start).toLocaleDateString()} -{' '}
                        {new Date(report.week_end).toLocaleDateString()}
                      </span>
                      {report.badges && report.badges.length > 0 && (
                        <Badge variant="secondary">{report.badges.length} badges</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.summary}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!latestReport && (
        <Card>
          <CardContent className="py-12 text-center">
            <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate your first weekly report to track your progress
            </p>
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate First Report'}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeeklyReportPage;
