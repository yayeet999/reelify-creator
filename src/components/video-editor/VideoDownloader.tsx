import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDownloadLimits } from "@/hooks/use-download-limits";
import { calculateCloudinaryScale, getCloudinaryPosition, getCloudinaryAnimation } from "@/utils/cloudinaryUtils";

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
  const PREVIEW_WIDTH = 240;
  const ACTUAL_VIDEO_WIDTH = 1080;

  const generateCloudinaryUrl = () => {
    if (!textOverlay && !uploadedVideoUrl) return currentVideoUrl;

    // Extract the version and public ID from the currentVideoUrl
    const matches = currentVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!matches) return currentVideoUrl;
    
    const publicId = matches[1];
    let url = "https://res.cloudinary.com/fornotreel/video/upload";
    url += "/q_auto:good";

    if (uploadedVideoUrl && uploadedVideoPublicId) {
      // Handle combined video case
      url += `/fl_splice,l_video:${uploadedVideoPublicId}`;
    }

    if (textOverlay) {
      const textWidth = Math.round(ACTUAL_VIDEO_WIDTH * 0.8);
      const encodedText = encodeURIComponent(textOverlay);
      const colorHex = textColor.replace('#', '');
      const cloudinaryFontSize = textSize * calculateCloudinaryScale(PREVIEW_WIDTH, ACTUAL_VIDEO_WIDTH);
      const position = getCloudinaryPosition(textPosition);
      const animationEffect = getCloudinaryAnimation(animation);

      url += `/c_fit,l_text:Roboto_${cloudinaryFontSize}_center:${encodedText},co_rgb:${colorHex},w_${textWidth}`;
      
      if (animationEffect) url += `,${animationEffect}`;
      
      url += `/fl_layer_apply,${position}`;

      if (startTime > 0) url += `,so_${startTime}`;
      url += `,dl_${duration}`;
    }

    url += `/${publicId}.mp4`;
    console.log("Generated URL:", url);
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

      const transformedUrl = generateCloudinaryUrl();
      
      toast({
        title: "Downloading...",
        description: "Preparing your video for download.",
      });

      const response = await fetch(transformedUrl);
      if (!response.ok) throw new Error('Download failed');
      
      const success = await recordDownload(transformedUrl);
      if (!success) {
        throw new Error('Failed to record download');
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
    }
  };

  return (
    <Button 
      className="w-full mt-4"
      onClick={handleDownload}
      disabled={isLoading || !canDownload}
    >
      {isLoading ? "Checking limits..." : 
       !canDownload ? "Download limit reached" :
       `Download with Text Overlay (${remainingDownloads} remaining)`}
    </Button>
  );
};