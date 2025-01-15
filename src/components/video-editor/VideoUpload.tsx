import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Video } from "lucide-react";

interface VideoUploadProps {
  onVideoSelect: (file: File) => void;
}

export const VideoUpload = ({ onVideoSelect }: VideoUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    // Reset input so the same file can be selected again if needed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <Label>Upload Video</Label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upload Container - Note the reduced height with aspect-[9/4] */}
        <div className="relative aspect-[9/4] bg-accent-purple/10 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
          <Input
            ref={inputRef}
            type="file"
            accept=".mp4,.mov,.webm"
            onChange={handleFileChange}
            className="hidden"
          />
          <div 
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer p-4"
          >
            <Video className="w-8 h-8 mb-2 text-primary/60" />
            <p className="text-sm font-medium text-primary">Choose Video</p>
            <p className="text-xs text-muted-foreground mt-1">
              MP4, MOV, or WEBM format
            </p>
            <p className="text-xs text-muted-foreground">
              30 seconds max
            </p>
          </div>
        </div>

        {/* Preview Container */}
        <div className="relative aspect-[9/16] bg-accent-purple/10 rounded-lg border border-primary/20 overflow-hidden">
          {previewUrl ? (
            <video
              src={previewUrl}
              className="absolute inset-0 w-full h-full object-cover"
              controls
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p className="text-sm">Video preview</p>
            </div>
          )}
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