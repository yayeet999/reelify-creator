export interface UserSettings {
  id: string;
  user_id: string;
  email: string | null;
  two_factor_method: string | null;
  two_factor_enabled: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface UserSettingsInsert extends Partial<Omit<UserSettings, 'id' | 'user_id'>> {
  user_id: string;
}

export interface UserSettingsUpdate extends Partial<UserSettings> {}