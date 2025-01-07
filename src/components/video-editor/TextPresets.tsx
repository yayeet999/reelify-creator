import { Button } from "@/components/ui/button";

interface TextPresetProps {
  onSelect: (textColor: string, backgroundColor: string) => void;
}

export const TextPresets = ({ onSelect }: TextPresetProps) => {
  const presets = [
    { text: "#FFFFFF", background: "#000000E6", label: "White on Black" },
    { text: "#000000E6", background: "#FFFFFF", label: "Black on White" },
    { text: "#FFFFFF", background: "#E5DEFF", label: "White on Purple" },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          className="flex-1 h-12 relative overflow-hidden"
          style={{ backgroundColor: preset.background }}
          onClick={() => onSelect(preset.text, preset.background)}
        >
          <span
            className="text-xs font-medium"
            style={{ color: preset.text }}
          >
            {preset.label}
          </span>
        </Button>
      ))}
    </div>
  );
};