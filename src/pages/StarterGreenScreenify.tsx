import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Upload } from "lucide-react";
import { GreenScreenVideoPreview } from "@/components/video-editor/GreenScreenVideoPreview";
import { VideoThumbnailGrid } from "@/components/video-editor/GreenScreenVideoThumbnailGrid";
import { TimelineVisualizer } from "@/components/video-editor/TimelineVisualizer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ImageUpload {
  file: File | null;
  timestamp: number;
}

const StarterGreenScreenify = () => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://res.cloudinary.com/fornotreel/video/upload/v1736577684/green1_1080p_ftqbm8.mp4");
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>(
    Array(5).fill({ file: null, timestamp: 0 })
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'ml_default'); // Replace with your upload preset

      fetch('https://api.cloudinary.com/v1_1/fornotreel/image/upload', {
        method: 'POST',
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('Upload successful:', data);
        setImageUploads(prev => {
          const newUploads = [...prev];
          newUploads[index] = {
            ...newUploads[index],
            file
          };
          return newUploads;
        });
        
        toast({
          title: "Image uploaded successfully",
          description: "You can now set the timestamp for this image.",
        });
      })
      .catch(error => {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "There was an error uploading your image. Please try again.",
          variant: "destructive",
        });
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
                imageUploads={imageUploads}
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
                    />
                    <label
                      htmlFor={`image-upload-${index}`}
                      className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                    >
                      {upload.file ? (
                        <>
                          <img
                            src={URL.createObjectURL(upload.file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <span className="text-sm text-gray-500">
                            Time: {upload.timestamp.toFixed(1)}s
                          </span>
                        </>
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
                onClick={() => {
                  toast({
                    title: "Processing Video",
                    description: "Your video is being processed with the green screen effect...",
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