import { Card } from "@/components/ui/card";

interface VideoThumbnailProps {
  currentVideoUrl: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ currentVideoUrl, onVideoSelect }: VideoThumbnailProps) => {
  // These are our video thumbnails
  const thumbnails = [
    {
      id: 'elegant-salon',
      thumbnailUrl: '/thumbnail1.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4'
    },
    {
      id: 'thumbnail-2',
      thumbnailUrl: '/thumbnail2.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736233233/url2_xr10ft.mp4'
    },
    {
      id: 'thumbnail-3',
      thumbnailUrl: '/thumbnail3.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736234861/url3_iyjjbr.mp4'
    },
    {
      id: 'thumbnail-4',
      thumbnailUrl: '/thumbnail4.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236300/url4_muddnk.mp4'
    },
    {
      id: 'thumbnail-5',
      thumbnailUrl: '/thumbnail5.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236303/url5_xgk1z3.mp4'
    },
    {
      id: 'thumbnail-6',
      thumbnailUrl: '/thumbnail6.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236299/url6_ktqlxz.mp4'
    },
    {
      id: 'thumbnail-7',
      thumbnailUrl: '/thumbnail7.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236299/url7_gchodf.mp4'
    },
    {
      id: 'thumbnail-8',
      thumbnailUrl: '/thumbnail8.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736237222/url8_zra4ez.mp4'
    },
    {
      id: 'thumbnail-9',
      thumbnailUrl: '/thumbnail9.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736238820/url9_d9aryr.mp4'
    },
    {
      id: 'thumbnail-10',
      thumbnailUrl: '/thumbnail10.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736238820/url10_foeiqh.mp4'
    },
    {
      id: 'thumbnail-11',
      thumbnailUrl: '/thumbnail11.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240943/url11_oiht71.mp4'
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