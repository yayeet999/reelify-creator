import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Upload, Clock, Check } from "lucide-react";
import { GreenScreenVideoPreview } from "@/components/video-editor/GreenScreenVideoPreview";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { TimelineVisualizer } from "@/components/video-editor/TimelineVisualizer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUpload {
  file: File | null;
  timestamp: number;
  isPreviewEnabled?: boolean;
}

const StarterGreenScreenify = () => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://res.cloudinary.com/fornotreel/video/upload/v1736580998/realgreen1_rnukxx.mp4");
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>(
    Array(5).fill({ file: null, timestamp: 0, isPreviewEnabled: false })
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (file) {
      setImageUploads(prev => {
        const newUploads = [...prev];
        newUploads[index] = {
          ...newUploads[index],
          file,
          isPreviewEnabled: false
        };
        return newUploads;
      });
      
      toast({
        title: "Image uploaded successfully",
        description: "You can now set the timestamp for this image.",
      });
    }
  };

  const handleTimeUpdate = (time: number) => {
    if (selectedSlot !== null) {
      setImageUploads(prev => {
        const newUploads = [...prev];
        newUploads[selectedSlot] = {
          ...newUploads[selectedSlot],
          timestamp: time
        };
        return newUploads;
      });
    }
  };

  const toggleImagePreview = (index: number) => {
    setImageUploads(prev => {
      const newUploads = [...prev];
      newUploads[index] = {
        ...newUploads[index],
        isPreviewEnabled: !newUploads[index].isPreviewEnabled
      };
      return newUploads;
    });
  };

  const generateFinalVideo = () => {
    let url = "https://res.cloudinary.com/fornotreel/video/upload";
    url += "/q_auto,f_auto";

    imageUploads.forEach((upload) => {
      if (upload.file && upload.isPreviewEnabled) {
        try {
          const cleanFileName = encodeURIComponent(upload.file.name.replace(/[^a-zA-Z0-9]/g, '_'));
          url += `/u_${cleanFileName}`;
          if (upload.timestamp > 0) {
            url += `,so_${Math.round(upload.timestamp)}`;
          }
          url += "/fl_layer_apply";
        } catch (error) {
          console.error("Error processing image upload:", error);
        }
      }
    });

    const videoId = currentVideoUrl.split('/').pop()?.split('.')[0];
    if (videoId) {
      url += `/${videoId}`;
    }

    console.log("Generated Final URL:", url);
    
    toast({
      title: "Processing Video",
      description: "Your video is being processed with the selected images...",
    });
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
              <GreenScreenVideoPreview
                videoRef={videoRef}
                videoUrl={currentVideoUrl}
                imageUploads={imageUploads.filter(upload => upload.isPreviewEnabled)}
              />
              <TimelineVisualizer 
                videoRef={videoRef}
                onTimeUpdate={handleTimeUpdate}
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imageUploads.map((upload, index) => (
                  <div 
                    key={index}
                    className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                      selectedSlot === index ? 'border-primary' : 'border-gray-200'
                    } ${upload.file ? 'bg-gray-50' : ''}`}
                    onClick={() => setSelectedSlot(index)}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, index)}
                      className="hidden"
                      id={`image-upload-${index}`}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {upload.file ? (
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(upload.file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{upload.timestamp.toFixed(1)}s</span>
                            </div>
                            <Button
                              size="sm"
                              variant={upload.isPreviewEnabled ? "default" : "outline"}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleImagePreview(index);
                              }}
                            >
                              {upload.isPreviewEnabled ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                "Preview"
                              )}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload Image {index + 1}</span>
                        </>
                      )}
                    </label>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full"
                onClick={generateFinalVideo}
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