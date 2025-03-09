import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUser,
  getUserProfileImage,
  updateUserProfile,
  uploadAvatar,
} from "./services/register.service.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import ProfileImage from "./components/ProfileImage";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form.tsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Esquema de validación con Zod
const formSchema = z.object({
  fullName: z.string().min(1, "El nombre es obligatorio"),
});

export default function CompleteProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
    },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      if (!userData) {
        toast.error("Sesión expirada. Inicia sesión nuevamente.");
        return navigate("/login");
      }

      setUser(userData);
      setUserId(userData.id);
      const fetchedFullName = userData.user_metadata?.full_name || "";
      form.setValue("fullName", fetchedFullName);

      const imgPerfil = await getUserProfileImage(userData.id);
      setAvatarUrl(imgPerfil ?? userData.user_metadata?.avatar_url ?? "");
    };

    fetchUser();
  }, [navigate, form]);

  const handleSaveProfile = async (values: { fullName: string }) => {
    if (!userId) return;

    const currentFullName = user?.user_metadata?.full_name || "";
    const currentAvatarUrl = user?.user_metadata?.avatar_url || "";

    if (values.fullName.trim() === currentFullName.trim() && avatarUrl === currentAvatarUrl) {
      return toast.info("No hay cambios para guardar.");
    }

    setLoading(true);
    try {
      await updateUserProfile(values.fullName, avatarUrl);
      toast.success("Perfil actualizado correctamente.");
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error("Error actualizando el perfil: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId || !e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const uploadedUrl = await uploadAvatar(userId, file);
      setAvatarUrl(uploadedUrl);
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error("Error subiendo la imagen: " + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-96 mx-auto mt-10">
      <CardHeader>
        <CardTitle>Completa tu Perfil</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveProfile)} className="space-y-4">
            <ProfileImage
              avatarUrl={avatarUrl}
              tipo="users"
              id={userId || ""}
              onFileChange={handleFileChange}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Pepe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Correo Electrónico</FormLabel>
              <Input
                type="email"
                value={user?.email || ""}
                disabled
                className="opacity-50"
              />
            </div>

            <CardFooter className="flex justify-between mt-4">
              <Button type="submit" disabled={loading || isUploading} className="w-full">
                {loading || isUploading ? "Guardando..." : "Guardar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
