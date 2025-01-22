import { Card } from "@/components/ui/card";

interface ThumbnailCardProps {
  id: string;
  thumbnailUrl: string;
  videoUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

export const ThumbnailCard = ({
  id,
  thumbnailUrl,
  videoUrl,
  isSelected,
  onClick,
}: ThumbnailCardProps) => {
  return (
    <Card 
      key={id}
      className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${!videoUrl ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <img
        src={thumbnailUrl}
        alt={`${id} Video`}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors rounded-lg" />
    </Card>
  );
};