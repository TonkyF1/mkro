import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/hooks/useUserProfile';
import { supabase } from '@/integrations/supabase/client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import WeeklyReports from '@/pages/WeeklyReports';

interface WeightRow { date: string; weight_kg: number; }

export default function Stats() {
  const { profile } = useUserProfile();
  const [weights, setWeights] = useState<WeightRow[]>([]);

  useEffect(() => {
    document.title = 'Progress & Stats | MKRO';
    const desc = 'Track weight trends, achievements and view AI weekly reports.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name','description'); document.head.appendChild(meta); }
    meta.setAttribute('content', desc);
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('weight_logs')
        .select('date, weight_kg')
        .order('date');
      setWeights((data || []).map(r => ({ date: r.date as unknown as string, weight_kg: Number(r.weight_kg) })));
    };
    load();
  }, []);

  return (
    <main className="min-h-screen p-4 pb-24 container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Progress & Stats</h1>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Points</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{profile?.points ?? 0}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Streak</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{profile?.streak ?? 0} days</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Level</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{profile?.level ?? 'Bronze'}</CardContent>
        </Card>
      </section>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Weight Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          {weights.length === 0 ? (
            <div className="h-full flex items-center justify-center text-muted-foreground">No weight data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weights} margin={{ left: 12, right: 12, bottom: 12 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight_kg" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <WeeklyReports />
    </main>
  );
}
