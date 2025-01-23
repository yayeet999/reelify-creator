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
}

export const TimelineControl = ({
  videoRef,
  startTime,
  duration,
  videoDuration,
  onStartTimeChange,
  onDurationChange,
}: TimelineControlProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [actualDuration, setActualDuration] = useState(videoDuration);
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
      setCurrentTime(0);
      setActualDuration(video.duration || videoDuration);
      video.currentTime = startTime;
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [videoRef, startTime, videoDuration]);

  // Update video position when startTime changes
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = startTime;
    }
  }, [startTime, videoRef]);

  const handleTimelineChange = (values: number[]) => {
    const time = values[0];
    if (videoRef.current) {
      isSeekingRef.current = true;
      videoRef.current.currentTime = time;
      setCurrentTime(time);
      isSeekingRef.current = false;
    }
  };

  const handleStartTimeChange = (values: number[]) => {
    const newStartTime = values[0];
    onStartTimeChange(newStartTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newStartTime;
    }
  };

  const handleDurationChange = (values: number[]) => {
    const newDuration = values[0];
    onDurationChange(newDuration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Main Timeline */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(actualDuration)}</span>
        </div>
        <Slider
          value={[currentTime]}
          max={actualDuration}
          step={0.1}
          onValueChange={handleTimelineChange}
          className="w-full"
        />
      </div>

      {/* Start Time and Duration Controls */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs">Start Time: {formatTime(startTime)}</Label>
          <Slider
            value={[startTime]}
            onValueChange={handleStartTimeChange}
            max={actualDuration - duration}
            step={0.1}
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Duration: {formatTime(duration)}</Label>
          <Slider
            value={[duration]}
            onValueChange={handleDurationChange}
            min={1}
            max={Math.min(30, actualDuration - startTime)}
            step={0.1}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};