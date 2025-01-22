import { ArrowUp, ArrowDown, AlignCenter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Position = "top" | "middle" | "bottom";

interface TextPositionSelectorProps {
  position: Position;
  onChange: (position: Position) => void;
  className?: string;
}

export const TextPositionSelector = ({
  position,
  onChange,
  className,
}: TextPositionSelectorProps) => {
  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      <Button
        variant={position === "top" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("top")}
        className="w-12 h-12 transition-colors"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
      <Button
        variant={position === "middle" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("middle")}
        className="w-12 h-12 transition-colors"
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant={position === "bottom" ? "default" : "outline"}
        size="icon"
        onClick={() => onChange("bottom")}
        className="w-12 h-12 transition-colors"
      >
        <ArrowDown className="h-4 w-4" />
      </Button>
    </div>
  );
};