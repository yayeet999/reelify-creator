import type { SubscriptionTier } from '@/integrations/supabase/types/enums';

export type { SubscriptionTier };

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: string;
}