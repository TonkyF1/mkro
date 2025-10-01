import { useState, useRef } from 'react';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
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

export const FoodScanner = ({ onFoodScanned, onClose }: FoodScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processImage = async (file: File) => {
    try {
      setIsScanning(true);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Convert to base64 for API
      const base64Reader = new FileReader();
      base64Reader.onloadend = async () => {
        const base64String = base64Reader.result as string;

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

          toast({
            title: "Food identified!",
            description: `Found: ${data.name} (${data.confidence} confidence)`,
          });

          // Pass the data to parent component
          onFoodScanned({
            name: data.name,
            calories: Math.round(data.calories),
            protein: Math.round(data.protein),
            carbs: Math.round(data.carbs),
            fats: Math.round(data.fats),
          });

          onClose();
        } catch (scanError) {
          console.error('Scan error:', scanError);
          toast({
            title: "Scan failed",
            description: scanError instanceof Error ? scanError.message : "Could not identify the food. Please try again.",
            variant: "destructive",
          });
        }
      };
      base64Reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error",
        description: "Failed to process image. Please try again.",
        variant: "destructive",
      });
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
          <h3 className="text-lg font-semibold mb-2">Scan Your Food</h3>
          <p className="text-sm text-muted-foreground">
            Take a photo or upload an image to identify food and log nutrition
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
      </div>
    </Card>
  );
};
