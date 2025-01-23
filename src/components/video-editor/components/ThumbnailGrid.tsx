import { ThumbnailCard } from "./ThumbnailCard";

interface ThumbnailGridProps {
  thumbnails: Array<{
    id: string;
    thumbnailUrl: string;
    videoUrl: string;
  }>;
  currentVideoUrl?: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const ThumbnailGrid = ({
  thumbnails,
  currentVideoUrl,
  onVideoSelect,
}: ThumbnailGridProps) => {
  return (
    <div className="grid grid-cols-8 gap-2 p-2">
      {thumbnails.map((thumbnail) => (
        <ThumbnailCard
          key={thumbnail.id}
          id={thumbnail.id}
          thumbnailUrl={thumbnail.thumbnailUrl}
          videoUrl={thumbnail.videoUrl}
          isSelected={currentVideoUrl === thumbnail.videoUrl}
          onClick={() => onVideoSelect(thumbnail.videoUrl)}
        />
      ))}
    </div>
  );
};