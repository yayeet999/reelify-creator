import { useState } from "react";
import { Card } from "@/components/ui/card";

interface TemplateVideo {
  id: string;
  thumbnail: string;
  videoUrl: string;
}

const templateVideos: TemplateVideo[] = [
  {
    id: "template1",
    thumbnail: "/thumbnail14.jpg",
    videoUrl: "https://res.cloudinary.com/fornotreel/video/upload/v1737068279/forgreenscreen_kncjqw.webm"
  },
  {
    id: "template2",
    thumbnail: "/thumbnail82.jpg",
    videoUrl: "https://res.cloudinary.com/fornotreel/video/upload/v1737190459/url82_ex3e8z.webm"
  },
  {
    id: "template3",
    thumbnail: "/thumbnail83.jpg",
    videoUrl: "https://res.cloudinary.com/fornotreel/video/upload/v1737190469/url83_wtj6op.webm"
  },
  {
    id: "template4",
    thumbnail: "/thumbnail84.jpg",
    videoUrl: "https://res.cloudinary.com/fornotreel/video/upload/v1737190487/url84_izzzje.webm"
  }
];

interface VideoGalleryProps {
  onSelectVideo?: (video: TemplateVideo) => void;
}

export const VideoGallery = ({ onSelectVideo }: VideoGalleryProps) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleVideoSelect = (video: TemplateVideo) => {
    setSelectedVideo(video.id);
    if (onSelectVideo) {
      onSelectVideo(video);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templateVideos.map((video) => (
        <Card
          key={video.id}
          className={`relative cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
            selectedVideo === video.id ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => handleVideoSelect(video)}
        >
          <div className="aspect-video relative overflow-hidden rounded-lg">
            <img
              src={video.thumbnail}
              alt="Template video thumbnail"
              className="w-full h-full object-cover"
            />
          </div>
        </Card>
      ))}
    </div>
  );
};