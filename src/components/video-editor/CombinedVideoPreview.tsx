import { useEffect, useRef, useState } from "react";
import { type Position } from "./TextPositionSelector";
import { type AnimationType } from "./TextAnimationSelector";

interface CombinedVideoPreviewProps {
  templateVideoUrl: string;
  uploadedVideoUrl: string;
  text: string;
  textColor: string;
  textSize: number;
  position: Position;
  animation: AnimationType;
}

export const CombinedVideoPreview = ({
  templateVideoUrl,
  uploadedVideoUrl,
  text,
  textColor,
  textSize,
  position,
  animation,
}: CombinedVideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState<"template" | "uploaded">("template");
  const templateVideoRef = useRef<HTMLVideoElement>(null);
  const uploadedVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const templateVideo = templateVideoRef.current;
    const uploadedVideo = uploadedVideoRef.current;

    if (templateVideo && uploadedVideo) {
      templateVideo.addEventListener("ended", () => {
        templateVideo.style.opacity = "0";
        uploadedVideo.style.opacity = "1";
        uploadedVideo.play();
        setCurrentVideo("uploaded");
      });

      uploadedVideo.addEventListener("ended", () => {
        uploadedVideo.style.opacity = "0";
        templateVideo.style.opacity = "1";
        templateVideo.play();
        setCurrentVideo("template");
      });

      // Initial play
      templateVideo.play();
    }
  }, []);

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

  const PREVIEW_SCALE = 0.8;

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      <video 
        ref={templateVideoRef}
        className="absolute inset-0 w-full h-full rounded-lg object-cover z-[1] transition-opacity duration-300"
        src={templateVideoUrl}
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
      />
      
      <video 
        ref={uploadedVideoRef}
        className="absolute inset-0 w-full h-full rounded-lg object-cover z-[1] opacity-0 transition-opacity duration-300"
        src={uploadedVideoUrl}
        muted
        playsInline
        preload="auto"
      />
      
      {/* Watermark overlay - Always visible */}
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

      {/* Text overlay - Only visible during template video */}
      {text && currentVideo === "template" && (
        <div 
          key={`${text}-${animation}-${position}-${currentVideo}`}
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