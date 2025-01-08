import { SubscriptionTier } from '@/integrations/supabase/types';

export type { SubscriptionTier };

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt?: string;
}