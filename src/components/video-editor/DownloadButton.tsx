import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSubscriptionTier } from "@/hooks/useSubscriptionTier";

interface DownloadButtonProps {
  disabled?: boolean;
  videoUrl?: string;
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
  videoUrl,
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
  const navigate = useNavigate();
  const { currentTier, hasAccess } = useSubscriptionTier();

  const handleUpgrade = () => {
    navigate("/#pricing");
  };

  const generateCloudinaryUrl = () => {
    if (!videoUrl) return null;

    // Extract video ID from URL
    const matches = videoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!matches) {
      console.error("Failed to extract video ID from URL:", videoUrl);
      return null;
    }
    const videoId = matches[1];

    // Build transformation URL
    let transformationUrl = `https://res.cloudinary.com/fornotreel/video/upload/`
      + `q_auto:good/`               // Quality settings
      + `c_fill,ar_9:16,w_1080/`     // Video dimensions
      + `so_${startTime}/`           // Start offset
      + `du_${duration}/`;           // Duration

    // Add text overlay with animation
    const textParams = [
      `l_text:Arial_${textSize}:${encodeURIComponent(textOverlay)}`,
      `co_${textColor.replace('#', '')}`,
      `g_${textPosition === 'middle' ? 'center' : textPosition}`,
    ];

    // Add animation effect
    switch (animation) {
      case "fade":
        textParams.push('e_fade:2000');
        break;
      case "slide":
        textParams.push('e_slide:up:2000');
        break;
      case "scale":
        textParams.push('e_scale:2000');
        break;
    }

    transformationUrl += textParams.join(',') + '/';
    transformationUrl += videoId + '.mp4';

    console.log("Generated Cloudinary URL:", transformationUrl);
    return transformationUrl;
  };

  const handleDownload = async () => {
    if (!videoUrl) {
      toast({
        title: "Error",
        description: "No video selected.",
        variant: "destructive",
      });
      return;
    }

    if (!hasAccess('starter')) {
      handleUpgrade();
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
      link.download = `edited-video-${Date.now()}.mp4`;
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

  // Show upgrade button for free tier users
  if (currentTier === 'free') {
    return (
      <Button
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        size="lg"
        onClick={handleUpgrade}
      >
        <Crown className="mr-2 h-4 w-4" />
        Upgrade to Download
      </Button>
    );
  }

  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90"
      size="lg"
      disabled={disabled || isProcessing}
      onClick={handleDownload}
    >
      <Download className="mr-2 h-4 w-4" />
      {isProcessing ? "Processing..." : "Download Video"}
    </Button>
  );
};