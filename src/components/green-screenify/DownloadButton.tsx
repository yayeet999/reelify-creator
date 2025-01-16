import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface DownloadButtonProps {
  disabled?: boolean;
  onClick?: () => void;
}

export const DownloadButton = ({ disabled, onClick }: DownloadButtonProps) => {
  return (
    <Button
      className="w-full bg-primary hover:bg-primary/90"
      size="lg"
      disabled={disabled}
      onClick={onClick}
    >
      <Download className="mr-2 h-4 w-4" />
      Download Combined Video
    </Button>
  );
};