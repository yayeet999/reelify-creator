import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoUploaderProps {
  onVideoSelect: (url: string) => void;
}

export const VideoUploader = ({ onVideoSelect }: VideoUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['video/mp4', 'video/quicktime', 'video/webm'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP4, MOV, or WEBM file",
        variant: "destructive",
      });
      return;
    }

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
        description: "Your background video has been uploaded.",
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
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="relative aspect-video bg-accent/10 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
      <input
        type="file"
        accept=".mp4,.mov,.webm"
        onChange={handleUpload}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <Upload className="w-8 h-8 mb-2 text-primary/60" />
        <p className="text-sm font-medium text-primary">
          {isUploading ? "Uploading..." : "Choose Background Video"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          MP4, MOV, or WEBM format
        </p>
        <p className="text-xs text-muted-foreground">
          40 seconds max
        </p>
      </div>
    </div>
  );
};