import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface TimelineControlProps {
  startTime: number;
  duration: number;
  videoDuration: number;
  onStartTimeChange: (value: number) => void;
  onDurationChange: (value: number) => void;
}

export const ProTimelineControl = ({
  startTime,
  duration,
  videoDuration,
  onStartTimeChange,
  onDurationChange,
}: TimelineControlProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Start Time: {startTime}s</Label>
        <Slider
          value={[startTime]}
          onValueChange={([value]) => onStartTimeChange(value)}
          max={videoDuration - duration}
          step={1}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Duration: {duration}s</Label>
        <Slider
          value={[duration]}
          onValueChange={([value]) => onDurationChange(value)}
          min={1}
          max={videoDuration - startTime}
          step={1}
        />
      </div>
    </div>
  );
};