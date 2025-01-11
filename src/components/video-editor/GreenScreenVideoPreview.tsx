import { useEffect, useRef, useState } from "react";

interface GreenScreenVideoPreviewProps {
  videoUrl: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  imageUploads: Array<{
    file: File | null;
    timestamp: number;
    isPreviewEnabled?: boolean;
  }>;
}

export const GreenScreenVideoPreview = ({
  videoUrl,
  videoRef: externalVideoRef,
  imageUploads,
}: GreenScreenVideoPreviewProps) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [canvasContext, setCanvasContext] = useState<CanvasRenderingContext2D | null>(null);

  // Initialize canvas context
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      setCanvasContext(ctx);
    }
  }, []);

  // Handle video playback and canvas drawing
  useEffect(() => {
    const videoElement = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvasContext;

    if (!videoElement || !canvas || !ctx) return;

    // Set canvas dimensions to match video
    const updateCanvasSize = () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
    };

    // Draw current frame to canvas
    const drawFrame = () => {
      if (!videoElement.paused && !videoElement.ended) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw enabled background images at their timestamps
        imageUploads.forEach(upload => {
          if (upload.file && upload.isPreviewEnabled && 
              Math.abs(videoElement.currentTime - upload.timestamp) < 0.1) {
            const img = new Image();
            img.src = URL.createObjectURL(upload.file);
            img.onload = () => {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              URL.revokeObjectURL(img.src);
            };
          }
        });

        // Draw video frame on top
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Request next frame
        requestAnimationFrame(drawFrame);
      }
    };

    const handlePlay = () => {
      drawFrame();
    };

    const handleLoadedMetadata = () => {
      updateCanvasSize();
      setIsLoading(false);
    };

    // Event listeners
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

    // Initial video setup
    videoElement.currentTime = 0;
    const playVideo = async () => {
      try {
        await videoElement.play();
      } catch (error) {
        console.error("Video autoplay failed:", error);
      }
    };
    
    playVideo();

    // Cleanup
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoUrl, videoRef, canvasContext, imageUploads]);

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      <video 
        ref={videoRef}
        className="hidden"
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={(e) => {
          console.error("Video loading error:", e);
          setIsLoading(false);
        }}
      />
      <canvas
        ref={canvasRef}
        className={`w-full h-full rounded-lg object-cover z-[2] transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};