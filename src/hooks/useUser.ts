// @/hooks/useUser.ts
import { useEffect, useState } from "react";
import { getUserById } from "@/services";
import { User } from "@/models";

export const useUser = (userId?: string) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        setError(null);

        const user = await getUserById(userId);

        if (!user || Object.keys(user).length === 0) {
          throw new Error("Usuario no encontrado");
        }

        setUserData(user);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  return { userData, loading, error };
};
