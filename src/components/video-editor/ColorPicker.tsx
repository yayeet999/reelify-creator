import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export const ColorPicker = ({
  color,
  onChange,
}: ColorPickerProps) => {
  return (
    <div className="flex items-center gap-4">
      <div 
        className="w-10 h-10 rounded-lg border border-gray-200"
        style={{ backgroundColor: color }}
      />
      <Input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="w-20 h-10 p-1"
      />
    </div>
  );
};