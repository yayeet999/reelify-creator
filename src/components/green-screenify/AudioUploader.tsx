import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface AudioUploaderProps {
  onAudioSelect: (url: string) => void;
}

export const AudioUploader = ({ onAudioSelect }: AudioUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an MP3 or WAV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'for_temp_videos_forSTARTERgreen');
    formData.append('resource_type', 'video'); // Cloudinary handles audio under video resource type
    formData.append('auto_transcription', 'true'); // Enable auto transcription

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
      
      // Track upload in database
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from('audio_uploads').insert({
          user_id: session.user.id,
          cloudinary_public_id: data.public_id,
          cloudinary_url: data.secure_url,
        });
      }

      onAudioSelect(data.secure_url);
      
      toast({
        title: "Upload Successful",
        description: "Your audio has been uploaded and transcription is being generated.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your audio.",
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
    <div className="relative bg-accent/10 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors p-4">
      <input
        type="file"
        accept=".mp3,.wav"
        onChange={handleUpload}
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="flex flex-col items-center justify-center gap-2">
        <Upload className="w-8 h-8 text-primary/60" />
        <p className="text-sm font-medium text-primary">
          {isUploading ? "Uploading..." : "Choose Audio File"}
        </p>
        <p className="text-xs text-muted-foreground">
          MP3 or WAV format
        </p>
      </div>
    </div>
  );
};