import { SupabaseUser } from "./user.model";

export interface Team {
  id: string;
  name: string;
  inviteCode: string;
  urlImage: string;
  AdminTeamId: string;
  token: string;
}

export interface TeamItemProps {
  supabaseUser: SupabaseUser;
}

export interface TeamResponse {
  success: boolean;
  message: string;
  data: Team;
}

export interface CreateTeamFormData {
  id: string;
  name: string;
  AdminTeamId: string;
  urlLogo?: string;
  extensionFile?: string;
}