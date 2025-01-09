import { useNavigate } from "react-router-dom";
import { User, Settings, FilePlus, Code, Zap } from "lucide-react";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profiles";

const ProDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleUpgradeToEnterprise = () => {
    toast({
      title: "Interested in Enterprise?",
      description: "Contact our sales team for custom solutions!",
    });
    navigate("/pricing");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
      <div className="space-y-8">
        {/* Profile Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-purple-200">
          <div className="flex items-center gap-4">
            <User className="h-12 w-12 text-purple-400" />
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{profile?.email || 'Loading...'}</p>
              <p className="text-sm text-muted-foreground mt-1">Current Plan</p>
              <p className="font-medium capitalize">{profile?.subscription_tier || 'Loading...'}</p>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <div className="bg-purple-50 rounded-lg p-6 shadow-sm border border-purple-200">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-purple-900">
              Dashboard <span className="text-2xl text-purple-600">(Pro Plan)</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome to your pro dashboard. Unlock enterprise features for even more capabilities!
            </p>
            <Button 
              onClick={handleUpgradeToEnterprise}
              className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Zap className="mr-2 h-4 w-4" />
              Upgrade to Enterprise
            </Button>
          </div>
        </div>

        {/* Quick Start Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

        {/* Pro Features Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="bg-purple-50/50 rounded-lg p-6 shadow-sm border border-purple-100">
            <h3 className="text-lg font-semibold mb-2">Pro Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Up to 200 content generations per month</li>
              <li>• Maximum video length: 3 minutes</li>
              <li>• Advanced effects and features</li>
              <li>• Priority support</li>
            </ul>
          </div>
          <div className="bg-indigo-50/50 rounded-lg p-6 shadow-sm border border-indigo-100">
            <h3 className="text-lg font-semibold mb-2">Enterprise Benefits</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Unlimited content generations</li>
              <li>• Custom video length limits</li>
              <li>• Custom effects and features</li>
              <li>• Dedicated support team</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;
