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
  videoRef?: React.RefObject<HTMLVideoElement>;
}

export const VideoPreview = ({
  videoUrl,
  text,
  textColor,
  textSize,
  position,
  animation,
  videoRef: externalVideoRef,
}: VideoPreviewProps) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [isLoading, setIsLoading] = useState(true);
  const [prevVideoUrl, setPrevVideoUrl] = useState(videoUrl);

  // Enhanced video control effect
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement && videoUrl) {
      // Reset video and play
      videoElement.currentTime = 0;
      videoElement.loop = true;  // Ensure looping is enabled
      
      // Track loading state
      setIsLoading(true);
      
      // Ensure video plays and loops
      const playVideo = async () => {
        try {
          // Set playback attributes
          videoElement.muted = true;  // Required for autoplay
          videoElement.playsInline = true;  // Better mobile support
          await videoElement.play();
        } catch (error) {
          console.error("Video autoplay failed:", error);
          // Retry play on user interaction
          const playOnInteraction = async () => {
            try {
              await videoElement.play();
              document.removeEventListener('click', playOnInteraction);
            } catch (e) {
              console.error("Retry play failed:", e);
            }
          };
          document.addEventListener('click', playOnInteraction);
        }
      };
      
      playVideo();
    }
  }, [videoUrl]); // Only reset when video source changes

  // Update previous video URL after transition
  useEffect(() => {
    if (!isLoading && videoUrl) {  // Only update if we have a URL
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
      case "slide":
        return "animate-slide-up";
      case "scale":
        return "animate-scale-in";
    }
  };

  // Scale factor for preview (adjusted for better visual match)
  const PREVIEW_SCALE = 0.8;

  return (
    <div 
      className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .video-security {
          -webkit-user-select: none;
          -ms-user-select: none;
          user-select: none;
          pointer-events: none;
          -webkit-touch-callout: none;
          -webkit-filter: blur(0);
        }
      `}</style>

      {/* Previous video for transition */}
      {prevVideoUrl !== videoUrl && (
        <video 
          className="absolute inset-0 w-full h-full rounded-lg object-cover z-[1] transition-opacity duration-300 opacity-0 video-security"
          src={prevVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          onContextMenu={(e) => e.preventDefault()}
        />
      )}
      
      {/* Current video */}
      <video 
        ref={videoRef}
        className={`w-full h-full rounded-lg object-cover z-[2] transition-opacity duration-300 video-security ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        src={videoUrl}
        autoPlay
        muted
        loop
        controls={false}
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Security overlay */}
      <div className="absolute inset-0 z-[10] bg-black/10 pointer-events-none" />

      {/* Additional security layer */}
      <div className="absolute inset-0 z-[15] pointer-events-none select-none" style={{ mixBlendMode: 'normal' }} />
      
      {/* Watermark overlay with middle z-index */}
      <div className="absolute inset-0 z-[20] pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-[0.23]">
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