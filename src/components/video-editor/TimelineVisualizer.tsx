import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";

interface TimelineVisualizerProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  onTimeUpdate?: (time: number) => void;
}

export const TimelineVisualizer = ({ videoRef, onTimeUpdate }: TimelineVisualizerProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef]);

  const handleSliderChange = (values: number[]) => {
    const time = values[0];
    if (videoRef.current) {
      isSeekingRef.current = true;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      if (onTimeUpdate) {
        onTimeUpdate(time);
      }
      isSeekingRef.current = false;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <Slider
        value={[currentTime]}
        max={duration}
        step={0.1}
        onValueChange={handleSliderChange}
        className="w-full"
      />
    </div>
  );
};