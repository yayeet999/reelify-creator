import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface CombinedPreviewProps {
  templateVideoUrl?: string;
  backgroundVideoUrl?: string;
  audioUrl?: string;
}

export const CombinedPreview = ({ 
  templateVideoUrl, 
  backgroundVideoUrl,
  audioUrl 
}: CombinedPreviewProps) => {
  const templateVideoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const { toast } = useToast();

  // Handle video playback and synchronization
  useEffect(() => {
    const templateVideo = templateVideoRef.current;
    const backgroundVideo = backgroundVideoRef.current;
    const audio = audioRef.current;

    if (templateVideo && backgroundVideo) {
      const playMedia = async () => {
        try {
          // Set initial volume to 0 and muted state to ensure autoplay works
          templateVideo.volume = 0;
          backgroundVideo.volume = 0;
          
          // Ensure videos are muted initially for autoplay
          templateVideo.muted = true;
          backgroundVideo.muted = true;

          // Play both videos
          await Promise.all([
            templateVideo.play(),
            backgroundVideo.play()
          ]);

          // If audio exists and is loaded, sync it with videos
          if (audio && isAudioLoaded) {
            audio.currentTime = 0;
            audio.muted = isAudioMuted;
            try {
              await audio.play();
            } catch (error) {
              console.error('Audio play error:', error);
              toast({
                title: "Audio Playback Error",
                description: "There was an error playing the audio. Please try unmuting or refreshing.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error('Error playing media:', error);
          toast({
            title: "Playback Error",
            description: "There was an error playing the preview. Please refresh and try again.",
            variant: "destructive",
          });
        }
      };

      // Add video event listeners for better synchronization
      templateVideo.addEventListener('play', playMedia);
      templateVideo.addEventListener('pause', () => {
        if (audio && isAudioLoaded) {
          audio.pause();
        }
      });
      backgroundVideo.addEventListener('play', playMedia);
      backgroundVideo.addEventListener('pause', () => {
        if (audio && isAudioLoaded) {
          audio.pause();
        }
      });

      // Initial play when metadata is loaded
      const handleMetadata = () => {
        if (templateVideo.readyState >= 2 && backgroundVideo.readyState >= 2) {
          playMedia();
        }
      };

      templateVideo.addEventListener('loadedmetadata', handleMetadata);
      backgroundVideo.addEventListener('loadedmetadata', handleMetadata);

      return () => {
        templateVideo.removeEventListener('loadedmetadata', handleMetadata);
        backgroundVideo.removeEventListener('loadedmetadata', handleMetadata);
        templateVideo.removeEventListener('play', playMedia);
        templateVideo.removeEventListener('pause', () => {});
        backgroundVideo.removeEventListener('play', playMedia);
        backgroundVideo.removeEventListener('pause', () => {});
      };
    }
  }, [templateVideoUrl, backgroundVideoUrl, isAudioMuted, isAudioLoaded, toast]);

  // Handle audio state changes and loading
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      setIsAudioLoaded(false);
      
      // Configure audio element
      audio.crossOrigin = "anonymous";
      audio.preload = "auto";

      // Add audio event listeners
      const handlePlay = () => setIsAudioPlaying(true);
      const handlePause = () => setIsAudioPlaying(false);
      const handleEnded = () => setIsAudioPlaying(false);
      const handleLoaded = () => setIsAudioLoaded(true);
      const handleError = (e: Event) => {
        console.error('Audio error:', e);
        setIsAudioLoaded(false);
        toast({
          title: "Audio Error",
          description: "There was an error loading the audio. Please try again.",
          variant: "destructive",
        });
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('loadeddata', handleLoaded);
      audio.addEventListener('error', handleError);

      // Set initial audio state
      audio.muted = isAudioMuted;

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('loadeddata', handleLoaded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioUrl, isAudioMuted, toast]);

  const toggleAudioMute = () => {
    const audio = audioRef.current;
    if (audio && isAudioLoaded) {
      const newMutedState = !isAudioMuted;
      audio.muted = newMutedState;
      setIsAudioMuted(newMutedState);
      
      toast({
        title: newMutedState ? "Audio Muted" : "Audio Unmuted",
        description: newMutedState ? "Audio is now muted" : "Audio is now playing",
      });
    }
  };

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
          crossOrigin="anonymous"
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
          crossOrigin="anonymous"
        />
      )}

      {/* Audio Element and Controls */}
      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            loop
            preload="auto"
            crossOrigin="anonymous"
          />
          <div className="absolute bottom-2 right-2 z-20">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-black/50 hover:bg-black/70"
              onClick={toggleAudioMute}
              disabled={!isAudioLoaded}
            >
              {isAudioMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};