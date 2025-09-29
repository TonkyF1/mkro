import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Recipes from "./pages/Recipes";
import Planner from "./pages/Planner";
import Shopping from "./pages/Shopping";
import Profile from "./pages/Profile";
import Coach from "./pages/Coach";
import Exercise from "./pages/Exercise";
import FoodDiaryPage from "./pages/FoodDiaryPage";
import Auth from "./pages/Auth";
import Questionnaire from "./pages/Questionnaire";
import NotFound from "./pages/NotFound";
import LoadingScreen from "./components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
            <Route element={<MainLayout />}>
              <Route path="/" element={<Recipes />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/exercise" element={<Exercise />} />
              <Route path="/food-diary" element={<FoodDiaryPage />} />
              <Route path="/coach" element={<Coach />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
