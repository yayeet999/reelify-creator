import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadSectionProps {
  onVideoSelect: (url: string, publicId: string) => void;
}

export const VideoUploadSection = ({ onVideoSelect }: VideoUploadSectionProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const validateVideo = async (file: File) => {
    // Check file format
    const validFormats = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validFormats.includes(file.type)) {
      setError('Only MP4, MOV, and WEBM formats are supported.');
      return false;
    }

    // Check video duration
    const video = document.createElement('video');
    video.preload = 'metadata';

    return new Promise((resolve) => {
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          setError('Video must be 30 seconds or less.');
          resolve(false);
        } else {
          setError(null);
          resolve(true);
        }
      };
      video.src = URL.createObjectURL(file);
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isValid = await validateVideo(file);
    if (!isValid) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'for_temp_videos_forSTARTERgreen');

    try {
      const response = await fetch(
        'https://api.cloudinary.com/v1_1/fornotreel/video/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      onVideoSelect(data.secure_url, data.public_id);
      
      toast({
        title: "Upload Successful",
        description: "Your video has been uploaded successfully.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      setError('Failed to upload video. Please try again.');
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your video.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (event.target.value) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="space-y-4 mt-6 p-4 border border-border rounded-lg">
      <Label className="text-lg font-semibold">Upload Your Video</Label>
      
      <div className="relative aspect-video bg-accent/10 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <Input
          type="file"
          accept=".mp4,.mov,.webm"
          onChange={handleFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <Upload className="w-8 h-8 mb-2 text-primary/60" />
          <p className="text-sm font-medium text-primary">
            {isUploading ? "Uploading..." : "Choose Video"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            MP4, MOV, or WEBM format
          </p>
          <p className="text-xs text-muted-foreground">
            30 seconds max
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};