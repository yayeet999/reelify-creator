import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Video, Upload, Clock, Check } from "lucide-react";
import { GreenScreenVideoPreview } from "@/components/video-editor/GreenScreenVideoPreview";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { TimelineVisualizer } from "@/components/video-editor/TimelineVisualizer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface ImageUpload {
  file: File | null;
  startTime: number;
  endTime: number;
  isPreviewEnabled?: boolean;
}

const StarterGreenScreenify = () => {
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://res.cloudinary.com/fornotreel/video/upload/v1736580998/realgreen1_rnukxx.mp4");
  const [imageUploads, setImageUploads] = useState<ImageUpload[]>(
    Array(5).fill({ file: null, startTime: 0, endTime: 5, isPreviewEnabled: false })
  );
  const videoRef = useRef<HTMLVideoElement>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const { toast } = useToast();
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check image dimensions before uploading
      const img = new Image();
      img.src = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        
        if (img.width === 1080 && img.height === 1920) {
          setImageUploads(prev => {
            const newUploads = [...prev];
            newUploads[index] = {
              ...newUploads[index],
              file,
              isPreviewEnabled: false,
              startTime: 0,
              endTime: 5
            };
            return newUploads;
          });
          
          toast({
            title: "Image uploaded successfully",
            description: "You can now set the time range for this image.",
          });
        } else {
          toast({
            title: "Invalid image dimensions",
            description: "Please upload an image with dimensions 1080x1920.",
            variant: "destructive"
          });
        }
      };
    }
  };

  const handleTimeRangeChange = (index: number, startTime: number, endTime: number) => {
    setImageUploads(prev => {
      const newUploads = [...prev];
      newUploads[index] = {
        ...newUploads[index],
        startTime,
        endTime
      };
      return newUploads;
    });
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
                onTimeUpdate={() => {}}
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
                        <div className="space-y-2">
                          <img
                            src={URL.createObjectURL(upload.file)}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div className="space-y-2 p-2">
                            <Label className="text-sm">Start Time (s)</Label>
                            <Slider
                              value={[upload.startTime]}
                              onValueChange={([value]) => handleTimeRangeChange(index, value, upload.endTime)}
                              max={30}
                              step={0.1}
                              className="mb-2"
                            />
                            <Label className="text-sm">End Time (s)</Label>
                            <Slider
                              value={[upload.endTime]}
                              onValueChange={([value]) => handleTimeRangeChange(index, upload.startTime, value)}
                              max={30}
                              step={0.1}
                              className="mb-2"
                            />
                            <Button
                              size="sm"
                              variant={upload.isPreviewEnabled ? "default" : "outline"}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleImagePreview(index);
                              }}
                              className="w-full"
                            >
                              {upload.isPreviewEnabled ? (
                                <Check className="w-4 h-4 mr-2" />
                              ) : null}
                              {upload.isPreviewEnabled ? "Previewing" : "Preview"}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400" />
                          <span className="text-sm text-gray-500">Upload Image {index + 1}</span>
                          <span className="text-xs text-gray-400">(1080x1920)</span>
                        </>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StarterGreenScreenify;