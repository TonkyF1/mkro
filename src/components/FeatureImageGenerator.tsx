import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { featureImagePrompts, generateFeatureImage, downloadBase64Image } from '@/utils/generateFeatureImages';
import { Loader2, Image, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export const FeatureImageGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const handleGenerateAll = async () => {
    setIsGenerating(true);
    const newImages: { [key: string]: string } = {};
    
    try {
      toast({
        title: "Generating images",
        description: "This will take a few moments...",
      });

      for (const imagePrompt of featureImagePrompts) {
        try {
          const imageUrl = await generateFeatureImage(imagePrompt);
          newImages[imagePrompt.filename] = imageUrl;
          
          toast({
            title: `Generated ${imagePrompt.name}`,
            description: "Image ready for download",
          });
          
          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`Failed to generate ${imagePrompt.name}:`, error);
          toast({
            title: `Failed: ${imagePrompt.name}`,
            description: "Could not generate this image",
            variant: "destructive",
          });
        }
      }
      
      setGeneratedImages(newImages);
      
      toast({
        title: "All images generated!",
        description: "Click download on each image to save them",
      });
      
    } catch (error) {
      console.error('Error during image generation:', error);
      toast({
        title: "Error",
        description: "Failed to generate images",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Feature Image Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleGenerateAll} 
            disabled={isGenerating}
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
                Generate All Feature Images
              </>
            )}
          </Button>

          {Object.keys(generatedImages).length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
              {Object.entries(generatedImages).map(([filename, imageUrl]) => (
                <div key={filename} className="space-y-2">
                  <img 
                    src={imageUrl} 
                    alt={filename}
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => downloadBase64Image(imageUrl, filename)}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {filename}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
