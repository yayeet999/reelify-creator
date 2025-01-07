import { type Position } from "./TextPositionSelector";
import { type AnimationType } from "./TextAnimationSelector";
import { useEffect, useRef, useState } from "react";

interface VideoPreviewProps {
  videoUrl: string;
  text: string;
  textColor: string;
  textSize: number;
  position: Position;
  animation: AnimationType;
}

export const VideoPreview = ({
  videoUrl,
  text,
  textColor,
  textSize,
  position,
  animation,
}: VideoPreviewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prevVideoUrl, setPrevVideoUrl] = useState(videoUrl);

  // Enhanced video control effect
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      // Reset video and play
      videoElement.currentTime = 0;
      
      // Track loading state
      setIsLoading(true);
      
      // Ensure video plays and loops
      const playVideo = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.log("Video autoplay failed:", error);
        }
      };
      
      playVideo();
    }
  }, [videoUrl]); // Only reset when video source changes

  // Update previous video URL after transition
  useEffect(() => {
    if (!isLoading) {
      setPrevVideoUrl(videoUrl);
    }
  }, [isLoading, videoUrl]);

  const getPositionClasses = (pos: Position) => {
    switch (pos) {
      case "top":
        return "top-8";
      case "middle":
        return "top-1/2 -translate-y-1/2";
      case "bottom":
        return "bottom-8";
    }
  };

  const getAnimationClasses = (anim: AnimationType) => {
    switch (anim) {
      case "none":
        return "opacity-100";
      case "fade":
        return "animate-fade-in";
    }
  };

  // Scale factor for preview (adjusted for better visual match)
  const PREVIEW_SCALE = 0.8;

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      {/* Previous video for transition */}
      {prevVideoUrl !== videoUrl && (
        <video 
          className="absolute inset-0 w-full h-full rounded-lg object-cover z-[1] transition-opacity duration-300 opacity-0"
          src={prevVideoUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      
      {/* Current video */}
      <video 
        ref={videoRef}
        className={`w-full h-full rounded-lg object-cover z-[2] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        src={videoUrl}
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
      />
      
      {/* Watermark overlay with middle z-index */}
      <div className="absolute inset-0 z-[20] pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-[0.15]">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center rotate-[-25deg]">
              <span className="text-black text-xl font-bold whitespace-nowrap">
                notreel.ai
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Text overlay with highest z-index */}
      {text && (
        <div 
          key={`${text}-${animation}-${position}`} // Force re-render when text, animation, or position changes
          className={`absolute left-1/2 -translate-x-1/2 text-center w-full px-[25px] py-2 z-[30] ${getPositionClasses(position)} ${getAnimationClasses(animation)}`}
          style={{
            color: textColor,
            fontSize: `${textSize * PREVIEW_SCALE}px`,
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};