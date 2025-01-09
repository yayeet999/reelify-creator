import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { Profile } from "@/integrations/supabase/types/profiles";
import type { SubscriptionTier } from "@/integrations/supabase/types/enums";

export type RequiredTier = SubscriptionTier;

const TIER_LEVELS = {
  free: 0,
  starter: 1,
  pro: 2,
  enterprise: 3,
};

export function useSubscriptionGuard(requiredTier: RequiredTier) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [currentTier, setCurrentTier] = useState<SubscriptionTier>("free");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setIsAuthorized(false);
          navigate("/auth");
          return;
        }

        // Set up real-time subscription to profile changes
        const channel = supabase
          .channel('profile-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${session.user.id}`,
            },
            (payload) => {
              const newProfile = payload.new as Profile;
              const newTier = newProfile.subscription_tier;
              setCurrentTier(newTier);
              const isAllowed = TIER_LEVELS[newTier] >= TIER_LEVELS[requiredTier];
              setIsAuthorized(isAllowed);
              
              if (!isAllowed) {
                toast({
                  title: "Subscription Required",
                  description: `This feature requires a ${requiredTier} subscription or higher.`,
                  variant: "destructive",
                });
                navigate("/dashboard");
              }
            }
          )
          .subscribe();

        // Initial subscription check
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();

        if (error) throw error;

        const userTier = profile?.subscription_tier as SubscriptionTier;
        setCurrentTier(userTier);
        const isAllowed = TIER_LEVELS[userTier] >= TIER_LEVELS[requiredTier];
        setIsAuthorized(isAllowed);

        if (!isAllowed) {
          toast({
            title: "Subscription Required",
            description: `This feature requires a ${requiredTier} subscription or higher.`,
            variant: "destructive",
          });
          navigate("/dashboard");
        }

        setIsLoading(false);

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Subscription check error:', error);
        setIsAuthorized(false);
        setIsLoading(false);
        toast({
          title: "Error",
          description: "Unable to verify subscription status. Please try again later.",
          variant: "destructive",
        });
        navigate("/dashboard");
      }
    };

    checkSubscription();
  }, [requiredTier, navigate, toast]);

  return { isLoading, isAuthorized, currentTier };
}