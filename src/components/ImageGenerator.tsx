import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { generateMissingRecipeImages, GeneratedImage } from '@/utils/imageGenerator';
import { Loader2, Image } from 'lucide-react';

interface ImageGeneratorProps {
  onImagesGenerated: (images: GeneratedImage[]) => void;
}

export const ImageGenerator = ({ onImagesGenerated }: ImageGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleGenerateImages = async () => {
    setIsGenerating(true);
    
    try {
      const results = await generateMissingRecipeImages();
      
      toast({
        title: "Image generation complete!",
        description: `Successfully generated ${results.success} images. ${results.failed.length > 0 ? `Failed: ${results.failed.length}` : ''}`,
      });
      
      if (results.failed.length > 0) {
        console.warn('Failed to generate images for:', results.failed);
      }
      
      // Pass the generated images to the parent component
      onImagesGenerated(results.generatedImages);
      
    } catch (error) {
      console.error('Error during image generation:', error);
      toast({
        title: "Error",
        description: "Failed to generate images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      onClick={handleGenerateImages} 
      disabled={isGenerating}
      variant="outline"
      className="w-full"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating Images...
        </>
      ) : (
        <>
          <Image className="h-4 w-4 mr-2" />
          Generate Missing Recipe Images
        </>
      )}
    </Button>
  );
};