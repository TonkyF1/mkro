import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/LoadingScreen';

// Pages
import Auth from '@/pages/Auth';
import Onboarding from '@/pages/Onboarding';
import Home from '@/pages/Home';
import Recipes from '@/pages/Recipes';
import FoodDiaryPage from '@/pages/FoodDiaryPage';
import Exercise from '@/pages/Exercise';
import AICoach from '@/pages/AICoach';
import Stats from '@/pages/Stats';
import WeeklyReports from '@/pages/WeeklyReports';
import Timer from '@/pages/Timer';
import Profile from '@/pages/Profile';
import Planner from '@/pages/Planner';
import Community from '@/pages/Community';
import MainLayout from '@/layouts/MainLayout';

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
      <Route path="/onboarding" element={user ? <Onboarding /> : <Navigate to="/auth" />} />
      
      <Route element={user ? <MainLayout /> : <Navigate to="/auth" />}>
        <Route path="/" element={<Home />} />
        {/* Food/Recipes aliases */}
        <Route path="/food" element={<Recipes />} />
        <Route path="/recipes" element={<Recipes />} />
        {/* Diary/Nutrition aliases */}
        <Route path="/diary" element={<FoodDiaryPage />} />
        <Route path="/nutrition" element={<FoodDiaryPage />} />
        {/* Gym/Exercise aliases */}
        <Route path="/gym" element={<Exercise />} />
        <Route path="/exercise" element={<Exercise />} />
        {/* Reports/Stats */}
        <Route path="/stats" element={<Stats />} />
        <Route path="/reports" element={<WeeklyReports />} />
        <Route path="/coach" element={<AICoach />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/community" element={<Community />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-center" richColors />
      </BrowserRouter>
    </QueryClientProvider>
  );
}