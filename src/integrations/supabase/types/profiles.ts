import { SubscriptionTier } from './enums';

export interface Profile {
  id: string;
  created_at: string;
  display_name: string | null;
  email: string | null;
  last_sign_in: string | null;
  phone: string | null;
  provider: string | null;
  provider_type: string | null;
  subscription_tier: SubscriptionTier;
  updated_at: string;
}

export interface ProfileInsert extends Partial<Omit<Profile, 'id'>> {
  id: string;
}

export interface ProfileUpdate extends Partial<Profile> {
  id?: string;
}