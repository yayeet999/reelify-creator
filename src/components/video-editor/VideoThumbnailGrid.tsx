import { Tabs, TabsContent } from "@/components/ui/tabs";
import { CategoryTabs } from "./components/CategoryTabs";
import { ThumbnailGrid } from "./components/ThumbnailGrid";
import { 
  thumbnails, 
  beautyThumbnails, 
  lifestyleThumbnails, 
  customThumbnails 
} from "./data/thumbnailData";

interface VideoThumbnailProps {
  currentVideoUrl?: string;
  onVideoSelect: (videoUrl: string) => void;
}

export const VideoThumbnailGrid = ({ 
  currentVideoUrl, 
  onVideoSelect 
}: VideoThumbnailProps) => {
  const categories = ['beauty', 'lifestyle', 'custom'];

  return (
    <Tabs defaultValue="all" className="w-full">
      <CategoryTabs categories={categories} />

      <TabsContent value="all">
        <ThumbnailGrid
          thumbnails={thumbnails}
          currentVideoUrl={currentVideoUrl}
          onVideoSelect={onVideoSelect}
        />
      </TabsContent>

      <TabsContent value="beauty">
        <ThumbnailGrid
          thumbnails={beautyThumbnails}
          currentVideoUrl={currentVideoUrl}
          onVideoSelect={onVideoSelect}
        />
      </TabsContent>

      <TabsContent value="lifestyle">
        <ThumbnailGrid
          thumbnails={lifestyleThumbnails}
          currentVideoUrl={currentVideoUrl}
          onVideoSelect={onVideoSelect}
        />
      </TabsContent>

      <TabsContent value="custom">
        <ThumbnailGrid
          thumbnails={customThumbnails}
          currentVideoUrl={currentVideoUrl}
          onVideoSelect={onVideoSelect}
        />
      </TabsContent>
    </Tabs>
  );
};