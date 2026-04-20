import type { ObligationCategory } from "@/types/obligations";

export type AppRole = "admin" | "client" | "specialist";

export interface Profile {
  id: string;
  email: string | null;
  role: AppRole;
  organization_id: string | null;
  is_active: boolean;
  specialty: ObligationCategory | null;
  full_name: string | null;
  created_at: string;
  updated_at: string;
}