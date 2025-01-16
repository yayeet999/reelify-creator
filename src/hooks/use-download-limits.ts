import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionTier } from "@/integrations/supabase/types/enums";

interface DownloadLimits {
  isLoading: boolean;
  canDownload: boolean;
  remainingDownloads: number | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
}

export function useDownloadLimits() {
  const [limits, setLimits] = useState<DownloadLimits>({
    isLoading: true,
    canDownload: false,
    remainingDownloads: null,
    currentPeriodStart: null,
    currentPeriodEnd: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const checkDownloadLimits = async () => {
      try {
        // Get current user's subscription tier and period
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        // Get user's subscription details
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('current_period_start, current_period_end')
          .eq('user_id', session.user.id)
          .maybeSingle();

        // Get user's tier
        const { data: profile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();

        if (!profile) {
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        // Get download limit for user's tier
        const { data: tierFeature } = await supabase
          .from('tier_features')
          .select('feature_limit')
          .eq('tier', profile.subscription_tier)
          .eq('feature_name', 'video_downloads')
          .single();

        if (!tierFeature) {
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        // Get current period's download count
        const periodStart = subscription?.current_period_start || new Date().toISOString();
        const periodEnd = subscription?.current_period_end || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        const { count } = await supabase
          .from('video_downloads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('downloaded_at', periodStart)
          .lte('downloaded_at', periodEnd);

        const downloadCount = count || 0;
        const remainingDownloads = tierFeature.feature_limit - downloadCount;

        setLimits({
          isLoading: false,
          canDownload: remainingDownloads > 0,
          remainingDownloads,
          currentPeriodStart: periodStart,
          currentPeriodEnd: periodEnd,
        });

      } catch (error) {
        console.error('Error checking download limits:', error);
        toast({
          title: "Error",
          description: "Unable to verify download limits. Please try again.",
          variant: "destructive",
        });
        setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
      }
    };

    checkDownloadLimits();
  }, [toast]);

  const recordDownload = async (videoUrl: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !limits.canDownload) return false;

      const { error } = await supabase
        .from('video_downloads')
        .insert({
          user_id: session.user.id,
          video_url: videoUrl,
          billing_period_start: limits.currentPeriodStart,
          billing_period_end: limits.currentPeriodEnd,
        });

      if (error) throw error;

      // Update remaining downloads
      setLimits(prev => ({
        ...prev,
        remainingDownloads: prev.remainingDownloads ? prev.remainingDownloads - 1 : 0,
        canDownload: prev.remainingDownloads ? prev.remainingDownloads - 1 > 0 : false,
      }));

      return true;
    } catch (error) {
      console.error('Error recording download:', error);
      toast({
        title: "Error",
        description: "Failed to record download. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  return { ...limits, recordDownload };
}