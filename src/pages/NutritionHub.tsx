import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodDiary from '@/components/FoodDiary';
import { HydrationTracker } from '@/components/HydrationTracker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NutritionHub = () => {

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      <div>
        <h1 className="text-4xl font-bold mb-2">Nutrition Hub</h1>
        <p className="text-muted-foreground">Track your meals, macros, and hydration</p>
      </div>

      <Tabs defaultValue="diary" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="diary">Diary</TabsTrigger>
          <TabsTrigger value="planner">Planner</TabsTrigger>
          <TabsTrigger value="water">Water</TabsTrigger>
        </TabsList>

        <TabsContent value="diary" className="space-y-6">
          <FoodDiary />
        </TabsContent>

        <TabsContent value="planner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>7-Day Meal Planner</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Planner coming soon - generate with AI Coach</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="water" className="space-y-6">
          <HydrationTracker />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NutritionHub;
