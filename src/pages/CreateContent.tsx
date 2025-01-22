import { FileText, Video, Code, Film } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { useNavigate } from "react-router-dom";
import { FeatureGate } from "@/components/FeatureGate";
import { FEATURES } from "@/config/features";

const CreateContent = () => {
  const navigate = useNavigate();

  const contentOptions = [
    {
      title: "Generate Hooks",
      description: "Create custom React hooks for your projects",
      icon: <Code className="w-5 h-5" />,
      path: "/dashboard/hooks",
      feature: FEATURES.HOOKS_GENERATOR,
    },
    {
      title: "Green Screenify",
      description: "Create videos with custom backgrounds",
      icon: <Video className="w-5 h-5" />,
      path: "/dashboard/green-screenify",
      feature: FEATURES.GREEN_SCREENIFY,
    },
    {
      title: "Video Editor",
      description: "Create and customize video content",
      icon: <Film className="w-5 h-5" />,
      path: "/dashboard/video-editor",
      feature: FEATURES.VIDEO_EDITOR,
    },
    {
      title: "View Saved Hooks",
      description: "Access your library of saved hooks",
      icon: <FileText className="w-5 h-5" />,
      path: "/dashboard/saved-hooks",
      feature: FEATURES.HOOKS_GENERATOR,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary-light bg-clip-text text-transparent">
              Create Content
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Choose what type of content you want to create
            </p>
          </div>
        </div>

        {/* Content Options Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contentOptions.map((option) => (
            <FeatureGate
              key={option.title}
              requiredTier={option.feature.requiredTier}
            >
              <QuickStartCard
                title={option.title}
                description={option.description}
                icon={option.icon}
                onClick={() => navigate(option.path)}
              />
            </FeatureGate>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CreateContent;