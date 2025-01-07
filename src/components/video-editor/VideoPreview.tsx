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
        return "";
      case "fade":
        return "animate-fade-in";
    }
  };

  // Scale factor for preview (adjusted for better visual match)
  const PREVIEW_SCALE = 0.8;

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(to right, #fff 1px, transparent 1px),
            linear-gradient(to bottom, #fff 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
      
      <video 
        className="w-full h-full rounded-lg object-cover"
        src={videoUrl}
        autoPlay
        muted
        loop
        controls={false}
        onContextMenu={(e) => e.preventDefault()}
        playsInline
      />
      {text && (
        <div 
          className={`absolute left-1/2 -translate-x-1/2 text-center w-full px-6 py-2 z-20 ${getPositionClasses(position)} ${getAnimationClasses(animation)}`}
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