import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { TextPositionSelector, type Position } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector, type AnimationType } from "@/components/video-editor/TextAnimationSelector";
import { TextPresets } from "@/components/video-editor/TextPresets";
import { TimelineControl } from "@/components/video-editor/TimelineControl";
import { VideoDownloader } from "@/components/video-editor/VideoDownloader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";

const FreeCreateContent = () => {
  // Video editor state
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4");
  const [textOverlay, setTextOverlay] = useState("");
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textSize, setTextSize] = useState([16]);
  const [position, setPosition] = useState<Position>("middle");
  const [animation, setAnimation] = useState<AnimationType>("none");
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Main Content Tabs */}
          <Tabs defaultValue="create" className="space-y-4">
            <TabsList>
              <TabsTrigger value="create">Create Content</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            {/* Create Content Tab */}
            <TabsContent value="create" className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Video Preview Area */}
                <Card className="xl:col-span-1 bg-accent-purple/20">
                  <CardContent className="space-y-4 pt-6">
                    <VideoPreview
                      videoUrl={currentVideoUrl}
                      text={textOverlay}
                      textColor={textColor}
                      textSize={textSize[0]}
                      position={position}
                      animation={animation}
                    />
                    <VideoThumbnailGrid 
                      currentVideoUrl={currentVideoUrl}
                      onVideoSelect={setCurrentVideoUrl}
                    />
                  </CardContent>
                </Card>

                {/* Content Configuration */}
                <Card className="xl:col-span-2">
                  <CardContent className="space-y-4 pt-6">
                    <div className="space-y-1.5">
                      <Label>Text Overlay ({100 - textOverlay.length} characters remaining)</Label>
                      <Input
                        placeholder="Add text overlay to your video"
                        value={textOverlay}
                        onChange={(e) => {
                          const text = e.target.value;
                          if (text.length <= 100) {
                            setTextOverlay(text);
                          }
                        }}
                        maxLength={100}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label>Text Position</Label>
                        <TextPositionSelector
                          position={position}
                          onChange={setPosition}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label>Animation</Label>
                        <TextAnimationSelector
                          animation={animation}
                          onChange={setAnimation}
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Timing</Label>
                      <TimelineControl
                        startTime={startTime}
                        duration={duration}
                        videoDuration={30}
                        onStartTimeChange={setStartTime}
                        onDurationChange={setDuration}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Text Size: {textSize}px</Label>
                      <Slider
                        value={textSize}
                        onValueChange={setTextSize}
                        min={12}
                        max={37}
                        step={1}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-20 h-10 p-1"
                        />
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          placeholder="#FFFFFF"
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <TextPresets 
                      onSelect={(textColor, backgroundColor) => {
                        setTextColor(textColor);
                      }}
                    />

                    <VideoDownloader 
                      textOverlay={textOverlay}
                      textColor={textColor}
                      textSize={textSize[0]}
                      textPosition={position}
                      animation={animation}
                      startTime={startTime}
                      duration={duration}
                      currentVideoUrl={currentVideoUrl}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-2">Starter Plan Features</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Advanced text overlays</li>
                    <li>• Custom video templates</li>
                    <li>• 1080p video quality</li>
                    <li>• Up to 60-second videos</li>
                  </ul>
                </div>

                <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm border border-purple-100">
                  <h3 className="text-lg font-semibold mb-2">Pro Features Available</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Premium text animations</li>
                    <li>• 4K video quality</li>
                    <li>• Unlimited video length</li>
                    <li>• Priority support</li>
                  </ul>
                </div>

                <div className="bg-blue-50/50 rounded-lg p-6 shadow-sm border border-blue-100">
                  <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• AI-powered editing</li>
                    <li>• Custom branding</li>
                    <li>• Team collaboration</li>
                    <li>• Analytics dashboard</li>
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreeCreateContent;