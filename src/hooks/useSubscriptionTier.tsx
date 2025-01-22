import { useAuth } from "@/contexts/AuthContext";
import type { SubscriptionTier } from "@/types/subscription";

export function useSubscriptionTier() {
  const { subscriptionTier, isSubscriptionLoading } = useAuth();

  const hasAccess = (requiredTier: SubscriptionTier): boolean => {
    const tiers: SubscriptionTier[] = ['free', 'starter', 'pro', 'enterprise'];
    const currentTierIndex = tiers.indexOf(subscriptionTier);
    const requiredTierIndex = tiers.indexOf(requiredTier);
    
    return currentTierIndex >= requiredTierIndex;
  };

  return {
    currentTier: subscriptionTier,
    isSubscriptionLoading,
    hasAccess,
    isFreeTier: subscriptionTier === 'free',
    isStarterTier: subscriptionTier === 'starter',
    isProTier: subscriptionTier === 'pro',
    isEnterpriseTier: subscriptionTier === 'enterprise',
  };
}