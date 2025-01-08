import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AccountInfo } from "./settings/AccountInfo";
import { TwoFactorSettings } from "./settings/TwoFactorSettings";

interface UserSettings {
  two_factor_enabled: boolean;
  two_factor_method: "email" | "sms" | null;
  email: string | null;
}

export function Settings() {
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    two_factor_enabled: false,
    two_factor_method: null,
    email: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserSettings();
  }, []);

  const fetchUserSettings = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email);

        const { data: userSettings, error } = await supabase
          .from("user_settings")
          .select("*")
          .single();

        if (error && error.code !== "PGRST116") {
          throw error;
        }

        if (userSettings) {
          // Ensure the two_factor_method is of the correct type
          const sanitizedSettings: UserSettings = {
            two_factor_enabled: userSettings.two_factor_enabled || false,
            two_factor_method: (userSettings.two_factor_method as "email" | "sms" | null) || null,
            email: userSettings.email,
          };
          setSettings(sanitizedSettings);
        } else {
          // Create initial settings if they don't exist
          const { data: newSettings, error: insertError } = await supabase
            .from("user_settings")
            .insert([
              {
                user_id: user.id,
                email: user.email,
                two_factor_enabled: false,
                two_factor_method: null,
              },
            ])
            .select("*")
            .single();

          if (insertError) throw insertError;
          if (newSettings) {
            const sanitizedNewSettings: UserSettings = {
              two_factor_enabled: newSettings.two_factor_enabled || false,
              two_factor_method: (newSettings.two_factor_method as "email" | "sms" | null) || null,
              email: newSettings.email,
            };
            setSettings(sanitizedNewSettings);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <AccountInfo email={userEmail} />
      <TwoFactorSettings
        settings={settings}
        onSettingsUpdate={(newSettings) => {
          setSettings((prev) => ({ ...prev, ...newSettings }));
        }}
      />
    </div>
  );
}