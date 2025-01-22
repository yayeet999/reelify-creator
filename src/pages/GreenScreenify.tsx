import { FeatureGate } from "@/components/FeatureGate";
import { FEATURES } from "@/config/features";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector } from "@/components/video-editor/TextAnimationSelector";
import { ColorPicker } from "@/components/video-editor/ColorPicker";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function GreenScreenify() {
  const [videoUrl, setVideoUrl] = useState("");
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(32);
  const [position, setPosition] = useState("middle");
  const [animation, setAnimation] = useState("none");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
    }
  };

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your video is being processed...",
    });
    // Export logic will be implemented here
  };

  return (
    <FeatureGate requiredTier={FEATURES.GREEN_SCREENIFY.requiredTier}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Green Screenify</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="video-upload">Upload Video</Label>
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="text-overlay">Text Overlay</Label>
              <Input
                id="text-overlay"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text overlay"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Text Color</Label>
              <ColorPicker color={textColor} onChange={setTextColor} />
            </div>

            <div>
              <Label>Text Size</Label>
              <Slider
                value={[textSize]}
                onValueChange={(value) => setTextSize(value[0])}
                min={16}
                max={72}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Text Position</Label>
              <TextPositionSelector
                position={position}
                onChange={setPosition}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Text Animation</Label>
              <TextAnimationSelector
                animation={animation}
                onChange={setAnimation}
                className="mt-2"
              />
            </div>

            <Button onClick={handleExport} className="w-full">
              Export Video
            </Button>
          </div>

          <div className="flex items-center justify-center bg-black/5 rounded-lg p-4">
            {videoUrl ? (
              <VideoPreview
                videoUrl={videoUrl}
                text={text}
                textColor={textColor}
                textSize={textSize}
                position={position}
                animation={animation}
                videoRef={videoRef}
              />
            ) : (
              <div className="text-center text-muted-foreground">
                <p>Upload a video to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </FeatureGate>
  );
}