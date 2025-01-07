import { type Position } from "./TextPositionSelector";
import { type AnimationType } from "./TextAnimationSelector";
import { useEffect, useRef } from "react";

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  }, [videoUrl]);

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
      {/* Base video with lowest z-index */}
      <video 
        ref={videoRef}
        className="w-full h-full rounded-lg object-cover z-[1]"
        src={videoUrl}
        autoPlay
        muted
        loop
        controls={false}
        onContextMenu={(e) => e.preventDefault()}
        playsInline
      />
      
      {/* Watermark overlay with middle z-index */}
      <div className="absolute inset-0 z-[20] pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-[0.03]">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex items-center justify-center rotate-[-25deg]">
              <span className="text-black text-xl font-bold whitespace-nowrap">
                REELIFY
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Text overlay with highest z-index */}
      {text && (
        <div 
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