import { useEffect, useRef, useState } from "react";

interface GreenScreenVideoPreviewProps {
  videoUrl: string;
  videoRef?: React.RefObject<HTMLVideoElement>;
  imageUploads: Array<{
    file: File | null;
    timestamp: number;
  }>;
}

export const GreenScreenVideoPreview = ({
  videoUrl,
  videoRef: externalVideoRef,
  imageUploads,
}: GreenScreenVideoPreviewProps) => {
  const internalVideoRef = useRef<HTMLVideoElement>(null);
  const videoRef = externalVideoRef || internalVideoRef;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      setIsLoading(true);
      videoElement.currentTime = 0;
      
      const playVideo = async () => {
        try {
          await videoElement.play();
        } catch (error) {
          console.log("Video autoplay failed:", error);
        }
      };
      
      playVideo();
    }
  }, [videoUrl, videoRef]);

  const generateCloudinaryUrl = () => {
    if (!videoUrl) return videoUrl;

    // Extract the version and public ID from the currentVideoUrl
    const matches = videoUrl.match(/\/v\d+\/([^/]+?)(?:\.(?:mp4|webm))?$/);
    if (!matches) return videoUrl;
    
    const publicId = matches[1];
    let url = "https://res.cloudinary.com/fornotreel/video/upload";

    // Add quality and format optimization
    url += "/q_auto:good,f_auto";

    // Add green screen effect with improved color similarity
    url += "/e_make_transparent:color_green:color_similarity_50";

    // Add image underlays at specific timestamps if available
    imageUploads.forEach((upload) => {
      if (upload.file) {
        try {
          // Create a clean filename for the Cloudinary URL
          const cleanFileName = encodeURIComponent(upload.file.name.replace(/[^a-zA-Z0-9]/g, '_'));
          
          // Add underlay transformation for each image
          url += `/u_${cleanFileName}`;
          
          // Add timestamp if greater than 0
          if (upload.timestamp > 0) {
            url += `,so_${Math.round(upload.timestamp)}`;
          }
          
          url += "/fl_layer_apply";
        } catch (error) {
          console.error("Error processing image upload:", error);
        }
      }
    });

    // Add the public ID at the end
    url += `/${publicId}`;
    
    console.log("Generated Cloudinary URL:", url);
    return url;
  };

  return (
    <div className="relative max-w-[240px] mx-auto aspect-[9/16] bg-black/5 rounded-lg flex items-center justify-center overflow-hidden">
      <video 
        ref={videoRef}
        className={`w-full h-full rounded-lg object-cover z-[2] transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        src={generateCloudinaryUrl()}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoading(false)}
      />
    </div>
  );
};