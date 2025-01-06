import { ArrowUp, ArrowDown, AlignCenter } from "lucide-react";
import { Button } from "@/components/ui/button";

export type Position = "top" | "middle" | "bottom";

interface TextPositionSelectorProps {
  position: Position;
  onChange: (position: Position) => void;
}

export const TextPositionSelector = ({
  position,
  onChange,
}: TextPositionSelectorProps) => {
  return (
    <div className="flex gap-2 justify-center">
      <Button
        variant={position === "top" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("top")}
        className="w-12 h-12"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant={position === "middle" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("middle")}
        className="w-12 h-12"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant={position === "bottom" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("bottom")}
        className="w-12 h-12"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
};