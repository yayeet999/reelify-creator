import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface TimelineControlProps {
  startTime: number;
  duration: number;
  videoDuration: number;
  onStartTimeChange: (value: number) => void;
  onDurationChange: (value: number) => void;
}

export const TimelineControl = ({
  startTime,
  duration,
  videoDuration,
  onStartTimeChange,
  onDurationChange,
}: TimelineControlProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Start Time: {startTime.toFixed(1)}s</Label>
        <Slider
          value={[startTime]}
          onValueChange={([value]) => onStartTimeChange(value)}
          max={10.0}
          step={0.1}
        />
      </div>
      <div className="hidden space-y-2">
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