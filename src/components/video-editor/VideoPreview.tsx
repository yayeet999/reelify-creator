import { type Position } from "./TextPositionSelector";
import { type AnimationType } from "./TextAnimationSelector";

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
  const getPositionClasses = (pos: Position) => {
    switch (pos) {
      case "top":
        return "top-4";
      case "middle":
        return "top-1/2 -translate-y-1/2";
      case "bottom":
        return "bottom-4";
    }
  };

  const getAnimationClasses = (anim: AnimationType) => {
    switch (anim) {
      case "none":
        return "";
      case "fade":
        return "animate-fade-in";
      case "slide-left":
        return "animate-slide-in-right";
      case "slide-up":
        return "animate-fade-up";
    }
  };

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      <video 
        className="w-full h-full rounded-lg object-cover"
        controls
        src={videoUrl}
        loop
      />
      {text && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 text-center w-full px-4 ${getPositionClasses(position)} ${getAnimationClasses(animation)}`}
          style={{
            color: textColor,
            fontSize: `${textSize}px`,
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};