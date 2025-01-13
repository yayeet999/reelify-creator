import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoThumbnailProps {
  currentVideoUrl: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ currentVideoUrl, onVideoSelect }: VideoThumbnailProps) => {
  // These are our video thumbnails for templates
  const thumbnails = [
    {
      id: 'thumbnail-27',
      thumbnailUrl: '/thumbnail27.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691223/url27_hcgntu.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-28',
      thumbnailUrl: '/thumbnail28.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691223/url28_ayuexa.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-29',
      thumbnailUrl: '/thumbnail29.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691221/url29_ncq7js.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-30',
      thumbnailUrl: '/thumbnail30.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url30_bs7jhg.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-31',
      thumbnailUrl: '/thumbnail31.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url31_dykbkf.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-32',
      thumbnailUrl: '/thumbnail32.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749548/url32_dmtftn.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-33',
      thumbnailUrl: '/thumbnail33.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url33_ijqjfi.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-34',
      thumbnailUrl: '/thumbnail34.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749548/url34_gor3wq.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-35',
      thumbnailUrl: '/thumbnail35.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749550/url35_sexqnp.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-36',
      thumbnailUrl: '/thumbnail36.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749547/url36_aj3ydc.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-37',
      thumbnailUrl: '/thumbnail37.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749547/url37_nhqptu.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-38',
      thumbnailUrl: '/thumbnail38.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749547/url38_zfupom.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-39',
      thumbnailUrl: '/thumbnail39.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749546/url39_oja0o1.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-40',
      thumbnailUrl: '/thumbnail40.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749546/url40_uvnt3l.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-41',
      thumbnailUrl: '/thumbnail41.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736749982/url41_u4l9hv.mp4',
      category: 'beauty'
    }
  ];

  const handleThumbnailClick = (videoUrl: string) => {
    if (videoUrl) {
      onVideoSelect(videoUrl);
    }
  };

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="all">1/3</TabsTrigger>
        <TabsTrigger value="beauty">2/3</TabsTrigger>
        <TabsTrigger value="lifestyle">3/3</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
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
      </TabsContent>
      <TabsContent value="beauty">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {thumbnails
            .filter((thumbnail) => thumbnail.category === 'beauty')
            .map((thumbnail) => (
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
      </TabsContent>
      <TabsContent value="lifestyle">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {thumbnails
            .filter((thumbnail) => thumbnail.category === 'lifestyle')
            .map((thumbnail) => (
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
      </TabsContent>
    </Tabs>
  );
};
