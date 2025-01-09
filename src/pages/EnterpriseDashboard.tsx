import { useNavigate } from "react-router-dom";
import { User, Settings, FilePlus, Code, Building2 } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profiles";

const quickStartOptions = [
  {
    title: "Complete Your Profile",
    description: "Set up your organization profile and preferences",
    icon: <User className="w-5 h-5" />,
    path: "/profile",
  },
  {
    title: "Create New Content",
    description: "Access all premium content creation features",
    icon: <FilePlus className="w-5 h-5" />,
    path: "/create",
  },
  {
    title: "Generate Custom Hooks",
    description: "Create and manage custom hooks",
    icon: <Code className="w-5 h-5" />,
    path: "/hooks",
  },
  {
    title: "Organization Settings",
    description: "Manage your enterprise settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings",
  },
];

const EnterpriseDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };
    getProfile();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-200">
          <div className="flex items-center gap-4">
            <User className="h-12 w-12 text-amber-400" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email || 'Loading...'}</p>
              <p className="text-sm text-muted-foreground mt-1">Current Plan</p>
              <p className="font-medium capitalize">{profile?.subscription_tier || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Quick Start Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {quickStartOptions.map((option) => (
            <QuickStartCard
              key={option.title}
              title={option.title}
              description={option.description}
              icon={option.icon}
              onClick={() => navigate(option.path)}
            />
          ))}
        </div>

        {/* Enterprise Features Section */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="bg-amber-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
            <h3 className="text-lg font-semibold mb-2">Enterprise Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Unlimited content generations</li>
              <li>• No video length restrictions</li>
              <li>• Custom AI models</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>
          <div className="bg-amber-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
            <h3 className="text-lg font-semibold mb-2">Premium Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• 24/7 dedicated support</li>
              <li>• Custom feature development</li>
              <li>• Priority bug fixes</li>
              <li>• Technical consultation</li>
            </ul>
          </div>
          <div className="bg-amber-50/50 rounded-lg p-6 shadow-sm border border-amber-100">
            <h3 className="text-lg font-semibold mb-2">Enterprise Security</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Advanced security features</li>
              <li>• Custom data retention</li>
              <li>• API access</li>
              <li>• SSO integration</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
