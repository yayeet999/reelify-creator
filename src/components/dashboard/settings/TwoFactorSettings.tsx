import { useState } from "react";
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

interface TwoFactorSettingsProps {
  settings: {
    two_factor_enabled: boolean;
    two_factor_method: "email" | "sms" | null;
  };
  onSettingsUpdate: (newSettings: {
    two_factor_enabled: boolean;
    two_factor_method: "email" | "sms" | null;
  }) => void;
}

export function TwoFactorSettings({ settings, onSettingsUpdate }: TwoFactorSettingsProps) {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateTwoFactorSettings = async (enabled: boolean) => {
    try {
      setIsUpdating(true);
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

      onSettingsUpdate({
        two_factor_enabled: enabled,
        two_factor_method: enabled ? settings.two_factor_method || "email" : null,
      });

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
    } finally {
      setIsUpdating(false);
    }
  };

  const updateTwoFactorMethod = async (method: "email" | "sms") => {
    try {
      setIsUpdating(true);
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

      onSettingsUpdate({
        ...settings,
        two_factor_method: method,
      });

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
    } finally {
      setIsUpdating(false);
    }
  };

  return (
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
            disabled={isUpdating}
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
              disabled={isUpdating}
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
  );
}