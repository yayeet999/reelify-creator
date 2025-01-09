import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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
}: VideoDownloaderProps) => {
  const { toast } = useToast();
  const PREVIEW_WIDTH = 240;
  const ACTUAL_VIDEO_WIDTH = 1080;

  const generateCloudinaryUrl = () => {
    if (!textOverlay) return currentVideoUrl;

    // Extract the version and public ID from the currentVideoUrl
    const matches = currentVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!matches) return currentVideoUrl;
    
    const publicId = matches[1];
    let url = "https://res.cloudinary.com/fornotreel/video/upload";
    url += "/q_auto:good";

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
      const transformedUrl = generateCloudinaryUrl();
      
      toast({
        title: "Downloading...",
        description: "Preparing your video for download.",
      });

      const response = await fetch(transformedUrl);
      if (!response.ok) throw new Error('Download failed');
      
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
        description: "Your video has been downloaded successfully.",
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
    >
      Download with Text Overlay
    </Button>
  );
};