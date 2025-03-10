// @/models/user.model.ts
export interface SupabaseUser {
  id: string;
  email: string;
  name: string;
  image: string;
  teamId?: string;
}
export interface UserItemProps {
  supabaseUser: SupabaseUser;
}

export interface User {
  id: string;
  name?: string;
  email?: string;
  role?: string;
  imageUrl?: string;
  teamId?: string;
}
