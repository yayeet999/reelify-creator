import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
}

export const VideoUpload = ({ onVideoSelect }: VideoUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      onVideoSelect(file);
    }
    
    // Reset input so the same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Video</Label>
        <Input
          ref={inputRef}
          type="file"
          accept=".mp4,.mov,.webm"
          onChange={handleFileChange}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">
          MP4, MOV, or WEBM format • 30 seconds max
        </p>
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