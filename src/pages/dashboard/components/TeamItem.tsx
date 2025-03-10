// @/pages/dashboard/components/TeamItem.tsx
import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { FileWarning } from "lucide-react";
import { UserItemProps, Team } from "@/models";
import { useUser } from "@/hooks";
import { getTeamById } from "@/services";

const TeamItem = ({ supabaseUser }: UserItemProps) => {
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
        description="No se pudo cargar el usuario."
      />
    );
  }

  return (
    <BentoGridItem
      title="Equipo"
      description={team ? team.name : "Sin equipo"}
      header={
        <div className="flex flex-1 items-center justify-center min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2]">
          🏆 {team ? team.name : "Cargando..."}
        </div>
      }
      className="md:col-span-1"
      icon={<FileWarning className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default TeamItem;
