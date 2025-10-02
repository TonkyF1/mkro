import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserProfile, GOALS } from '@/types/profile';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface MacroGoalEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
}

export const MacroGoalEditor = ({ open, onOpenChange, profile }: MacroGoalEditorProps) => {
  const { saveProfile } = useUserProfile();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    goal: profile.goal || '',
    target_protein: profile.target_protein || 0,
    target_carbs: profile.target_carbs || 0,
    target_fats: profile.target_fats || 0,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await saveProfile({
        ...profile,
        goal: formData.goal as any,
        target_protein: formData.target_protein,
        target_carbs: formData.target_carbs,
        target_fats: formData.target_fats,
      });
      toast({
        title: 'Success',
        description: 'Your macros and goals have been updated!',
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving macros:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update macros. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Macros & Goals</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Goal Selection */}
          <div>
            <Label htmlFor="goal">Primary Goal</Label>
            <Select
              value={formData.goal}
              onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your goal" />
              </SelectTrigger>
              <SelectContent>
                {GOALS.map((goal) => (
                  <SelectItem key={goal.value} value={goal.value}>
                    {goal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Macros */}
          <div className="space-y-3 pt-2 border-t">
            <h4 className="font-semibold text-sm">Daily Macro Targets</h4>
            
            <div>
              <Label htmlFor="protein" className="text-blue-600">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                value={formData.target_protein}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  target_protein: parseInt(e.target.value) || 0 
                }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="carbs" className="text-green-600">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                value={formData.target_carbs}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  target_carbs: parseInt(e.target.value) || 0 
                }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="fats" className="text-orange-600">Fats (g)</Label>
              <Input
                id="fats"
                type="number"
                min="0"
                value={formData.target_fats}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  target_fats: parseInt(e.target.value) || 0 
                }))}
                className="mt-1"
              />
            </div>

            {/* Calorie Preview */}
            <div className="pt-2 border-t text-sm text-muted-foreground">
              <p>
                Estimated Daily Calories: <span className="font-bold text-foreground">
                  {(formData.target_protein * 4) + (formData.target_carbs * 4) + (formData.target_fats * 9)} kcal
                </span>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};