import { Card } from "@/components/ui/card";

interface VideoThumbnailProps {
  currentVideoUrl: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ currentVideoUrl, onVideoSelect }: VideoThumbnailProps) => {
  // This is our main video thumbnail
  const mainThumbnail = {
    id: 'elegant-salon',
    thumbnailUrl: '/Screenshot 2025-01-06 214011.jpg',
    videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4'
  };

  const handleThumbnailClick = (videoUrl: string) => {
    onVideoSelect(videoUrl);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <Card 
        className={`relative w-full max-w-[200px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
          currentVideoUrl === mainThumbnail.videoUrl ? 'ring-2 ring-primary' : ''
        }`}
        onClick={() => handleThumbnailClick(mainThumbnail.videoUrl)}
      >
        <img
          src={mainThumbnail.thumbnailUrl}
          alt="Elegant Salon Video"
          className="w-full h-full object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
      </Card>
      {/* Placeholder for future thumbnails */}
    </div>
  );
};