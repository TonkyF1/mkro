import { useState, useEffect, useRef } from 'react';
import { X, Loader2, ScanBarcode } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';
import { Html5Qrcode } from 'html5-qrcode';

interface BarcodeScannerProps {
  onFoodScanned: (foodData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }) => void;
  onClose: () => void;
}

export const BarcodeScanner = ({ onFoodScanned, onClose }: BarcodeScannerProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  const startScanner = async () => {
    try {
      setIsScanning(true);
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        onScanSuccess,
        onScanFailure
      );
    } catch (error) {
      console.error('Error starting scanner:', error);
      toast({
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  };

  const onScanSuccess = async (decodedText: string) => {
    console.log('Barcode detected:', decodedText);
    setIsLoading(true);
    await stopScanner();

    try {
      // Query Open Food Facts API
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${decodedText}.json`
      );

      if (!response.ok) {
        throw new Error('Product not found');
      }

      const data = await response.json();

      if (data.status !== 1 || !data.product) {
        throw new Error('Product not found in database');
      }

      const product = data.product;
      const nutriments = product.nutriments || {};

      // Extract nutritional values per 100g
      const foodData = {
        name: product.product_name || 'Unknown Product',
        calories: Math.round(nutriments['energy-kcal_100g'] || 0),
        protein: Math.round(nutriments.proteins_100g || 0),
        carbs: Math.round(nutriments.carbohydrates_100g || 0),
        fats: Math.round(nutriments.fat_100g || 0),
      };

      toast({
        title: "Product found!",
        description: `${foodData.name} - Nutritional values per 100g`,
      });

      onFoodScanned(foodData);
      onClose();
    } catch (error) {
      console.error('Error looking up product:', error);
      toast({
        title: "Product not found",
        description: "Could not find nutritional information for this barcode. Try manual entry.",
        variant: "destructive",
      });
      setIsLoading(false);
      startScanner(); // Restart scanner to try again
    }
  };

  const onScanFailure = (error: string) => {
    // Silent fail - we don't want to spam the console with every frame
  };

  return (
    <Card className="p-6 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={onClose}
        disabled={isLoading}
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ScanBarcode className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Scan Barcode</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {isLoading ? 'Looking up product...' : 'Position the barcode in the center'}
          </p>
        </div>

        <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-black">
          <div id="barcode-reader" className="w-full h-full" />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        <p className="text-xs text-center text-muted-foreground">
          Uses Open Food Facts database for nutritional information
        </p>
      </div>
    </Card>
  );
};