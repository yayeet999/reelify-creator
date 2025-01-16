import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { SubscriptionTier } from "@/types/subscription";

interface DownloadLimits {
  isLoading: boolean;
  canDownload: boolean;
  remainingDownloads: number | null;
}

export function useDownloadLimits() {
  const [limits, setLimits] = useState<DownloadLimits>({
    isLoading: true,
    canDownload: false,
    remainingDownloads: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    const checkDownloadLimits = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          console.log('No session found');
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        // First, get user's subscription tier from profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        const tier = profile.subscription_tier as SubscriptionTier;
        console.log('User tier:', tier);

        // If user is on free tier, they can't download
        if (tier === 'free') {
          console.log('Free tier - no downloads allowed');
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        // Get download limit for user's tier
        const { data: tierFeature } = await supabase
          .from('tier_features')
          .select('feature_limit')
          .eq('tier', tier)
          .eq('feature_name', 'video_downloads')
          .maybeSingle();

        if (!tierFeature) {
          console.log('No tier feature found for:', tier);
          setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
          return;
        }

        // For paid tiers, check active subscription
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('current_period_start, current_period_end')
          .eq('user_id', session.user.id)
          .eq('status', 'active')
          .maybeSingle();

        // If no active subscription found, use profile created_at as period start
        // and add 30 days as period end for grace period
        let periodStart, periodEnd;
        
        if (subscription) {
          periodStart = subscription.current_period_start;
          periodEnd = subscription.current_period_end;
        } else {
          const { data: profileDates } = await supabase
            .from('profiles')
            .select('created_at')
            .eq('id', session.user.id)
            .maybeSingle();

          if (profileDates) {
            periodStart = profileDates.created_at;
            // Add 30 days grace period
            const gracePeriodEnd = new Date(profileDates.created_at);
            gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
            periodEnd = gracePeriodEnd.toISOString();
          } else {
            setLimits(prev => ({ ...prev, isLoading: false, canDownload: false }));
            return;
          }
        }

        // Count downloads within the current period
        const { count } = await supabase
          .from('video_downloads')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', session.user.id)
          .gte('downloaded_at', periodStart)
          .lte('downloaded_at', periodEnd);

        const downloadCount = count || 0;
        const remainingDownloads = tierFeature.feature_limit - downloadCount;

        console.log('Downloads used:', downloadCount, 'Remaining:', remainingDownloads);

        setLimits({
          isLoading: false,
          canDownload: remainingDownloads > 0,
          remainingDownloads,
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

      // Get current subscription period
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('current_period_start, current_period_end')
        .eq('user_id', session.user.id)
        .eq('status', 'active')
        .maybeSingle();

      let periodStart, periodEnd;
      
      if (subscription) {
        periodStart = subscription.current_period_start;
        periodEnd = subscription.current_period_end;
      } else {
        // Use profile created_at as fallback
        const { data: profileDates } = await supabase
          .from('profiles')
          .select('created_at')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profileDates) {
          periodStart = profileDates.created_at;
          const gracePeriodEnd = new Date(profileDates.created_at);
          gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 30);
          periodEnd = gracePeriodEnd.toISOString();
        } else {
          return false;
        }
      }

      const { error } = await supabase
        .from('video_downloads')
        .insert({
          user_id: session.user.id,
          video_url: videoUrl,
          billing_period_start: periodStart,
          billing_period_end: periodEnd,
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