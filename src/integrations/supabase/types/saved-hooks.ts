export interface SavedHook {
  id: string;
  user_id: string;
  hook_text: string;
  product_name: string;
  created_at: string;
  updated_at: string;
}

export type SavedHookInsert = Omit<SavedHook, 'id' | 'created_at' | 'updated_at'>;
export type SavedHookUpdate = Partial<SavedHookInsert>;