import { useEffect, useRef, useState } from "react";

interface GreenScreenVideoPreviewProps {
  videoUrl: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  imageUploads: Array<{
    file: File | null;
    timestamp: number;
  }>;
}

export const GreenScreenVideoPreview = ({
  videoUrl,
  videoRef: externalVideoRef,
  imageUploads,
}: GreenScreenVideoPreviewProps) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setIsLoading(true);
      videoElement.currentTime = 0;
      
      const playVideo = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
        }
      };
      
      playVideo();
    }
  }, [videoUrl, videoRef]);

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      <video 
        ref={videoRef}
        className={`w-full h-full rounded-lg object-cover z-[2] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
        onError={(e) => {
          console.error("Video loading error:", e);
          setIsLoading(false);
        }}
      />
    </div>
  );
};