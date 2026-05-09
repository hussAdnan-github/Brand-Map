import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type BrandMap = {
  id: number;
  user_id: string;
  name: string;
  industry: string | null;
  mode: 'individual' | 'team';
  invite_code: string | null;
  status: 'active' | 'archived' | 'completed';
  current_stage: number;
  total_stages: number;
  progress_percent: number;
  team_member_count: number;
  created_at: string;
  updated_at: string;
};

export type BrandMapSelection = {
  id: number;
  brand_map_id: number;
  question_id: string;
  card_id: string;
  maturity_level: number;
  custom_text: string | null;
  created_at: string;
};

export type BrandMapConflict = {
  id: number;
  brand_map_id: number;
  conflict_text: string;
  decision: 'adjust' | 'accept';
  justification: string | null;
  created_at: string;
};

export type BrandMapResearch = {
  id: number;
  brand_map_id: number;
  decision: string;
  method: string;
  deadline: string | null;
  created_at: string;
};

export type BrandMapPriority = {
  id: number;
  brand_map_id: number;
  priority_text: string;
  sort_order: number;
  created_at: string;
};