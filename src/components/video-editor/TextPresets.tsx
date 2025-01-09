import { Button } from "@/components/ui/button";

interface TextPresetProps {
  onSelect: (textColor: string, backgroundColor: string) => void;
}

export const TextPresets = ({ onSelect }: TextPresetProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant="outline"
        className="flex-1 h-12 relative overflow-hidden bg-accent-yellow"
        onClick={() => onSelect("#000000E6", "#FEF7CD")}
      >
        <span className="text-xs font-medium text-black">
          Black on Yellow
        </span>
      </Button>
    </div>
  );
};