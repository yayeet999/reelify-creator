import { useState, useRef } from "react";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector } from "@/components/video-editor/TextAnimationSelector";
import { TextPresets } from "@/components/video-editor/TextPresets";
import { ColorPicker } from "@/components/video-editor/ColorPicker";
import { DownloadButton } from "@/components/video-editor/DownloadButton";
import { VideoUpload } from "@/components/video-editor/VideoUpload";
import { TimelineControl } from "@/components/video-editor/TimelineControl";
import { CombinedVideoPreview } from "@/components/video-editor/CombinedVideoPreview";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const VideoEditor = () => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>();
  const [textPosition, setTextPosition] = useState<"top" | "middle" | "bottom">("middle");
  const [textAnimation, setTextAnimation] = useState<"none" | "fade" | "slide" | "scale">("none");
  const [text, setText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [backgroundColor, setBackgroundColor] = useState<string>("#000000E6");
  const [textSize, setTextSize] = useState<number>(32);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>();
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(30);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleProceedWithTemplate = () => {
    if (!selectedVideoUrl) return;
    setIsTemplateSelected(true);
  };

  const handleGoBackToTemplates = () => {
    setIsTemplateSelected(false);
    setUploadedVideoUrl(undefined);
  };

  const handleVideoUpload = (cloudinaryUrl: string) => {
    setUploadedVideoUrl(cloudinaryUrl);
  };

  const handlePresetSelect = (textColor: string, bgColor: string) => {
    setTextColor(textColor);
    setBackgroundColor(bgColor);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Video Editor
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Create stunning videos by selecting templates and customizing them with your text
          </p>
        </div>

        {isTemplateSelected && (
          <Button
            variant="outline"
            onClick={handleGoBackToTemplates}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Templates
          </Button>
        )}

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column */}
          <div className="space-y-8 lg:col-span-8">
            {!isTemplateSelected ? (
              <Card className="p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  1. Select Template Video
                </h2>
                <VideoThumbnailGrid 
                  currentVideoUrl={selectedVideoUrl}
                  onVideoSelect={setSelectedVideoUrl}
                />
                {selectedVideoUrl && (
                  <Button
                    className="w-full mt-4 bg-primary hover:bg-primary/90"
                    size="lg"
                    onClick={handleProceedWithTemplate}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Proceed with Template
                  </Button>
                )}
              </Card>
            ) : (
              <Card className="p-6 shadow-md">
                <h2 className="text-2xl font-semibold mb-4">2. Upload Your Video</h2>
                <VideoUpload onVideoSelect={handleVideoUpload} />
              </Card>
            )}

            {/* Text Customization */}
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                {isTemplateSelected ? "3." : "2."} Customize Text
              </h2>
              <div className="space-y-6">
                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Enter Custom Text
                  </Label>
                  <Input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full"
                    placeholder="Enter your text here..."
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Text Presets
                  </Label>
                  <TextPresets onSelect={handlePresetSelect} />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Text Color
                  </Label>
                  <ColorPicker
                    color={textColor}
                    onChange={setTextColor}
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Text Size
                  </Label>
                  <Input
                    type="number"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    min={12}
                    max={72}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Text Position
                  </Label>
                  <TextPositionSelector 
                    position={textPosition}
                    onChange={setTextPosition}
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Text Animation
                  </Label>
                  <TextAnimationSelector
                    animation={textAnimation}
                    onChange={setTextAnimation}
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium mb-2">
                    Timeline Control
                  </Label>
                  <TimelineControl
                    videoRef={videoRef}
                    startTime={startTime}
                    duration={duration}
                    videoDuration={30}
                    onStartTimeChange={setStartTime}
                    onDurationChange={setDuration}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Preview and Download */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">
                {isTemplateSelected ? "4." : "3."} Preview & Download
              </h2>
              <div className="space-y-6">
                {isTemplateSelected ? (
                  <CombinedVideoPreview
                    templateVideoUrl={selectedVideoUrl}
                    uploadedVideoUrl={uploadedVideoUrl}
                    text={text}
                    textColor={textColor}
                    textSize={textSize}
                    position={textPosition}
                    animation={textAnimation}
                  />
                ) : (
                  <VideoPreview
                    videoRef={videoRef}
                    videoUrl={selectedVideoUrl || ""}
                    text={text}
                    textColor={textColor}
                    textSize={textSize}
                    position={textPosition}
                    animation={textAnimation}
                  />
                )}
                <DownloadButton
                  templateVideoUrl={selectedVideoUrl}
                  backgroundVideoUrl={uploadedVideoUrl}
                  textOverlay={text}
                  textColor={textColor}
                  textSize={textSize}
                  textPosition={textPosition}
                  animation={textAnimation}
                  startTime={startTime}
                  duration={duration}
                  disabled={!selectedVideoUrl || (isTemplateSelected && !uploadedVideoUrl)}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;