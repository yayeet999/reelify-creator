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
      className={`relative w-[60px] aspect-square cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
        isSelected ? 'ring-2 ring-primary' : ''
      } ${!videoUrl ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <img
        src={thumbnailUrl}
        alt={`${id} Video`}
        className="w-full h-full object-cover rounded-lg"
      />
      <div className="absolute inset-0 bg-black/10 hover:bg-black/5 transition-colors rounded-lg" />
    </Card>
  );
};