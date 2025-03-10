// @/pages/dashboard/components/ConectionItem.tsx
import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { Columns, Copy } from "lucide-react";
import { UserItemProps, Team } from "@/models";
import { getTeamById } from "@/services";
import { useUser } from "@/hooks";

const ConectionItem = ({ supabaseUser }: UserItemProps) => {
  const { userData, loading, error } = useUser(supabaseUser.id);
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!userData?.teamId) return;
      try {
        const response = await getTeamById(userData.teamId);
        
        if (response && response.success && response.data) {
          setTeam(response.data);
        } else {
          setTeam(null);
        }
      } catch {
        setTeam(null);
      }
    };

    fetchTeam();
  }, [userData]);

  if (loading) {
    return (
      <BentoGridItem
        title="Cargando..."
        description="Obteniendo datos del Equipo..."
      />
    );
  }

  if (error || !userData) {
    return (
      <BentoGridItem
        title="Error"
        description="No se pudo cargar el Equipo."
      />
    );
  }

  return (
    <BentoGridItem
      title="Conexión"
      description="Your API is secured behind an API gateway which requires an API Key for every request."
      header={
        <div className="p-4 rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2] text-sm">
          <p className="font-bold text-neutral-800 dark:text-white">
            Project API
          </p>

          <div className="mt-3">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              Public Key
            </p>
            <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 p-2 rounded justify-between">
              <span className="truncate">{team?.id}</span>
              <Copy className="h-4 w-4 text-neutral-500 cursor-pointer" />
            </div>
          </div>

          <div className="mt-3">
            <p className="font-semibold text-neutral-700 dark:text-neutral-300">
              Secret Key
            </p>
            <div className="flex items-center bg-neutral-200 dark:bg-neutral-800 p-2 rounded justify-between">
              <span className="truncate">{team?.token}</span>
              <Copy className="h-4 w-4 text-neutral-500 cursor-pointer" />
            </div>
          </div>
        </div>
      }
      className="md:col-span-2"
      icon={<Columns className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default ConectionItem;
