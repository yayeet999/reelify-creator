import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export type AnimationType = "none" | "fade";

interface TextAnimationSelectorProps {
  animation: AnimationType;
  onChange: (animation: AnimationType) => void;
}

export const TextAnimationSelector = ({
  animation,
  onChange,
}: TextAnimationSelectorProps) => {
  return (
    <RadioGroup
      value={animation}
      onValueChange={(value) => onChange(value as AnimationType)}
      className="grid grid-cols-2 gap-4"
    >
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="none" id="none" />
        <Label htmlFor="none">Static</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="fade" id="fade" />
        <Label htmlFor="fade">Fade In</Label>
      </div>
    </RadioGroup>
  );
};