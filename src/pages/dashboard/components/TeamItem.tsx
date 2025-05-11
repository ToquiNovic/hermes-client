import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { UserItemProps, Team } from "@/models";
import { useUser } from "@/hooks";
import { leavingaTeam } from "@/pages/dashboard/services";
import { getTeamById } from "@/services";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { motion } from "framer-motion";
import { getTeamMembers } from "@/pages/dashboard/services";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ClipboardCopy, LogOut } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch } from "react-redux";
import { updateTeamId } from "@/redux/states/supabaseSlice";

interface TeamMember {
  id: number;
  name: string;
  designation: string;
  image: string;
}

interface TeamItemProps extends UserItemProps {
  isHovered: boolean;
  onTeamLeave?: () => void;
}

const TeamItem = ({ supabaseUser, isHovered, onTeamLeave }: TeamItemProps) => {
  const { userData, loading, error } = useUser(supabaseUser.id);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();

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

  const teamProfileImage = team?.urlImage || null;

  const handleCopyCode = () => {
    if (team?.inviteCode) {
      navigator.clipboard.writeText(team.inviteCode);
      toast.success("Código copiado al portapapeles");
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await leavingaTeam(supabaseUser.id);
      toast.success("Has abandonado el equipo exitosamente");
      setTeam(null);
      setTeamMembers([]);
      dispatch(updateTeamId(null)); // Actualiza el teamId a null en Redux
      if (onTeamLeave) onTeamLeave(); // Notifica al padre
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error al abandonar el equipo";
      toast.error(errorMessage);
    } finally {
      setOpenDialog(false);
    }
  };

  const handleConfirmLeave = () => {
    handleLeaveTeam();
  };

  const Skeleton = () => (
    <div className="relative w-full h-60 overflow-hidden flex items-center justify-center">
      <h1 className="absolute top-4 left-1/2 transform -translate-x-1/2 font-bold text-4xl text-center z-10">
        {team ? team.name : "Sin equipo"}
      </h1>
      <motion.img
        src={teamProfileImage || "/metasync-logo.webp"}
        className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1 }}
      />
      <div className="flex flex-row items-center justify-center w-full z-20">
        <AnimatedTooltip items={teamMembers} />
      </div>
    </div>
  );

  const renderTitle = () => (
    <div className="relative w-full flex flex-col gap-2">
      <motion.span
        className="font-medium"
        initial={{ y: 0 }}
        animate={isHovered ? { y: -10 } : { y: 0 }}
        transition={{ duration: 0.2 }}
      >
        Código de equipo: {team ? team.inviteCode : "Sin código"}
      </motion.span>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col gap-2 mt-2"
        >
          <Tooltip>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                <Button size="sm" className="w-full">
                  <LogOut className="h-4 w-4 mr-2" />
                  Salir del equipo
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar salida</DialogTitle>
                </DialogHeader>
                <p className="py-4">
                  ¿Estás seguro de que quieres salir del equipo{" "}
                  {team ? team.name : ""}? Esta acción no se puede deshacer.
                </p>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setOpenDialog(false)}
                    >
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={handleConfirmLeave}>
                    Confirmar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <TooltipContent>
              <p>Salir del equipo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopyCode}
                className="w-full"
              >
                <ClipboardCopy className="h-4 w-4 mr-2" />
                Copiar código
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copiar código</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </div>
  );

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

  return <BentoGridItem title={renderTitle()} header={<Skeleton />} />;
};

export default TeamItem;
