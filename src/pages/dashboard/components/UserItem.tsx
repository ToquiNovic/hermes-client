// @/pages/dashboard/components/UserItem.tsx
import { BentoGridItem } from "@/components/ui/bento-grid";
import { UserItemProps } from "@/models";
import ColourfulText from "@/components/ui/colourful-text";

const UserItem = ({ supabaseUser }: UserItemProps) => {

 const Skeleton = () => {
  return (
    <div className="h-screen w-full flex items-center justify-self-start relative overflow-hidden">
      <h1 className="font-bold text-left text-4xl">
        Hola, <ColourfulText text={`${supabaseUser.name.toUpperCase() || "Usuario desconocido"}`} /> <br />
        Bienvenid@ de vuelta!
      </h1>
    </div>
  );
};

  return (
    <BentoGridItem
      description={`Correo: ${supabaseUser.email}`}
      header={<Skeleton />}
      className="md:col-span-2"
    />
  );
};

export default UserItem;
