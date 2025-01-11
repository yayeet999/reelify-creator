import { Card } from "@/components/ui/card";

interface VideoThumbnailProps {
  currentVideoUrl: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ currentVideoUrl, onVideoSelect }: VideoThumbnailProps) => {
  // These are our video thumbnails for green screen templates
  const thumbnails = [
    {
      id: 'green-screen-1',
      thumbnailUrl: '/thumbnail14.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/v1736577684/green1_1080p_ftqbm8.mp4'
    }
  ];

  const handleThumbnailClick = (videoUrl: string) => {
    if (videoUrl) {
      onVideoSelect(videoUrl);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {thumbnails.map((thumbnail) => (
        <Card 
          key={thumbnail.id}
          className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
            currentVideoUrl === thumbnail.videoUrl ? 'ring-2 ring-primary' : ''
          } ${!thumbnail.videoUrl ? 'opacity-50' : ''}`}
          onClick={() => handleThumbnailClick(thumbnail.videoUrl)}
        >
          <img
            src={thumbnail.thumbnailUrl}
            alt={`${thumbnail.id} Video`}
            className="w-full h-full object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
        </Card>
      ))}
    </div>
  );
};