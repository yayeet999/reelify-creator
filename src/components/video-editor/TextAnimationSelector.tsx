import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type AnimationType = "none" | "fade" | "slide" | "scale";

interface TextAnimationSelectorProps {
  animation: AnimationType;
  onChange: (animation: AnimationType) => void;
  className?: string;
}

export const TextAnimationSelector = ({
  animation,
  onChange,
  className,
}: TextAnimationSelectorProps) => {
  return (
    <RadioGroup
      value={animation}
      onValueChange={(value) => onChange(value as AnimationType)}
      className={cn("grid grid-cols-2 gap-4", className)}
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="none" id="none" />
        <Label htmlFor="none">Static</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="fade" id="fade" />
        <Label htmlFor="fade">Fade In</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="slide" id="slide" />
        <Label htmlFor="slide">Slide Up</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="scale" id="scale" />
        <Label htmlFor="scale">Scale In</Label>
      </div>
    </RadioGroup>
  );
};