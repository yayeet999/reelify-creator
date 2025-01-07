import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Video, Type } from "lucide-react";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector, type AnimationType } from "@/components/video-editor/TextAnimationSelector";
import { TimelineControl } from "@/components/video-editor/TimelineControl";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { VideoDownloader } from "@/components/video-editor/VideoDownloader";
import { TextPresets } from "@/components/video-editor/TextPresets";

const CreateContent = () => {
  const [textOverlay, setTextOverlay] = useState("");
  const [textSize, setTextSize] = useState([16]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState("#000000E6");
  const [textPosition, setTextPosition] = useState<"top" | "middle" | "bottom">("middle");
  const [animation, setAnimation] = useState<AnimationType>("none");
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);

  const VIDEO_DURATION = 30;
  const baseVideoUrl = "https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";

  const handlePresetSelect = (newTextColor: string, newBackgroundColor: string) => {
    setTextColor(newTextColor);
    setBackgroundColor(newBackgroundColor);
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
              backgroundColor={backgroundColor}
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
              <Label>Color Presets</Label>
              <TextPresets onSelect={handlePresetSelect} />
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
              <Label>Colors</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs">Text Color</Label>
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
                <div className="space-y-2">
                  <Label className="text-xs">Background Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-20 h-10 p-1"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#000000E6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            <VideoDownloader 
              textOverlay={textOverlay}
              textColor={textColor}
              backgroundColor={backgroundColor}
              textSize={textSize[0]}
              textPosition={textPosition}
              animation={animation}
              startTime={startTime}
              duration={duration}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;