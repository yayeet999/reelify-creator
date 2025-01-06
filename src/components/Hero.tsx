import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

export const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-purple/50 to-white pt-16">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Create Stunning AI Videos for Social Media
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your content with AI-powered video effects and hooks that capture attention and drive engagement.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Button size="lg" className="group">
              Get Started Free
              <Play className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
          <div className="mt-8 p-4 bg-white/50 backdrop-blur-sm rounded-xl border shadow-lg">
            <video
              className="rounded-lg w-full max-w-2xl mx-auto shadow-xl"
              poster="/placeholder.svg"
              loop
              muted
            >
              <source src="#" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>
  );
};