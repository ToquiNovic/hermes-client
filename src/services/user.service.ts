// @/services/user.service.ts
import axios from "axios";
import { User } from "@supabase/supabase-js";

export const getUserById = async (id: string): Promise<User | null> => {  
  try {
    const response = await axios.get(`/api/user/${id}`);    
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el usuario:", error);
    return null;
  }
};