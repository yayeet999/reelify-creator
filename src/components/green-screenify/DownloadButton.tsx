import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useDownloadLimits } from "@/hooks/use-download-limits";
import { supabase } from "@/integrations/supabase/client";

interface DownloadButtonProps {
  disabled?: boolean;
  templateVideoUrl?: string;
  backgroundVideoUrl?: string;
  audioUrl?: string;
}

export const DownloadButton = ({ 
  disabled, 
  templateVideoUrl,
  backgroundVideoUrl,
  audioUrl
}: DownloadButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { isLoading, canDownload, remainingDownloads, recordDownload } = useDownloadLimits();

  const generateCloudinaryUrl = async () => {
    if (!templateVideoUrl || !backgroundVideoUrl) return null;

    // Extract template video ID from URL
    const templateMatches = templateVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!templateMatches) return null;
    const templateId = templateMatches[1];

    // Extract background video ID from URL
    const backgroundMatches = backgroundVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!backgroundMatches) return null;
    const backgroundId = backgroundMatches[1];

    // Initialize transformation URL
    let transformationUrl = `https://res.cloudinary.com/fornotreel/video/upload/`
      + `q_auto:good/`
      + `c_fill,ar_9:16,w_1080/` // Set aspect ratio and width
      + `so_0/`
      + `l_video:${templateId}/`
      + `c_scale,w_1080/` // Scale template video to match background width
      + `fl_layer_apply,g_center`;

    // Handle audio if provided
    if (audioUrl) {
      try {
        // First, try to handle ElevenLabs audio URL
        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) {
          throw new Error('Failed to fetch audio from ElevenLabs');
        }

        // Get the audio data as blob
        const audioBlob = await audioResponse.blob();

        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', audioBlob);
        formData.append('upload_preset', 'ml_default');

        const uploadResponse = await fetch(
          'https://api.cloudinary.com/v1_1/fornotreel/upload',
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload audio to Cloudinary');
        }

        const uploadResult = await uploadResponse.json();
        const audioPublicId = uploadResult.public_id;

        // Add audio layer to transformation
        transformationUrl += `/l_audio:${audioPublicId}/fl_layer_apply`;
      } catch (error) {
        console.error('Audio processing error:', error);
        throw new Error('Failed to process audio');
      }
    }

    // Add final video
    transformationUrl += `/${backgroundId}.mp4`;

    console.log("Generated URL:", transformationUrl);
    return transformationUrl;
  };

  const handleDownload = async () => {
    if (!templateVideoUrl || !backgroundVideoUrl) {
      toast({
        title: "Error",
        description: "Both template and background videos are required.",
        variant: "destructive",
      });
      return;
    }

    if (!canDownload) {
      toast({
        title: "Download Limit Reached",
        description: "You've reached your download limit for this billing period.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const transformedUrl = await generateCloudinaryUrl();
      if (!transformedUrl) {
        throw new Error("Failed to generate video URL");
      }

      toast({
        title: "Processing",
        description: "Preparing your video for download...",
      });

      // Fetch the video data
      const response = await fetch(transformedUrl);
      if (!response.ok) {
        throw new Error("Failed to download video");
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Record the download attempt
      const success = await recordDownload(transformedUrl);
      if (!success) {
        throw new Error("Failed to record download");
      }

      // Create object URL and trigger download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `combined-video-${Date.now()}.mp4`;
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast({
        title: "Download Started",
        description: `You have ${remainingDownloads ? remainingDownloads - 1 : 0} downloads remaining.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error processing your download. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90"
      size="lg"
      disabled={disabled || isLoading || isProcessing || !canDownload}
      onClick={handleDownload}
    >
      <Download className="mr-2 h-4 w-4" />
      {isProcessing ? "Processing..." : 
       isLoading ? "Checking limits..." :
       !canDownload ? "Download limit reached" :
       "Download Combined Video"}
    </Button>
  );
};