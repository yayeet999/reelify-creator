import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Upload } from "lucide-react";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { VideoThumbnailGrid } from "@/components/video-editor/GreenScreenVideoThumbnailGrid";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const StarterGreenScreenify = () => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://res.cloudinary.com/fornotreel/video/upload/v1736577684/green1_1080p_ftqbm8.mp4");
  const { toast } = useToast();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Handle image upload
      toast({
        title: "Coming Soon",
        description: "Image upload functionality will be available soon!",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Green Screenify
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Transform your videos with our green screen removal tool
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Video Preview Area */}
          <Card className="xl:col-span-1 bg-accent-purple/20">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                <span>Video Preview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <VideoPreview
                videoUrl={currentVideoUrl}
                text=""
                textColor=""
                textSize={16}
                position="middle"
                animation="none"
              />
              <VideoThumbnailGrid 
                currentVideoUrl={currentVideoUrl}
                onVideoSelect={setCurrentVideoUrl}
              />
            </CardContent>
          </Card>

          {/* Image Upload Area */}
          <Card className="xl:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                <span>Upload Background Images</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Image 1</span>
                  </label>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-2"
                  />
                  <label
                    htmlFor="image-upload-2"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-500">Upload Image 2</span>
                  </label>
                </div>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "Coming Soon",
                    description: "Video generation will be available soon!",
                  });
                }}
              >
                Generate Video
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StarterGreenScreenify;