import { Button } from "@/components/ui/button";

interface TextPresetProps {
  onSelect: (textColor: string, backgroundColor: string) => void;
}

export const FreeTextPresets = ({ onSelect }: TextPresetProps) => {
  return (
    <div className="flex gap-2 mb-4">
      {/* No presets for free version */}
    </div>
  );
};