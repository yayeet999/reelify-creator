export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  status: string | null;
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  cancel_at: string | null;
  canceled_at: string | null;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionInsert extends Partial<Omit<Subscription, 'id' | 'user_id'>> {
  user_id: string;
}

export interface SubscriptionUpdate extends Partial<Subscription> {}