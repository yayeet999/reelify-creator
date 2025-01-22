import { Button } from "@/components/ui/button";

interface TextPresetProps {
  onSelect: (textColor: string, backgroundColor: string) => void;
}

export const TextPresets = ({ onSelect }: TextPresetProps) => {
  const presets = [
    { text: "#FFFFFF", background: "#000000E6", label: "White on Black" },
    { text: "#000000E6", background: "#FFFFFF", label: "Black on White" },
    { text: "#FFFFFF", background: "#E5DEFF", label: "White on Purple" },
    { text: "#FFFFFF", background: "#FF4D4D", label: "White on Red" },
    { text: "#000000", background: "#FFD700", label: "Black on Gold" },
    { text: "#FFFFFF", background: "#4CAF50", label: "White on Green" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
      {presets.map((preset) => (
        <Button
          key={preset.label}
          variant="outline"
          className="h-12 relative overflow-hidden"
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