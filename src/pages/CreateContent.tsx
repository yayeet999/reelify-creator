import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Video, Type } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Cloudinary } from "@cloudinary/url-gen";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector, type AnimationType } from "@/components/video-editor/TextAnimationSelector";
import { TimelineControl } from "@/components/video-editor/TimelineControl";
import { VideoPreview } from "@/components/video-editor/VideoPreview";

const CreateContent = () => {
  const [textOverlay, setTextOverlay] = useState("");
  const [textSize, setTextSize] = useState([16]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textPosition, setTextPosition] = useState<"top" | "middle" | "bottom">("middle");
  const [animation, setAnimation] = useState<AnimationType>("none");
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const { toast } = useToast();

  const VIDEO_DURATION = 30; // Set this to your actual video duration
  const baseVideoUrl = "https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";

  // Function to get Cloudinary position parameter
  const getCloudinaryPosition = () => {
    switch (textPosition) {
      case "top":
        return "g_north,y_50";
      case "middle":
        return "g_center";
      case "bottom":
        return "g_south,y_50";
    }
  };

  // Function to get Cloudinary animation parameters
  const getCloudinaryAnimation = () => {
    switch (animation) {
      case "none":
        return "";
      case "fade":
        return "e_fade:2000";
    }
  };

  // Function to calculate the scaled font size for Cloudinary
  const getCloudinaryFontSize = () => {
    const ACTUAL_VIDEO_WIDTH = 1080;
    const PREVIEW_WIDTH = 240;
    const SCALE_FACTOR = ACTUAL_VIDEO_WIDTH / PREVIEW_WIDTH;
    const FINE_TUNE_FACTOR = 0.8;
    return Math.round(textSize[0] * SCALE_FACTOR * FINE_TUNE_FACTOR);
  };

  // Function to generate Cloudinary URL with transformations
  const generateCloudinaryUrl = () => {
    if (!textOverlay) return baseVideoUrl;

    let url = "https://res.cloudinary.com/fornotreel/video/upload";
    url += "/q_auto:good";

    if (textOverlay) {
      const encodedText = encodeURIComponent(textOverlay);
      const colorHex = textColor.replace('#', '');
      const cloudinaryFontSize = getCloudinaryFontSize();
      const position = getCloudinaryPosition();
      const animation = getCloudinaryAnimation();
      
      url += `/l_text:Roboto_${cloudinaryFontSize}:${encodedText},co_rgb:${colorHex},${position}`;
      if (animation) url += `,${animation}`;
      if (startTime > 0) url += `,so_${startTime}`;
      url += `,dl_${duration}`;
    }

    url += "/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";
    return url;
  };

  // Handle download with text overlay
  const handleDownloadWithText = async () => {
    try {
      const transformedUrl = generateCloudinaryUrl();
      
      toast({
        title: "Downloading...",
        description: "Preparing your video for download.",
      });

      const response = await fetch(transformedUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `video-with-text-${timestamp}.mp4`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download Complete!",
        description: "Your video has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your video. Please try again.",
        variant: "destructive",
      });
    }
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
            <VideoPreview
              videoUrl={baseVideoUrl}
              text={textOverlay}
              textColor={textColor}
              textSize={textSize[0]}
              position={textPosition}
              animation={animation}
            />
          </CardContent>
        </Card>

        {/* Content Configuration */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Text Overlay Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Text Overlay</Label>
              <Textarea
                placeholder="Add text overlay to your video"
                value={textOverlay}
                onChange={(e) => setTextOverlay(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Text Position</Label>
              <TextPositionSelector
                position={textPosition}
                onChange={setTextPosition}
              />
            </div>

            <div className="space-y-2">
              <Label>Animation</Label>
              <TextAnimationSelector
                animation={animation}
                onChange={setAnimation}
              />
            </div>

            <div className="space-y-2">
              <Label>Timing</Label>
              <TimelineControl
                startTime={startTime}
                duration={duration}
                videoDuration={VIDEO_DURATION}
                onStartTimeChange={setStartTime}
                onDurationChange={setDuration}
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
              onClick={handleDownloadWithText}
            >
              Download with Text Overlay
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;
