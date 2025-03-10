import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { UserItemProps, Team } from "@/models";
import { useUser } from "@/hooks";
import { getTeamById } from "@/services";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { motion } from "framer-motion";
import { getTeamMembers } from "@/pages/dashboard/services";

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
}

const TeamItem = ({ supabaseUser }: UserItemProps) => {
  const { userData, loading, error } = useUser(supabaseUser.id);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    const fetchTeam = async () => {
      if (!userData?.teamId) return;
      try {
        const response = await getTeamById(userData.teamId);
        const teamMembersResponse = await getTeamMembers(userData.teamId);

        if (response?.success && response.data) {
          setTeam(response.data);
        } else {
          setTeam(null);
        }

        const roleTeam =
          response?.data?.AdminTeamId === userData.id ? "Admin" : "Miembro";

        if (
          teamMembersResponse?.success &&
          teamMembersResponse.data.length > 0
        ) {
          const formattedMembers: TeamMember[] = teamMembersResponse.data.map(
            (member: { imageUrl: string | null }, index: number) => ({
              id: index,
              name: supabaseUser.name || "Usuario desconocido",
              designation: roleTeam,
              image:
                member.imageUrl || supabaseUser.image || "/default-avatar.png",
            })
          );
          setTeamMembers(formattedMembers);
        } else {
          setTeamMembers([]);
        }
      } catch (error) {
        console.error("Error al obtener el equipo:", error);
        setTeam(null);
      }
    };

    fetchTeam();
  }, [userData, supabaseUser.image, supabaseUser.name]);

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

  const teamProfileImage = team?.urlImage || null;

  const Skeleton = () => {
    return (
      <div className="h-screen w-full flex items-center justify-center relative overflow-hidden">
        <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 font-bold text-4xl text-center">
          {team ? team.name : "Sin equipo"}
        </h1>
        <motion.img
          src={teamProfileImage || "/metasync-logo.webp"}
          className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />
        <div className="flex flex-row items-center justify-center mb-10 w-full">
          <AnimatedTooltip items={teamMembers} />
        </div>
      </div>
    );
  };

  return (
    <BentoGridItem
      title={`Código de equipo: ${team ? team?.inviteCode : "Sin código"}`}
      header={<Skeleton />}
      className="md:col-span-1"
    />
  );
};

export default TeamItem;
