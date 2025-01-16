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
          await Promise.all([
            templateVideo.play(),
            backgroundVideo.play()
          ]);
        } catch (error) {
          console.error('Error playing videos:', error);
        }
      };

      templateVideo.addEventListener('loadedmetadata', playVideos);
      backgroundVideo.addEventListener('loadedmetadata', playVideos);

      return () => {
        templateVideo.removeEventListener('loadedmetadata', playVideos);
        backgroundVideo.removeEventListener('loadedmetadata', playVideos);
      };
    }
  }, [templateVideoUrl, backgroundVideoUrl]);

  if (!templateVideoUrl && !backgroundVideoUrl) {
    return (
      <div className="bg-accent/10 rounded-lg p-4 border-2 border-dashed border-primary/20">
        <div className="aspect-video flex items-center justify-center">
          <p className="text-muted-foreground">
            Select a template and upload a background video to see the preview
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {/* Background Video Layer */}
      {backgroundVideoUrl && (
        <video
          ref={backgroundVideoRef}
          src={backgroundVideoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          muted
          playsInline
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
        />
      )}
    </div>
  );
};