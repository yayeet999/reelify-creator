import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Video, Type } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Cloudinary } from "@cloudinary/url-gen";

const CreateContent = () => {
  const [textOverlay, setTextOverlay] = useState("");
  const [textSize, setTextSize] = useState([16]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const { toast } = useToast();

  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'fornotreel'
    }
  });

  // Generate the base video URL (without transformations)
  const baseVideoUrl = "https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";

  // Function to generate Cloudinary URL with transformations
  const generateCloudinaryUrl = () => {
    let url = "https://res.cloudinary.com/fornotreel/video/upload";
    
    // Add quality auto transformation
    url += "/q_auto:good";
    
    // Add text overlay if provided
    if (textOverlay) {
      const encodedText = encodeURIComponent(textOverlay);
      const colorHex = textColor.replace('#', '');
      url += `/l_text:Arial_${textSize[0]}:${encodedText},co_rgb:${colorHex}`;
    }
    
    // Add the video ID at the end
    url += "/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";
    
    return url;
  };

  // Handle save with text overlay
  const handleSaveWithText = () => {
    const transformedUrl = generateCloudinaryUrl();
    // Copy to clipboard
    navigator.clipboard.writeText(transformedUrl).then(() => {
      toast({
        title: "URL Copied!",
        description: "The video URL with text overlay has been copied to your clipboard.",
      });
    }).catch(() => {
      toast({
        title: "Error",
        description: "Failed to copy URL to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="container mx-auto p-6 animate-fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Create Content</h1>
        <p className="text-muted-foreground mt-1">
          Create and customize your short-form video content
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Video Preview Area */}
        <Card className="xl:col-span-1 bg-accent-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <span>Video Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
              <video 
                className="w-full h-full rounded-lg object-cover"
                controls
                src={baseVideoUrl}
                loop
              />
              {textOverlay && (
                <div 
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4"
                  style={{
                    color: textColor,
                    fontSize: `${textSize[0]}px`,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                  }}
                >
                  {textOverlay}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Configuration */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Text Overlay Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Text Overlay</Label>
              <Textarea
                placeholder="Add text overlay to your video"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Text Size: {textSize}px</Label>
              <Slider
                value={textSize}
                onValueChange={setTextSize}
                min={12}
                max={72}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <Label>Text Color</Label>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-20 h-10 p-1"
                />
                <Input
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  placeholder="#FFFFFF"
                  className="flex-1"
                />
              </div>
            </div>

            <Button 
              className="w-full mt-4"
              onClick={handleSaveWithText}
            >
              Save with Text Overlay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;