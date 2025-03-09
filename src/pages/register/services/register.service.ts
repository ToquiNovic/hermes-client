// src/pages/register/services/register.service.ts
import supabase from "@/lib/supabaseClient";
import axios from "axios";
import { User } from "@supabase/supabase-js";

interface LocalUser {
  id: string;
  role: string;
  imageUrl: string | null;
  teamId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthService {
  registerUser: (email: string, password: string) => Promise<User | null>;
  loginWithGoogle: () => Promise<void>;
}

export interface UserAPIService {
  sendUserIdToAPI: (userId: string) => Promise<void>;
}

export const registerUser = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/complete-profile`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.user?.id) {
    await sendUserIdToAPI(data.user.id);
  }

  return data.user;
};

export const loginWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    throw new Error("Error al iniciar sesión con Google: " + error.message);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    await sendUserIdToAPI(user.id);
  }
};

// Función para enviar el ID a la API
const sendUserIdToAPI = async (userId: string) => {
  try {
    await axios.post("/api/user", { id: userId });
  } catch (error) {
    console.error("Error al enviar el ID del usuario:", error);
  }
};

// Complete Profile
export const getUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
};

export const updateUserProfile = async (
  fullName: string,
  avatarUrl: string
) => {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName, avatar_url: avatarUrl },
  });

  if (error) throw new Error(error.message);
};

export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  return data.publicUrl;
};

export const getUserById = async (id: string): Promise<LocalUser | null> => {
  try {
    const response = await axios.get(`/api/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el usuario:", error);
    return null;
  }
};

// Función para obtener la imagen de perfil
export const getUserProfileImage = async (
  id: string
): Promise<string | null> => {
  const supabaseUser = await getUser();
  if (supabaseUser?.user_metadata?.avatar_url) {
    return supabaseUser.user_metadata.avatar_url;
  }

  const user = await getUserById(id);
  return user?.imageUrl || null;
};

// Actualizar usuario
export const updateUser = async (
  id: string,
  updates: Partial<Omit<LocalUser, "id" | "createdAt" | "updatedAt">>
): Promise<LocalUser | null> => {
  try {
    const response = await axios.put(`/api/user/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error actualizando el usuario:", error);
    return null;
  }
};
