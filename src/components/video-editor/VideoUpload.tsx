import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploadProps {
  onVideoSelect: (url: string) => void;
}

export const VideoUpload = ({ onVideoSelect }: VideoUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
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
          setError('Video must be 30 seconds or less. Please trim your video and try again.');
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
    if (isValid) {
      setIsUploading(true);
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
        onVideoSelect(data.secure_url);
        
        toast({
          title: "Upload Successful",
          description: "Your video has been uploaded.",
        });
      } catch (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload Failed",
          description: "There was an error uploading your video.",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
        if (inputRef.current) {
          inputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <Label>Upload Video</Label>
      
      {/* Upload Container */}
      <div className="relative aspect-[9/4] bg-accent/10 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <Input
          ref={inputRef}
          type="file"
          accept=".mp4,.mov,.webm"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
        />
        <div 
          onClick={() => inputRef.current?.click()}
          className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4"
        >
          <Video className="w-8 h-8 mb-2 text-primary/60" />
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