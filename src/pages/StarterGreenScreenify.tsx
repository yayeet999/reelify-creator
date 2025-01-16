import { useState } from "react";
import { VideoGallery } from "@/components/green-screenify/VideoGallery";
import { VideoUploader } from "@/components/green-screenify/VideoUploader";
import { CombinedPreview } from "@/components/green-screenify/CombinedPreview";

const StarterGreenScreenify = () => {
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState<string>();
  const [backgroundVideoUrl, setBackgroundVideoUrl] = useState<string>();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="space-y-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Green Screenify
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Combine transparent template videos with your own background videos
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Template Video Selection */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Select Template Video</h2>
            <VideoGallery 
              onSelectVideo={(video) => setSelectedTemplateUrl(video.videoUrl)} 
            />
          </div>

          {/* Background Video Upload */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Upload Background Video</h2>
            <VideoUploader onVideoSelect={setBackgroundVideoUrl} />
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Preview</h2>
          <CombinedPreview 
            templateVideoUrl={selectedTemplateUrl}
            backgroundVideoUrl={backgroundVideoUrl}
          />
        </div>
      </div>
    </div>
  );
};

export default StarterGreenScreenify;