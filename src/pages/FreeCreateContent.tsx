import { DashboardLayout } from "@/components/layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const FreeCreateContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                Create Content <span className="text-2xl text-gray-600">(Free Plan)</span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Start creating amazing content with our free tier features.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Free Tier Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Basic text overlays</li>
                <li>• Standard video templates</li>
                <li>• 720p video quality</li>
                <li>• Up to 30-second videos</li>
              </ul>
            </div>

            <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm border border-purple-100">
              <h3 className="text-lg font-semibold mb-2">Pro Features Available</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Advanced text animations</li>
                <li>• Premium templates</li>
                <li>• 4K video quality</li>
                <li>• Unlimited video length</li>
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
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FreeCreateContent;