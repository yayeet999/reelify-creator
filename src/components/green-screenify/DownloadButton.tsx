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
  console.log("DownloadButton - Received props:", { templateVideoUrl, backgroundVideoUrl, audioUrl });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { isLoading, canDownload, remainingDownloads, recordDownload } = useDownloadLimits();

  const extractCloudinaryId = (url: string, type: 'video' | 'audio') => {
    console.log(`Extracting ${type} ID from URL:`, url);
    
    let matches;
    if (type === 'audio') {
      // Match the full path including folder structure for audio
      // Replace forward slashes with colons for Cloudinary folder structure
      matches = url.match(/\/v\d+\/(temp_audio_upload\/[^/]+?)(?:\.(?:mp3|wav))?$/);
      if (matches) {
        const extractedId = matches[1].replace('/', ':');
        console.log(`Extracted and formatted audio ID:`, extractedId);
        return extractedId;
      }
    } else {
      // Match video ID only
      matches = url.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
      if (matches) {
        const extractedId = matches[1];
        console.log(`Extracted video ID:`, extractedId);
        return extractedId;
      }
    }
    
    console.error(`Failed to extract ${type} ID from URL:`, url);
    return null;
  };

  const generateCloudinaryUrl = () => {
    if (!templateVideoUrl || !backgroundVideoUrl) return null;

    // Extract IDs
    const templateId = extractCloudinaryId(templateVideoUrl, 'video');
    const backgroundId = extractCloudinaryId(backgroundVideoUrl, 'video');
    const audioId = audioUrl ? extractCloudinaryId(audioUrl, 'audio') : null;

    if (!templateId || !backgroundId) {
      console.error("Failed to extract video IDs");
      return null;
    }

    // Build transformation URL
    let transformationUrl = `https://res.cloudinary.com/fornotreel/video/upload/`
      + `ac_none/`                    // Clear any existing audio
      + `q_auto:good/`               // Quality settings
      + `c_fill,ar_9:16,w_1080/`     // Video dimensions
      + `so_0/`                      // Start offset
      + `l_video:${encodeURIComponent(templateId)}/`     // Template overlay
      + `c_scale,w_1080/`            // Scale template video
      + `fl_layer_apply,g_center`;   // Apply template layer

    // Add audio if provided
    if (audioId) {
      console.log("Adding audio to transformation:", audioId);
      transformationUrl += `/l_audio:${audioId}`  // Note: no URL encoding here since we've already formatted the ID
        + `/fl_layer_apply`;          // Apply audio layer
    }

    // Add final video
    transformationUrl += `/${encodeURIComponent(backgroundId)}.mp4`;

    console.log("Generated Cloudinary URL:", transformationUrl);
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

      // Clone the response before using it
      const response = await fetch(transformedUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
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
        description: error instanceof Error ? error.message : "There was an error processing your download. Please try again.",
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