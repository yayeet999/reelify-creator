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
}

export const DownloadButton = ({ 
  disabled, 
  templateVideoUrl,
  backgroundVideoUrl 
}: DownloadButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { isLoading, canDownload, remainingDownloads, recordDownload } = useDownloadLimits();

  const generateCloudinaryUrl = () => {
    if (!templateVideoUrl || !backgroundVideoUrl) return null;

    // Extract template video ID from URL
    const templateMatches = templateVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!templateMatches) return null;
    const templateId = templateMatches[1];

    // Extract background video ID from URL
    const backgroundMatches = backgroundVideoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!backgroundMatches) return null;
    const backgroundId = backgroundMatches[1];

    // Construct transformation URL
    const transformationUrl = `https://res.cloudinary.com/fornotreel/video/upload/`
      + `q_auto:good/`
      + `c_fill,ar_9:16/`
      + `so_0/`
      + `l_video:${templateId}/`
      + `fl_layer_apply,g_center/`
      + `${backgroundId}.mp4`;

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
      const transformedUrl = generateCloudinaryUrl();
      if (!transformedUrl) {
        throw new Error("Failed to generate video URL");
      }

      // Record the download attempt
      const success = await recordDownload(transformedUrl);
      if (!success) {
        throw new Error("Failed to record download");
      }

      // Create download link
      const link = document.createElement('a');
      link.href = transformedUrl;
      link.download = `combined-video-${Date.now()}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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