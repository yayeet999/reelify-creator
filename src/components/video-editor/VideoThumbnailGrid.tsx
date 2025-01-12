import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VideoThumbnailProps {
  currentVideoUrl: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ currentVideoUrl, onVideoSelect }: VideoThumbnailProps) => {
  // These are our video thumbnails - keeping them all in the "All" tab
  const thumbnails = [
    {
      id: 'elegant-salon',
      thumbnailUrl: '/thumbnail1.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-2',
      thumbnailUrl: '/thumbnail2.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736233233/url2_xr10ft.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-3',
      thumbnailUrl: '/thumbnail3.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736234861/url3_iyjjbr.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-4',
      thumbnailUrl: '/thumbnail4.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236300/url4_muddnk.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-5',
      thumbnailUrl: '/thumbnail5.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236303/url5_xgk1z3.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-6',
      thumbnailUrl: '/thumbnail6.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236299/url6_ktqlxz.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-7',
      thumbnailUrl: '/thumbnail7.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736236299/url7_gchodf.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-8',
      thumbnailUrl: '/thumbnail8.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736237222/url8_zra4ez.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-9',
      thumbnailUrl: '/thumbnail9.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736238820/url9_d9aryr.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-10',
      thumbnailUrl: '/thumbnail10.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736238820/url10_foeiqh.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-11',
      thumbnailUrl: '/thumbnail11.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240943/url11_oiht71.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-12',
      thumbnailUrl: '/thumbnail12.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240943/url12_xkwu9f.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-13',
      thumbnailUrl: '/thumbnail13.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736240946/url13_kgyxya.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-15',
      thumbnailUrl: '/thumbnail15.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690481/url15_qdhzmr.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-16',
      thumbnailUrl: '/thumbnail16.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url16_n2q85r.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-17',
      thumbnailUrl: '/thumbnail17.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url17_holjst.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-18',
      thumbnailUrl: '/thumbnail18.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url18_zugolq.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-19',
      thumbnailUrl: '/thumbnail19.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url19_hb0pj1.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-20',
      thumbnailUrl: '/thumbnail20.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690480/url20_bqb4kj.mp4',
      category: 'all'
    },
    {
      id: 'thumbnail-21',
      thumbnailUrl: '/thumbnail21.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736690894/url21_s6mekx.mp4',
      category: 'all'
    }
  ];

  // New beauty thumbnails
  const beautyThumbnails = [
    {
      id: 'thumbnail-22',
      thumbnailUrl: '/thumbnail22.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691225/url22_mrgosa.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-23',
      thumbnailUrl: '/thumbnail23.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691224/url23_vyuifh.mp4',
      category: 'beauty'
    },
    {
      id: 'thumbnail-24',
      thumbnailUrl: '/thumbnail24.jpg',
      videoUrl: 'https://res.cloudinary.com/fornotreel/video/upload/q_auto:good/v1736691222/url24_ugk4br.mp4',
      category: 'beauty'
    }
  ];

  const handleThumbnailClick = (videoUrl: string) => {
    if (videoUrl) {
      onVideoSelect(videoUrl);
    }
  };

  // Define categories for the tabs
  const categories = ['beauty', 'lifestyle'];

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="w-full mb-4">
        <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
        {categories.map(category => (
          <TabsTrigger key={category} value={category} className="flex-1 capitalize">
            {category}
          </TabsTrigger>
        ))}
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
          {beautyThumbnails.map((thumbnail) => (
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
          {/* Empty grid for now - ready for new thumbnails */}
        </div>
      </TabsContent>
    </Tabs>
  );
};