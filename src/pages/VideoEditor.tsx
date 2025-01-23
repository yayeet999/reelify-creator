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
import { thumbnails, beautyThumbnails, lifestyleThumbnails, customThumbnails } from "@/components/video-editor/data/thumbnailData";
import { Slider } from "@/components/ui/slider";

const VideoEditor = () => {
  const defaultVideo = thumbnails[0]?.videoUrl;
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>(defaultVideo);
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
    <div className="container mx-auto px-4 py-6 max-w-6xl animate-fade-up">
      <div className="space-y-6">
        {/* Header Section - More Compact */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight text-primary">
              Video Editor
            </h1>
          </div>
          <p className="text-base text-muted-foreground">
            Create stunning videos by selecting templates and customizing them with your text
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Side - Preview Area (Smaller) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 shadow-sm bg-slate-50">
              <div className="relative w-full">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-100/50 to-slate-100/30 rounded-lg" />
                <div className="relative mx-auto w-full max-w-[280px]">
                  <div className="aspect-[9/16] relative rounded-lg overflow-hidden ring-1 ring-black/5">
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
                  </div>
                </div>
              </div>
            </Card>

            {/* Upload Section - Below Preview */}
            {isTemplateSelected && (
              <Card className="p-4 shadow-sm">
                <h2 className="text-lg font-semibold mb-3">Upload Your Video</h2>
                <VideoUpload onVideoSelect={handleVideoUpload} />
              </Card>
            )}
          </div>

          {/* Right Side - Templates and Controls (Wider) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Template Selection - Always visible but shows only selected template when proceeded */}
            <Card className="p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">
                  {isTemplateSelected ? "Selected Template" : "Select Template"}
                </h2>
              </div>
              
              {isTemplateSelected && selectedVideoUrl ? (
                <div className="grid grid-cols-1 gap-4">
                  <div className="aspect-square relative rounded-lg overflow-hidden w-[60px] mx-auto">
                    <img
                      src={[...thumbnails, ...beautyThumbnails, ...lifestyleThumbnails, ...customThumbnails]
                        .find(t => t.videoUrl === selectedVideoUrl)?.thumbnailUrl || ''}
                      alt="Selected template"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black/10 rounded-lg" />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleGoBackToTemplates}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Change Template
                  </Button>
                </div>
              ) : (
                <>
                  <VideoThumbnailGrid 
                    currentVideoUrl={selectedVideoUrl}
                    onVideoSelect={setSelectedVideoUrl}
                  />
                  {selectedVideoUrl && (
                    <Button
                      className="w-full mt-4 bg-primary hover:bg-primary/90"
                      onClick={handleProceedWithTemplate}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Proceed with Template
                    </Button>
                  )}
                </>
              )}
            </Card>

            {/* Customization Controls */}
            <Card className="p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Customize</h2>
              <div className="space-y-6">
                {/* Text Input and Font Size */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-1.5">Text</Label>
                    <Input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full"
                      placeholder="Enter your text..."
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <Label className="text-sm font-medium">Font Size</Label>
                      <span className="text-sm text-muted-foreground">{textSize}px</span>
                    </div>
                    <Slider
                      value={[textSize]}
                      onValueChange={([value]) => setTextSize(value)}
                      min={12}
                      max={72}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Style Controls */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column - Position */}
                  <div>
                    <Label className="text-sm font-medium mb-2">Position</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <Button
                        type="button"
                        variant={textPosition === "top" ? "default" : "outline"}
                        className="w-full h-12 flex items-center justify-center gap-2"
                        onClick={() => setTextPosition("top")}
                      >
                        Top
                      </Button>
                      <Button
                        type="button"
                        variant={textPosition === "middle" ? "default" : "outline"}
                        className="w-full h-12 flex items-center justify-center gap-2"
                        onClick={() => setTextPosition("middle")}
                      >
                        Middle
                      </Button>
                      <Button
                        type="button"
                        variant={textPosition === "bottom" ? "default" : "outline"}
                        className="w-full h-12 flex items-center justify-center gap-2"
                        onClick={() => setTextPosition("bottom")}
                      >
                        Bottom
                      </Button>
                    </div>
                  </div>
                  {/* Right Column - Animation and Color */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium mb-2">Animation</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={textAnimation === "none" ? "default" : "outline"}
                          className="w-full h-12 flex items-center justify-center"
                          onClick={() => setTextAnimation("none")}
                        >
                          None
                        </Button>
                        <Button
                          type="button"
                          variant={textAnimation === "fade" ? "default" : "outline"}
                          className="w-full h-12 flex items-center justify-center"
                          onClick={() => setTextAnimation("fade")}
                        >
                          Fade
                        </Button>
                        <Button
                          type="button"
                          variant={textAnimation === "slide" ? "default" : "outline"}
                          className="w-full h-12 flex items-center justify-center"
                          onClick={() => setTextAnimation("slide")}
                        >
                          Slide
                        </Button>
                        <Button
                          type="button"
                          variant={textAnimation === "scale" ? "default" : "outline"}
                          className="w-full h-12 flex items-center justify-center"
                          onClick={() => setTextAnimation("scale")}
                        >
                          Scale
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium mb-2">Text Color</Label>
                      <ColorPicker color={textColor} onChange={setTextColor} showPreview={false} />
                    </div>
                  </div>
                </div>

                {/* Timeline Control */}
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-2">Timeline</Label>
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

            {/* Download Button */}
            <Card className="p-4 shadow-sm">
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoEditor;