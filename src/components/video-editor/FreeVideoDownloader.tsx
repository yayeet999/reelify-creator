import { Button } from "@/components/ui/button";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VideoDownloaderProps {
  textOverlay: string;
  textColor: string;
  textSize: number;
  textPosition: "top" | "middle" | "bottom";
  animation: "none" | "fade";
  startTime: number;
  duration: number;
  currentVideoUrl: string;
  isTemplateSelected: boolean;
  onProceedWithTemplate: () => void;
  onGoBackToTemplates: () => void;
  hasUploadedVideo: boolean;
}

export const FreeVideoDownloader = ({
  textOverlay,
  textColor,
  textSize,
  textPosition,
  animation,
  startTime,
  duration,
  currentVideoUrl,
  isTemplateSelected,
  onProceedWithTemplate,
  onGoBackToTemplates,
  hasUploadedVideo,
}: VideoDownloaderProps) => {
  const navigate = useNavigate();

  const handleUpgrade = () => {
    navigate("/#pricing");
  };

  if (!isTemplateSelected) {
    return (
      <Button 
        className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        onClick={onProceedWithTemplate}
      >
        Proceed with this template
      </Button>
    );
  }

  if (!hasUploadedVideo) {
    return null; // Don't show any button here since we have the "Go back" button above
  }

  return (
    <Button 
      className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      onClick={handleUpgrade}
    >
      <Crown className="mr-2 h-4 w-4" />
      Upgrade to Download
    </Button>
  );
};