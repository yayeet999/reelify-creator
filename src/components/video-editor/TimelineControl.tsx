import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TimelineControlProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  startTime: number;
  duration: number;
  videoDuration: number;
  onStartTimeChange: (value: number) => void;
  onDurationChange: (value: number) => void;
  onTimeUpdate?: (time: number) => void;
}

export const TimelineControl = ({
  videoRef,
  startTime,
  duration,
  videoDuration,
  onStartTimeChange,
  onDurationChange,
  onTimeUpdate,
}: TimelineControlProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const isSeekingRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime);
        if (onTimeUpdate) {
          onTimeUpdate(video.currentTime);
        }
      }
    };

    const handleLoadedMetadata = () => {
      // Set initial time to 0 when video loads
      setCurrentTime(0);
      if (onTimeUpdate) {
        onTimeUpdate(0);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef, onTimeUpdate]);

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
    <div className="space-y-6">
      {/* Current Time Display */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(videoDuration)}</span>
        </div>
        <Slider
          value={[currentTime]}
          max={videoDuration}
          step={0.1}
          onValueChange={handleSliderChange}
          className="w-full"
        />
      </div>

      {/* Start Time Control */}
      <div className="space-y-2">
        <Label>Start Time: {startTime.toFixed(1)}s</Label>
        <Slider
          value={[startTime]}
          onValueChange={([value]) => onStartTimeChange(value)}
          max={videoDuration - duration}
          step={0.1}
        />
      </div>

      {/* Duration Control */}
      <div className="space-y-2">
        <Label>Duration: {duration.toFixed(1)}s</Label>
        <Slider
          value={[duration]}
          onValueChange={([value]) => onDurationChange(value)}
          min={0.5}
          max={videoDuration - startTime}
          step={0.1}
        />
      </div>
    </div>
  );
};