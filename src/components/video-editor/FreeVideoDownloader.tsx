import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FreeVideoDownloaderProps {
  textOverlay: string;
  textColor: string;
  textSize: number;
  textPosition: "top" | "middle" | "bottom";
  animation: "none" | "fade";
  startTime: number;
  duration: number;
  currentVideoUrl: string;
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
}: FreeVideoDownloaderProps) => {
  const navigate = useNavigate();

  return (
    <Button 
      className="w-full mt-4 bg-primary hover:bg-primary/90"
      onClick={() => navigate('/#pricing')}
    >
      Upgrade to Download
    </Button>
  );
};
