// @/pages/dashboard/components/createTeam.tsx
import { BentoGridItem } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { UserItemProps } from "@/models";
import { joinTeam } from "../services";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { updateTeamId } from "@/redux/states/supabaseSlice";

export const CreateTeam = ({ supabaseUser }: UserItemProps) => {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const dispatch = useDispatch();

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      toast.error("El código de invitación es obligatorio.");
      return;
    }

    try {
      setIsLoading(true);
      const userId = supabaseUser.id;
      const teamId = await joinTeam(userId, inviteCode);

      if (!teamId) {
        throw new Error("No se recibió un ID de equipo válido.");
      }

      dispatch(updateTeamId(teamId));

      toast.success("Te uniste al equipo con éxito.");
      setInviteCode("");
      setIsJoinOpen(false);
    } catch (error) {
      console.error("Error al unirse al equipo:", error);
      toast.error("Error al unirse al equipo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BentoGridItem
      header={
        <div className="flex flex-col items-center justify-center gap-4 h-full">
          <Button
            variant="default"
            className="w-60"
            onClick={() => setIsCreateOpen(true)}
          >
            Crear equipo
          </Button>

          {/* Dialog para Crear Equipo */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear un nuevo equipo</DialogTitle>
                <DialogDescription>
                  Ingrese el nombre del equipo.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Nombre del equipo"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <Button className="w-full mt-2">Crear</Button>
            </DialogContent>
          </Dialog>

          {/* Botón para abrir el diálogo de unirse a un equipo */}
          <Button
            variant="secondary"
            className="w-60"
            onClick={() => setIsJoinOpen(true)}
          >
            Unirse por código
          </Button>

          {/* Dialog para Unirse por Código */}
          <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Unirse a un equipo</DialogTitle>
                <DialogDescription>
                  Ingrese el código de invitación del equipo.
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Código de invitación"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
              <Button
                className="w-full mt-2"
                onClick={handleJoinTeam}
                disabled={isLoading}
              >
                {isLoading ? "Uniéndose..." : "Unirse"}
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      }
      className="md:col-span-1"
    />
  );
};
