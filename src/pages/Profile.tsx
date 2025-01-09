import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profiles";
import { DashboardLayout } from "@/components/layouts/DashboardLayout";

const Profile = () => {
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
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-up">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <User className="h-8 w-8 text-primary" />
                <h1 className="text-4xl font-bold tracking-tight text-primary">
                  Profile
                </h1>
              </div>
              <p className="mt-2 text-lg text-muted-foreground">
                View and manage your profile information
              </p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-4">
              <User className="h-12 w-12 text-gray-400" />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{profile?.email || 'Loading...'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Plan</p>
                  <p className="font-medium capitalize">{profile?.subscription_tier || 'Loading...'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;