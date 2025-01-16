import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDownloadLimits } from "@/hooks/use-download-limits";
import { calculateCloudinaryScale, getCloudinaryPosition, getCloudinaryAnimation } from "@/utils/cloudinaryUtils";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

interface VideoDownloaderProps {
  textOverlay: string;
  textColor: string;
  textSize: number;
  textPosition: "top" | "middle" | "bottom";
  animation: "none" | "fade";
  startTime: number;
  duration: number;
  currentVideoUrl: string;
  uploadedVideoUrl?: string | null;
  uploadedVideoPublicId?: string | null;
}

export const VideoDownloader = ({
  textOverlay,
  textColor,
  textSize,
  textPosition,
  animation,
  startTime,
  duration,
  currentVideoUrl,
  uploadedVideoUrl,
  uploadedVideoPublicId,
}: VideoDownloaderProps) => {
  const { toast } = useToast();
  const { isLoading, canDownload, remainingDownloads, recordDownload } = useDownloadLimits();
  const [isDownloading, setIsDownloading] = useState(false);
  const PREVIEW_WIDTH = 240;
  const ACTUAL_VIDEO_WIDTH = 1080;

  const generateCloudinaryUrl = () => {
    // Extract the public ID from the current video URL
    const matches = currentVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!matches) {
      console.error("Could not extract public ID from URL:", currentVideoUrl);
      return currentVideoUrl;
    }
    
    const publicId = matches[1];
    console.log("Extracted public ID:", publicId);

    // Start building the URL with base and quality
    let transformations = ["q_auto:good"];

    // Add text overlay transformations if text exists
    if (textOverlay) {
      const textWidth = Math.round(ACTUAL_VIDEO_WIDTH * 0.8);
      const encodedText = encodeURIComponent(textOverlay);
      const colorHex = textColor.replace('#', '');
      const cloudinaryFontSize = textSize * calculateCloudinaryScale(PREVIEW_WIDTH, ACTUAL_VIDEO_WIDTH);
      const position = getCloudinaryPosition(textPosition);
      const animationEffect = getCloudinaryAnimation(animation);

      // Text overlay transformation
      let textTransform = `c_fit,l_text:Roboto_${cloudinaryFontSize}_center:${encodedText},co_rgb:${colorHex},w_${textWidth}`;
      if (animationEffect) {
        textTransform += `,${animationEffect}`;
      }
      transformations.push(textTransform);
      
      // Layer apply transformation (separate)
      transformations.push(`fl_layer_apply,${position}`);
    }

    // Add video splice if uploaded video exists (as a separate transformation)
    if (uploadedVideoUrl && uploadedVideoPublicId) {
      transformations.push(`fl_splice,l_video:${uploadedVideoPublicId}`);
    }

    // Add timing parameters
    if (startTime > 0) {
      transformations.push(`so_${startTime}`);
    }
    transformations.push(`dl_${duration}`);

    // Construct the final URL with proper separation
    const url = `https://res.cloudinary.com/fornotreel/video/upload/${transformations.join('/')}/${publicId}.mp4`;
    console.log("Generated Cloudinary URL:", url);
    return url;
  };

  const handleDownload = async () => {
    try {
      if (!canDownload) {
        toast({
          title: "Download Limit Reached",
          description: "You've reached your download limit for this billing period.",
          variant: "destructive",
        });
        return;
      }

      setIsDownloading(true);
      const transformedUrl = generateCloudinaryUrl();
      console.log("Initiating download with URL:", transformedUrl);
      
      toast({
        title: "Downloading...",
        description: "Preparing your video for download.",
      });

      const response = await fetch(transformedUrl);
      if (!response.ok) {
        console.error("Download failed with status:", response.status);
        throw new Error(`Download failed with status: ${response.status}`);
      }
      
      const success = await recordDownload(transformedUrl);
      if (!success) {
        throw new Error('Failed to record download');
      }

      // If we have an uploaded video, mark it as used
      if (uploadedVideoPublicId) {
        const { error: updateError } = await supabase
          .from('temp_video_uploads')
          .update({ is_used: true })
          .eq('cloudinary_public_id', uploadedVideoPublicId);

        if (updateError) {
          console.error('Error marking video as used:', updateError);
        }
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      link.download = `video-with-text-${timestamp}.mp4`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
      
      toast({
        title: "Download Complete!",
        description: `Download successful. You have ${remainingDownloads ? remainingDownloads - 1 : 0} downloads remaining.`,
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading your video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button 
      className="w-full mt-4"
      onClick={handleDownload}
      disabled={isLoading || isDownloading || !canDownload}
    >
      {isLoading ? "Checking limits..." : 
       isDownloading ? "Downloading..." :
       !canDownload ? "Download limit reached" :
       `Download Video (${remainingDownloads} remaining)`}
    </Button>
  );
};