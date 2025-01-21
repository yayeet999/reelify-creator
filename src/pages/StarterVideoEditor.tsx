import { useState } from "react";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector } from "@/components/video-editor/TextAnimationSelector";
import { FreeVideoDownloader } from "@/components/video-editor/FreeVideoDownloader";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const StarterVideoEditor = () => {
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string>();
  const [textPosition, setTextPosition] = useState<"top" | "middle" | "bottom">("middle");
  const [textAnimation, setTextAnimation] = useState<"none" | "fade">("none");
  const [customText, setCustomText] = useState<string>("");

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

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column - Template Selection */}
          <div className="space-y-8 lg:col-span-8">
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                1. Select Template Video
              </h2>
              <VideoThumbnailGrid 
                currentVideoUrl={selectedVideoUrl}
                onVideoSelect={setSelectedVideoUrl}
              />
            </Card>

            {/* Text Customization */}
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">2. Customize Text</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Custom Text
                  </label>
                  <input
                    type="text"
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your text here..."
                  />
                </div>
                <TextPositionSelector 
                  position={textPosition}
                  onPositionChange={setTextPosition}
                />
                <TextAnimationSelector
                  animation={textAnimation}
                  onAnimationChange={setTextAnimation}
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Preview and Download */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">3. Preview & Download</h2>
              <div className="space-y-6">
                <VideoPreview
                  videoUrl={selectedVideoUrl}
                  customText={customText}
                  textPosition={textPosition}
                  textAnimation={textAnimation}
                />
                <FreeVideoDownloader
                  disabled={!selectedVideoUrl}
                  videoUrl={selectedVideoUrl}
                  customText={customText}
                  textPosition={textPosition}
                  textAnimation={textAnimation}
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