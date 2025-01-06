import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Video, Type, Image, Palette, Save, Play } from "lucide-react";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const CreateContent = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [textOverlay, setTextOverlay] = useState("");
  const [textSize, setTextSize] = useState([16]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Initialize Cloudinary with the provided credentials
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'fornotreel'
    }
  });

  // Use the provided video URL
  const videoUrl = "https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4";

  return (
    <div className="container mx-auto p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Create Content</h1>
          <p className="text-muted-foreground mt-1">
            Create and customize your short-form video content
          </p>
        </div>
        <Button className="gap-2" size="lg">
          <Save className="w-4 h-4" />
          Save Content
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Thumbnail Area */}
        <Card className="xl:col-span-1 bg-accent-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="w-5 h-5" />
              <span>Video Thumbnail</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div 
              className="max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden group cursor-pointer relative"
              onClick={() => setIsVideoOpen(true)}
            >
              {/* Thumbnail Image (first frame of video) */}
              <video 
                className="w-full h-full rounded-lg object-cover"
                src={videoUrl}
                muted
                playsInline
              />
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-12 h-12 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Configuration */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Content Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList className="grid grid-cols-3 gap-4">
                <TabsTrigger value="details" className="gap-2">
                  <Type className="w-4 h-4" />
                  Details
                </TabsTrigger>
                <TabsTrigger value="text" className="gap-2">
                  <Type className="w-4 h-4" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="style" className="gap-2">
                  <Palette className="w-4 h-4" />
                  Style
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    placeholder="Enter content title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Enter content description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </TabsContent>

              <TabsContent value="text" className="space-y-4">
                <div className="space-y-2">
                  <Label>Text Overlay</Label>
                  <Textarea
                    placeholder="Add text overlay to your video"
                    value={textOverlay}
                    onChange={(e) => setTextOverlay(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Text Size: {textSize}px</Label>
                  <Slider
                    value={textSize}
                    onValueChange={setTextSize}
                    min={12}
                    max={72}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
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
              </TabsContent>

              <TabsContent value="style" className="space-y-4">
                <div className="grid gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Additional styling options will be available soon.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Video Player Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="max-w-4xl">
          <div className="aspect-[9/16] w-full">
            <video 
              className="w-full h-full rounded-lg object-cover"
              controls
              autoPlay
              src={videoUrl}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateContent;