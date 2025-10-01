import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, X, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FoodScannerProps {
  onFoodScanned: (foodData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => void;
  onClose: () => void;
}

interface ScannedData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: string;
}

export const FoodScanner = ({ onFoodScanned, onClose }: FoodScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [scannedData, setScannedData] = useState<ScannedData | null>(null);
  const [editedData, setEditedData] = useState<ScannedData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = async (file: File) => {
    try {
      setIsScanning(true);

      // Read file once and use for both preview and API
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);

        try {
          const { data, error } = await supabase.functions.invoke('scan-food', {
            body: { imageBase64: base64String }
          });

          if (error) {
            throw error;
          }

          if (!data || !data.name) {
            throw new Error('Invalid response from food scanner');
          }

          const foodData: ScannedData = {
            name: data.name,
            calories: Math.round(data.calories),
            protein: Math.round(data.protein),
            carbs: Math.round(data.carbs),
            fats: Math.round(data.fats),
            confidence: data.confidence,
          };

          setScannedData(foodData);
          setEditedData(foodData);

          toast({
            title: "Food identified!",
            description: `Found: ${data.name} (${data.confidence} confidence). Please review the values.`,
          });
        } catch (scanError) {
          console.error('Scan error:', scanError);
          toast({
            title: "Scan failed",
            description: scanError instanceof Error ? scanError.message : "Could not identify the food. Please try again.",
            variant: "destructive",
          });
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      processImage(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleConfirm = () => {
    if (editedData) {
      onFoodScanned(editedData);
      onClose();
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setEditedData(null);
    setPreviewImage(null);
  };

  return (
    <Card className="p-6 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">
            {scannedData ? 'Review & Edit' : 'Scan Your Food'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {scannedData 
              ? 'Verify the detected values and edit if needed'
              : 'Take a photo or upload an image to identify food and log nutrition'}
          </p>
        </div>

        {previewImage && (
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
            <img
              src={previewImage}
              alt="Food preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {scannedData && editedData ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Food Name</Label>
              <Input
                id="name"
                value={editedData.name}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calories">Calories</Label>
                <Input
                  id="calories"
                  type="number"
                  value={editedData.calories}
                  onChange={(e) => setEditedData({ ...editedData, calories: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  value={editedData.protein}
                  onChange={(e) => setEditedData({ ...editedData, protein: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  value={editedData.carbs}
                  onChange={(e) => setEditedData({ ...editedData, carbs: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fats">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  value={editedData.fats}
                  onChange={(e) => setEditedData({ ...editedData, fats: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleConfirm} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Confirm & Log
              </Button>
              <Button onClick={handleReset} variant="outline">
                Scan Again
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              AI confidence: {scannedData.confidence}
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                onClick={handleCameraCapture}
                disabled={isScanning}
                className="flex-1"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Scanning...
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </>
                )}
              </Button>

              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={isScanning}
                variant="outline"
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              AI will estimate nutritional values for a typical serving
            </p>
          </>
        )}
      </div>
    </Card>
  );
};
