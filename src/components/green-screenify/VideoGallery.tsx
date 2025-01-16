import { useState } from "react";

export const VideoGallery = () => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <div className="bg-accent/10 rounded-lg p-4 border-2 border-dashed border-primary/20">
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          Template video selection coming soon
        </p>
      </div>
    </div>
  );
};