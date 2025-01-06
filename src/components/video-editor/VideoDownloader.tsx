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
}

export const VideoDownloader = ({
  textOverlay,
  textColor,
  textSize,
  textPosition,
  animation,
  startTime,
  duration,
}: VideoDownloaderProps) => {
  const { toast } = useToast();
  const PREVIEW_WIDTH = 240;
  const ACTUAL_VIDEO_WIDTH = 1080;
  const baseVideoUrl = "https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";

  const generateCloudinaryUrl = () => {
    if (!textOverlay) return baseVideoUrl;

    let url = "https://res.cloudinary.com/fornotreel/video/upload";
    url += "/q_auto:good";

    if (textOverlay) {
      const encodedText = encodeURIComponent(textOverlay);
      const colorHex = textColor.replace('#', '');
      const cloudinaryFontSize = textSize * calculateCloudinaryScale(PREVIEW_WIDTH, ACTUAL_VIDEO_WIDTH);
      const position = getCloudinaryPosition(textPosition);
      const animationEffect = getCloudinaryAnimation(animation);
      
      // Calculate text container width (80% of video width)
      const textWidth = Math.round(ACTUAL_VIDEO_WIDTH * 0.8);

      // Add text overlay with all parameters grouped together
      url += `/l_text:Roboto_${cloudinaryFontSize}_bold:${encodedText}`;
      url += `,w_${textWidth}`;
      url += ',c_fit';
      url += ',text_align_center';
      url += ',b_none';
      url += `,co_rgb:${colorHex}`;
      url += `,${position}`;
      
      if (animationEffect) url += `,${animationEffect}`;
      if (startTime > 0) url += `,so_${startTime}`;
      url += `,dl_${duration}`;
    }

    url += "/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";
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