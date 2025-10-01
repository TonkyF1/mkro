import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import Shopping from "./pages/Shopping";
import Profile from "./pages/Profile";
import Coach from "./pages/Coach";
import Exercise from "./pages/Exercise";
import NutritionHub from "./pages/NutritionHub";
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
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/questionnaire" element={<Questionnaire />} />
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/nutrition" element={<NutritionHub />} />
                <Route path="/shopping" element={<Shopping />} />
                <Route path="/exercise" element={<Exercise />} />
                <Route path="/coach" element={<Coach />} />
                <Route path="/profile" element={<Profile />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
