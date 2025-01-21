import { useState } from "react";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector } from "@/components/video-editor/TextAnimationSelector";
import { FreeVideoDownloader } from "@/components/video-editor/FreeVideoDownloader";
import { VideoUpload } from "@/components/video-editor/VideoUpload";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";

const StarterVideoEditor = () => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>();
  const [textPosition, setTextPosition] = useState<"top" | "middle" | "bottom">("middle");
  const [textAnimation, setTextAnimation] = useState<"none" | "fade">("none");
  const [text, setText] = useState<string>("");
  const [textColor, setTextColor] = useState<string>("#FFFFFF");
  const [textSize, setTextSize] = useState<number>(32);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);

  const handleProceedWithTemplate = () => {
    setIsTemplateSelected(true);
  };

  const handleGoBackToTemplates = () => {
    setIsTemplateSelected(false);
    setUploadedVideo(null);
  };

  const handleVideoUpload = (file: File) => {
    setUploadedVideo(file);
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
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
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
          {/* Left Column - Template Selection */}
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
                    Text Color
                  </Label>
                  <Input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-full h-10"
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
                <VideoPreview
                  videoUrl={selectedVideoUrl || ""}
                  text={text}
                  textColor={textColor}
                  textSize={textSize}
                  position={textPosition}
                  animation={textAnimation}
                />
                <FreeVideoDownloader
                  textOverlay={text}
                  textColor={textColor}
                  textSize={textSize}
                  textPosition={textPosition}
                  animation={textAnimation}
                  startTime={0}
                  duration={0}
                  currentVideoUrl={selectedVideoUrl || ""}
                  isTemplateSelected={isTemplateSelected}
                  onProceedWithTemplate={handleProceedWithTemplate}
                  onGoBackToTemplates={handleGoBackToTemplates}
                  hasUploadedVideo={!!uploadedVideo}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarterVideoEditor;