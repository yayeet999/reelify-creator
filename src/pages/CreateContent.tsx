import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Video, Loader2, ArrowLeft } from "lucide-react";
import { TextPositionSelector } from "@/components/video-editor/TextPositionSelector";
import { TextAnimationSelector, type AnimationType } from "@/components/video-editor/TextAnimationSelector";
import { TimelineControl } from "@/components/video-editor/TimelineControl";
import { VideoPreview } from "@/components/video-editor/VideoPreview";
import { CombinedVideoPreview } from "@/components/video-editor/CombinedVideoPreview";
import { FreeVideoDownloader } from "@/components/video-editor/FreeVideoDownloader";
import { VideoDownloader } from "@/components/video-editor/VideoDownloader";
import { VideoThumbnailGrid } from "@/components/video-editor/VideoThumbnailGrid";
import { VideoUploadSection } from "@/components/video-editor/VideoUploadSection";
import { useSubscriptionGuard } from "@/hooks/use-subscription-guard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SavedHook } from "@/integrations/supabase/types/saved-hooks";

const CreateContent = () => {
  const { isLoading, isAuthorized } = useSubscriptionGuard("starter");
  const [textOverlay, setTextOverlay] = useState("");
  const [textSize, setTextSize] = useState([16]);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [textPosition, setTextPosition] = useState<"top" | "middle" | "bottom">("middle");
  const [animation, setAnimation] = useState<AnimationType>("none");
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [currentVideoUrl, setCurrentVideoUrl] = useState("https://res.cloudinary.com/fornotreel/video/upload/v1736199309/20250105_1242_Elegant_Salon_Serenity_storyboard_01jgvwd77yea4aj4c691mqbypv_ier4c2.mp4");
  const [savedHooks, setSavedHooks] = useState<SavedHook[]>([]);
  const [isTemplateSelected, setIsTemplateSelected] = useState(false);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedVideoPublicId, setUploadedVideoPublicId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedHooks = async () => {
      const { data, error } = await supabase
        .from('saved_hooks')
        .select('id, hook_text, product_name');
      
      if (error) {
        console.error('Error fetching saved hooks:', error);
        return;
      }

      setSavedHooks(data || []);
    };

    fetchSavedHooks();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  const handleTextOverlayChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= 100) {
      setTextOverlay(text);
    }
  };

  const handleSavedHookSelect = (hookId: string) => {
    const selectedHook = savedHooks.find(hook => hook.id === hookId);
    if (selectedHook) {
      setTextOverlay(selectedHook.hook_text);
    }
  };

  const handleVideoUpload = (url: string, publicId: string) => {
    setUploadedVideoUrl(url);
    setUploadedVideoPublicId(publicId);
  };

  const handleProceedWithTemplate = () => {
    setIsTemplateSelected(true);
  };

  const handleGoBackToTemplates = () => {
    setIsTemplateSelected(false);
    setUploadedVideoUrl(null);
    setUploadedVideoPublicId(null);
  };

  return (
    <div className="container mx-auto p-6 animate-fade-up">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary">Create Content</h1>
        <p className="text-muted-foreground mt-1">
          Create and customize your short-form video content
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Video Preview Area */}
        <Card className="xl:col-span-1 bg-accent-purple/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              <span>Video Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {uploadedVideoUrl ? (
              <CombinedVideoPreview
                templateVideoUrl={currentVideoUrl}
                uploadedVideoUrl={uploadedVideoUrl}
                text={textOverlay}
                textColor={textColor}
                textSize={textSize[0]}
                position={textPosition}
                animation={animation}
              />
            ) : (
              <VideoPreview
                videoUrl={currentVideoUrl}
                text={textOverlay}
                textColor={textColor}
                textSize={textSize[0]}
                position={textPosition}
                animation={animation}
              />
            )}
            
            {/* Show selected template thumbnail when isTemplateSelected is true */}
            {isTemplateSelected ? (
              <div className="grid grid-cols-1 gap-4">
                <Card 
                  className={`relative w-full max-w-[80px] md:max-w-[100px] aspect-square cursor-pointer transition-all ring-2 ring-primary`}
                >
                  <img
                    src={`/thumbnail${currentVideoUrl.match(/url(\d+)/)?.[1] || '1'}.jpg`}
                    alt="Selected Template"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg" />
                </Card>
              </div>
            ) : (
              <VideoThumbnailGrid 
                currentVideoUrl={currentVideoUrl}
                onVideoSelect={setCurrentVideoUrl}
              />
            )}
          </CardContent>
        </Card>

        {/* Content Configuration */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle>Text Overlay Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Select from Saved Hooks</Label>
              <Select onValueChange={handleSavedHookSelect}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a saved hook..." />
                </SelectTrigger>
                <SelectContent>
                  {savedHooks.map((hook) => (
                    <SelectItem key={hook.id} value={hook.id}>
                      {hook.hook_text.length > 50 
                        ? `${hook.hook_text.substring(0, 50)}...` 
                        : hook.hook_text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Text Overlay ({100 - textOverlay.length} characters remaining)</Label>
              <Textarea
                placeholder="Add text overlay to your video"
                value={textOverlay}
                onChange={handleTextOverlayChange}
                maxLength={100}
                className="resize-none h-20"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Text Position</Label>
                <TextPositionSelector
                  position={textPosition}
                  onChange={setTextPosition}
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

            {isTemplateSelected && (
              <>
                <Button
                  variant="outline"
                  className="w-full mb-4"
                  onClick={handleGoBackToTemplates}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go back to templates
                </Button>
                <VideoUploadSection onVideoSelect={handleVideoUpload} />
              </>
            )}

            {!isTemplateSelected ? (
              <FreeVideoDownloader 
                textOverlay={textOverlay}
                textColor={textColor}
                textSize={textSize[0]}
                textPosition={textPosition}
                animation={animation}
                startTime={startTime}
                duration={duration}
                currentVideoUrl={currentVideoUrl}
                isTemplateSelected={isTemplateSelected}
                onProceedWithTemplate={handleProceedWithTemplate}
                onGoBackToTemplates={handleGoBackToTemplates}
                hasUploadedVideo={!!uploadedVideoUrl}
              />
            ) : (
              <VideoDownloader
                textOverlay={textOverlay}
                textColor={textColor}
                textSize={textSize[0]}
                textPosition={textPosition}
                animation={animation}
                startTime={startTime}
                duration={duration}
                currentVideoUrl={currentVideoUrl}
                uploadedVideoUrl={uploadedVideoUrl}
                uploadedVideoPublicId={uploadedVideoPublicId}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;

