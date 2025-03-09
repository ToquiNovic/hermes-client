import { BentoGridItem } from "@/components/ui/bento-grid";
import { Clipboard } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserItemProps {
  user: User;
}

const UserItem = ({ user }: UserItemProps) => {
  return (
    <BentoGridItem
      title={`Hola, ${user.name}`}
      description={`Tu correo es: ${user.email} | Rol: ${user.role}`}
      header={
        <div className="flex flex-1 items-center justify-center min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2]">
          👋 Bienvenido, {user.name}
        </div>
      }
      className="md:col-span-2"
      icon={<Clipboard className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default UserItem;
