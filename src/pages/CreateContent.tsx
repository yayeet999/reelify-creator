import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";

const CreateContent = () => {
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Initialize Cloudinary
  const cld = new Cloudinary({
    cloud: {
      cloudName: 'fornotreel'
    }
  });

  return (
    <div className="container mx-auto p-6 space-y-6 animate-fade-up">
      <h1 className="text-3xl font-bold text-primary">Create Content</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Video Preview Area */}
        <Card className="col-span-1 bg-accent-purple/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Video Preview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black/5 rounded-lg flex items-center justify-center">
              {videoUrl ? (
                <video 
                  className="w-full h-full rounded-lg"
                  controls
                  src={videoUrl}
                />
              ) : (
                <p className="text-muted-foreground">Video preview will appear here</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Details */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Content Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video URL</label>
              <input
                type="text"
                placeholder="Enter Cloudinary video URL"
                className="w-full px-3 py-2 border rounded-md"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                type="text"
                placeholder="Enter content title"
                className="w-full px-3 py-2 border rounded-md"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Enter content description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateContent;