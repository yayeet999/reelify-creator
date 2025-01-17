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
            templateVideo.play().catch(error => {
              console.error('Template video play error:', error);
              return templateVideo.play();
            }),
            backgroundVideo.play().catch(error => {
              console.error('Background video play error:', error);
              return backgroundVideo.play();
            })
          ]);

          // If audio exists, sync it with videos
          if (audio) {
            audio.currentTime = 0;
            audio.muted = isAudioMuted;
            await audio.play().catch(error => {
              console.error('Audio play error:', error);
              toast({
                title: "Audio Playback Error",
                description: "There was an error playing the audio",
                variant: "destructive",
              });
            });
          }
        } catch (error) {
          console.error('Error playing media:', error);
          toast({
            title: "Playback Error",
            description: "There was an error playing the preview",
            variant: "destructive",
          });
        }
      };

      // Add video event listeners for better synchronization
      templateVideo.addEventListener('play', playMedia);
      templateVideo.addEventListener('pause', () => audio?.pause());
      backgroundVideo.addEventListener('play', playMedia);
      backgroundVideo.addEventListener('pause', () => audio?.pause());

      // Add error event listeners
      templateVideo.addEventListener('error', (e) => {
        console.error('Template video error:', e);
      });
      backgroundVideo.addEventListener('error', (e) => {
        console.error('Background video error:', e);
      });

      // Initial play when metadata is loaded
      templateVideo.addEventListener('loadedmetadata', playMedia);
      backgroundVideo.addEventListener('loadedmetadata', playMedia);

      return () => {
        templateVideo.removeEventListener('loadedmetadata', playMedia);
        backgroundVideo.removeEventListener('loadedmetadata', playMedia);
        templateVideo.removeEventListener('play', playMedia);
        templateVideo.removeEventListener('pause', () => audio?.pause());
        backgroundVideo.removeEventListener('play', playMedia);
        backgroundVideo.removeEventListener('pause', () => audio?.pause());
        templateVideo.removeEventListener('error', () => {});
        backgroundVideo.removeEventListener('error', () => {});
      };
    }
  }, [templateVideoUrl, backgroundVideoUrl, isAudioMuted, toast]);

  // Handle audio state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Add audio event listeners
      const handlePlay = () => setIsAudioPlaying(true);
      const handlePause = () => setIsAudioPlaying(false);
      const handleEnded = () => setIsAudioPlaying(false);
      const handleError = (e: Event) => {
        console.error('Audio error:', e);
        toast({
          title: "Audio Error",
          description: "There was an error playing the audio",
          variant: "destructive",
        });
      };

      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);

      // Set initial audio state
      audio.muted = isAudioMuted;

      return () => {
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [audioUrl, isAudioMuted, toast]);

  const toggleAudioMute = () => {
    const audio = audioRef.current;
    if (audio) {
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

      {/* Audio Element and Controls */}
      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            loop
            preload="auto"
          />
          <div className="absolute bottom-2 right-2 z-20">
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 bg-black/50 hover:bg-black/70"
              onClick={toggleAudioMute}
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