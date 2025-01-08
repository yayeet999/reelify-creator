import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
          setSettings(userSettings);
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
          if (newSettings) setSettings(newSettings);
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

  const updateTwoFactorSettings = async (enabled: boolean) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("user_settings")
        .update({
          two_factor_enabled: enabled,
          two_factor_method: enabled ? settings.two_factor_method || "email" : null,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings((prev) => ({
        ...prev,
        two_factor_enabled: enabled,
        two_factor_method: enabled ? prev.two_factor_method || "email" : null,
      }));

      toast({
        title: "Success",
        description: `Two-factor authentication ${enabled ? "enabled" : "disabled"}`,
      });
    } catch (error) {
      console.error("Error updating 2FA settings:", error);
      toast({
        title: "Error",
        description: "Failed to update two-factor authentication settings",
        variant: "destructive",
      });
    }
  };

  const updateTwoFactorMethod = async (method: "email" | "sms") => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("user_settings")
        .update({
          two_factor_method: method,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      setSettings((prev) => ({
        ...prev,
        two_factor_method: method,
      }));

      toast({
        title: "Success",
        description: `Two-factor method updated to ${method}`,
      });
    } catch (error) {
      console.error("Error updating 2FA method:", error);
      toast({
        title: "Error",
        description: "Failed to update two-factor method",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Email Address</Label>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Receive a code when signing in
              </p>
            </div>
            <Switch
              checked={settings.two_factor_enabled}
              onCheckedChange={updateTwoFactorSettings}
            />
          </div>

          {settings.two_factor_enabled && (
            <div className="space-y-2">
              <Label>Authentication Method</Label>
              <Select
                value={settings.two_factor_method || "email"}
                onValueChange={(value: "email" | "sms") =>
                  updateTwoFactorMethod(value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select verification method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}