import { useEffect, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface CombinedPreviewProps {
  templateVideoUrl?: string;
  backgroundVideoUrl?: string;
  audioUrl?: string;
  subtitlesText?: string;
}

export const CombinedPreview = ({ 
  templateVideoUrl, 
  backgroundVideoUrl,
  audioUrl,
  subtitlesText,
}: CombinedPreviewProps) => {
  const templateVideoRef = useRef<HTMLVideoElement>(null);
  const backgroundVideoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const [currentSubtitle, setCurrentSubtitle] = useState<string>("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // Split text into chunks of roughly 3-4 words
  const getSubtitleChunks = (text: string = "") => {
    const words = text.split(" ");
    const chunks: string[] = [];
    let currentChunk: string[] = [];

    words.forEach((word, index) => {
      currentChunk.push(word);
      if (currentChunk.length === 3 || index === words.length - 1) {
        chunks.push(currentChunk.join(" "));
        currentChunk = [];
      }
    });

    return chunks;
  };

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
          const playPromises = [
            templateVideo.play().catch(error => {
              console.error('Template video play error:', error);
              templateVideo.muted = true;
              return templateVideo.play();
            }),
            backgroundVideo.play().catch(error => {
              console.error('Background video play error:', error);
              backgroundVideo.muted = true;
              return backgroundVideo.play();
            })
          ];

          await Promise.all(playPromises);
        } catch (error) {
          console.error('Error playing media:', error);
          toast({
            title: "Playback Error",
            description: "There was an error playing the video preview",
            variant: "destructive",
          });
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
      templateVideo.addEventListener('loadedmetadata', playMedia);
      backgroundVideo.addEventListener('loadedmetadata', playMedia);

      return () => {
        templateVideo.removeEventListener('loadedmetadata', playMedia);
        backgroundVideo.removeEventListener('loadedmetadata', playMedia);
        templateVideo.removeEventListener('error', () => {});
        backgroundVideo.removeEventListener('error', () => {});
      };
    }
  }, [templateVideoUrl, backgroundVideoUrl, toast]);

  // Handle audio and subtitles
  useEffect(() => {
    if (!audioUrl || !subtitlesText) return;

    const audio = audioRef.current;
    if (!audio) return;

    const subtitleChunks = getSubtitleChunks(subtitlesText);
    const chunkDuration = audio.duration ? audio.duration / subtitleChunks.length : 2;

    const handleTimeUpdate = () => {
      if (!audio.duration) return;

      const currentTime = audio.currentTime;
      const chunkIndex = Math.floor(currentTime / chunkDuration);
      
      if (chunkIndex < subtitleChunks.length) {
        setCurrentSubtitle(subtitleChunks[chunkIndex]);
      } else {
        setCurrentSubtitle("");
      }
    };

    const handlePlay = () => setIsAudioPlaying(true);
    const handlePause = () => setIsAudioPlaying(false);
    const handleEnded = () => {
      setIsAudioPlaying(false);
      setCurrentSubtitle("");
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl, subtitlesText]);

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

      {/* Audio Element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          controls
          className="absolute bottom-0 left-0 right-0 z-20 w-full opacity-50 hover:opacity-100 transition-opacity"
        />
      )}

      {/* Subtitles Overlay */}
      {isAudioPlaying && currentSubtitle && (
        <div className="absolute bottom-14 left-0 right-0 z-30 p-2 text-center">
          <div className="bg-black/50 rounded-lg p-2 mx-2">
            <p className="text-white text-sm font-medium leading-snug">
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};