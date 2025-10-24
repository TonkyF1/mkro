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
import Diary from '@/pages/Diary';
import Gym from '@/pages/Gym';
import AICoach from '@/pages/AICoach';
import Stats from '@/pages/Stats';
import Profile from '@/pages/Profile';
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
        <Route path="/food" element={<Recipes />} />
        <Route path="/diary" element={<Diary />} />
        <Route path="/gym" element={<Gym />} />
        <Route path="/coach" element={<AICoach />} />
        <Route path="/stats" element={<Stats />} />
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