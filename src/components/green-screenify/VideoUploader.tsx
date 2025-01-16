import { Upload } from "lucide-react";

export const VideoUploader = () => {
  return (
    <div className="relative aspect-video bg-accent/10 rounded-lg border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
      <input
        type="file"
        accept=".mp4,.mov,.webm"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
        <Upload className="w-8 h-8 mb-2 text-primary/60" />
        <p className="text-sm font-medium text-primary">
          Choose Background Video
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          MP4, MOV, or WEBM format
        </p>
        <p className="text-xs text-muted-foreground">
          40 seconds max
        </p>
      </div>
    </div>
  );
};