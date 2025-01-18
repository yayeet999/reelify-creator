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

  const generateCloudinaryUrl = () => {
    if (!templateVideoUrl || !backgroundVideoUrl) return null;

    // Extract template video ID from URL
    const templateMatches = templateVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!templateMatches) {
      console.error("Template video ID not found");
      return null;
    }
    const templateId = templateMatches[1];
    console.log("Template ID:", templateId);

    // Extract background video ID from URL
    const backgroundMatches = backgroundVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!backgroundMatches) {
      console.error("Background video ID not found");
      return null;
    }
    const backgroundId = backgroundMatches[1];
    console.log("Background ID:", backgroundId);

    // Extract audio ID from URL if present, including folder path
    let audioId = null;
    if (audioUrl) {
      const audioMatches = audioUrl.match(/\/v\d+\/temp_audio_upload\/([^/]+?)(?:\.(?:mp3|wav))?$/);
      if (!audioMatches) {
        console.error("Audio ID not found");
        return null;
      }
      audioId = `temp_audio_upload/${audioMatches[1]}`;
      console.log("Extracted audio ID with path:", audioId);
    }

    // Base URL and quality settings
    let transformationUrl = `https://res.cloudinary.com/fornotreel/video/upload/`
      + `q_auto:good/`
      + `c_fill,ar_9:16,w_1080/` // Set aspect ratio and width
      + `so_0/`  // Start offset
      + `l_video:${templateId}.webm/`  // Layer the template video with explicit extension
      + `c_scale,w_1080/` // Scale template to match background
      + `fl_layer_apply,g_center`; // Apply template centered

    // Add audio layer if provided
    if (audioId) {
      transformationUrl += `/l_audio:${audioId}/fl_layer_apply`;
    }

    // Add final background video
    transformationUrl += `/${backgroundId}.mp4`;

    console.log("Generated transformation URL:", transformationUrl);
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
      const transformedUrl = generateCloudinaryUrl();
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
        // Clone the response before reading it as text
        const errorResponse = response.clone();
        const errorText = await errorResponse.text();
        console.error("Cloudinary error response:", errorText);
        throw new Error(`Failed to download video: ${errorText}`);
      }

      // Convert response to blob
      const blob = await response.blob();
      
      // Record the download attempt
      const success = await recordDownload(transformedUrl);
      if (!success) {
        throw new Error("Failed to record download");
      }

      // Create object URL from blob
      const downloadUrl = window.URL.createObjectURL(blob);
      
      // Create and configure download link
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `combined-video-${Date.now()}.mp4`;
      link.style.display = 'none';
      document.body.appendChild(link);
      
      // Trigger download
      link.click();
      
      // Clean up
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
        description: error.message || "There was an error processing your download. Please try again.",
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