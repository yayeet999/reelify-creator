import { useEffect, useRef } from "react";

interface CombinedPreviewProps {
  templateVideoUrl?: string;
  backgroundVideoUrl?: string;
}

export const CombinedPreview = ({ templateVideoUrl, backgroundVideoUrl }: CombinedPreviewProps) => {
  const templateVideoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const templateVideo = templateVideoRef.current;
    const backgroundVideo = backgroundVideoRef.current;

    if (templateVideo && backgroundVideo) {
      const playVideos = async () => {
        try {
          // Set initial volume to 0 and muted state to ensure autoplay works
          templateVideo.volume = 0;
          backgroundVideo.volume = 0;
          
          // Ensure videos are muted initially for autoplay
          templateVideo.muted = true;
          backgroundVideo.muted = true;

          // Play both videos
          const playPromises = [
            templateVideo.play().catch(error => {
              console.error('Template video play error:', error);
              // Retry play as muted if initial play fails
              templateVideo.muted = true;
              return templateVideo.play();
            }),
            backgroundVideo.play().catch(error => {
              console.error('Background video play error:', error);
              // Retry play as muted if initial play fails
              backgroundVideo.muted = true;
              return backgroundVideo.play();
            })
          ];

          await Promise.all(playPromises);
        } catch (error) {
          console.error('Error playing videos:', error);
        }
      };

      // Add error event listeners for better debugging
      templateVideo.addEventListener('error', (e) => {
        console.error('Template video error:', e);
      });
      
      backgroundVideo.addEventListener('error', (e) => {
        console.error('Background video error:', e);
      });

      // Play videos when metadata is loaded
      templateVideo.addEventListener('loadedmetadata', playVideos);
      backgroundVideo.addEventListener('loadedmetadata', playVideos);

      return () => {
        templateVideo.removeEventListener('loadedmetadata', playVideos);
        backgroundVideo.removeEventListener('loadedmetadata', playVideos);
        templateVideo.removeEventListener('error', () => {});
        backgroundVideo.removeEventListener('error', () => {});
      };
    }
  }, [templateVideoUrl, backgroundVideoUrl]);

  if (!templateVideoUrl && !backgroundVideoUrl) {
    return (
      <div className="bg-accent/10 rounded-lg p-4 border-2 border-dashed border-primary/20">
        <div className="aspect-[9/16] flex items-center justify-center">
          <p className="text-muted-foreground">
            Select a template and upload a background video to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden max-w-[240px] mx-auto">
      {/* Background Video Layer */}
      {backgroundVideoUrl && (
        <video
          ref={backgroundVideoRef}
          src={backgroundVideoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="auto"
        />
      )}
      
      {/* Template Video Layer (on top) */}
      {templateVideoUrl && (
        <video
          ref={templateVideoRef}
          src={templateVideoUrl}
          className="absolute inset-0 w-full h-full object-cover z-10"
          loop
          muted
          playsInline
          preload="auto"
        />
      )}
    </div>
  );
};