// @/pages/dashboard/components/UserItem.tsx
import { BentoGridItem } from "@/components/ui/bento-grid";
import { Clipboard } from "lucide-react";
import { useUser } from "@/hooks";
import { UserItemProps } from "@/models";

const UserItem = ({ supabaseUser }: UserItemProps) => {
  const { userData, loading, error } = useUser(supabaseUser.id);

  if (loading) {
    return (
      <BentoGridItem
        title="Cargando..."
        description="Obteniendo datos del usuario..."
      />
    );
  }

  if (error) {
    return (
      <BentoGridItem
        title="Error"
        description="No se pudo cargar el usuario."
      />
    );
  }

  const profileImage = userData?.imageUrl || supabaseUser.image || null;

  return (
    <BentoGridItem
      title={`Hola, ${supabaseUser.name || "Usuario desconocido"}`}
      description={`Correo: ${supabaseUser.email}`}
      header={
        <div className="flex flex-1 items-center justify-center min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2]">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <span className="text-neutral-500">Sin imagen</span>
          )}
        </div>
      }
      className="md:col-span-2"
      icon={<Clipboard className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default UserItem;
