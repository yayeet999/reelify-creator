import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DownloadButtonProps {
  disabled?: boolean;
  templateVideoUrl?: string;
  backgroundVideoUrl?: string;
  textOverlay: string;
  textColor: string;
  textSize: number;
  textPosition: "top" | "middle" | "bottom";
  animation: "none" | "fade" | "slide" | "scale";
  startTime: number;
  duration: number;
}

export const DownloadButton = ({ 
  disabled, 
  templateVideoUrl,
  backgroundVideoUrl,
  textOverlay,
  textColor,
  textSize,
  textPosition,
  animation,
  startTime,
  duration
}: DownloadButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const extractCloudinaryId = (url: string) => {
    const matches = url.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!matches) {
      console.error("Failed to extract video ID from URL:", url);
      return null;
    }
    return matches[1];
  };

  const generateCloudinaryUrl = () => {
    if (!templateVideoUrl || !backgroundVideoUrl) return null;

    // Extract IDs
    const templateId = extractCloudinaryId(templateVideoUrl);
    const backgroundId = extractCloudinaryId(backgroundVideoUrl);

    if (!templateId || !backgroundId) {
      console.error("Failed to extract video IDs");
      return null;
    }

    // Build transformation URL
    let transformationUrl = `https://res.cloudinary.com/fornotreel/video/upload/`
      + `ac_none/`                    // Clear any existing audio
      + `q_auto:good/`               // Quality settings
      + `c_fill,ar_9:16,w_1080/`     // Video dimensions
      + `so_${startTime}/`           // Start offset
      + `du_${duration}/`            // Duration
      + `l_video:${templateId}/`     // Template overlay
      + `c_scale,w_1080/`            // Scale template video
      + `fl_layer_apply,g_center`;   // Apply template layer

    // Add text overlay if provided
    if (textOverlay) {
      transformationUrl += `/l_text:Arial_${textSize}:${encodeURIComponent(textOverlay)}`
        + `,co_${textColor.replace('#', '')}`
        + `,g_${textPosition === 'middle' ? 'center' : textPosition}`;

      // Add animation effect
      switch (animation) {
        case "fade":
          transformationUrl += ',e_fade:2000';
          break;
        case "slide":
          transformationUrl += ',e_slide:up:2000';
          break;
        case "scale":
          transformationUrl += ',e_scale:2000';
          break;
      }
    }

    // Add final video
    transformationUrl += `/${backgroundId}.mp4`;

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

      const response = await fetch(transformedUrl);
      if (!response.ok) {
        throw new Error(`Failed to download video: ${response.status} ${response.statusText}`);
      }

      const blob = await response.blob();
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
        title: "Download Complete",
        description: "Your video has been downloaded successfully.",
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
      disabled={disabled || isProcessing}
      onClick={handleDownload}
    >
      <Download className="mr-2 h-4 w-4" />
      {isProcessing ? "Processing..." : "Download Combined Video"}
    </Button>
  );
};