import { useState } from "react";
import { VideoGallery } from "@/components/green-screenify/VideoGallery";
import { VideoUploader } from "@/components/green-screenify/VideoUploader";
import { VoiceSelector } from "@/components/green-screenify/VoiceSelector";
import { CombinedPreview } from "@/components/green-screenify/CombinedPreview";
import { DownloadButton } from "@/components/green-screenify/DownloadButton";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const StarterGreenScreenify = () => {
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState<string>();
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState<string>();
  const [audioUrl, setAudioUrl] = useState<string>();

  const handleAudioGenerated = (url: string) => {
    console.log("StarterGreenScreenify - Audio URL generated:", url);
    setAudioUrl(url);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-8 border border-primary/20">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-4xl font-bold tracking-tight text-primary">
              Green Screenify
            </h1>
            <Sparkles className="h-6 w-6 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-muted-foreground">
            Create stunning videos by combining transparent templates with your custom backgrounds and AI-generated voices
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Column - Template and Upload */}
          <div className="space-y-8 lg:col-span-8">
            {/* Template Selection */}
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                1. Select Template Video
              </h2>
              <VideoGallery 
                onSelectVideo={(video) => setSelectedTemplateUrl(video.videoUrl)} 
              />
            </Card>

            {/* Background Upload */}
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                2. Upload Background Video
              </h2>
              <VideoUploader onVideoSelect={setBackgroundVideoUrl} />
            </Card>

            {/* Voice Generation */}
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                3. Generate Custom Voice (Optional)
              </h2>
              <VoiceSelector onAudioGenerated={handleAudioGenerated} />
            </Card>
          </div>

          {/* Right Column - Preview and Download */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                4. Preview & Download
              </h2>
              <div className="space-y-6">
                <CombinedPreview 
                  templateVideoUrl={selectedTemplateUrl}
                  backgroundVideoUrl={backgroundVideoUrl}
                />
                <DownloadButton 
                  disabled={!selectedTemplateUrl || !backgroundVideoUrl}
                  templateVideoUrl={selectedTemplateUrl}
                  backgroundVideoUrl={backgroundVideoUrl}
                  audioUrl={audioUrl}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StarterGreenScreenify;