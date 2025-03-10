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
import { CreateTeamFormData } from "@/models";
import { joinTeam, createTeam } from "../services";
import { toast } from "sonner";
import { RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { updateTeamId } from "@/redux/states/supabaseSlice";
import { useImageUpload } from "@/hooks/useImageUpload";
import InputUploadImage from "./inputUploadImage";
import { v4 as uuidv4 } from "uuid";

export const CreateTeam = () => {
  const supabaseUser = useSelector((state: RootState) => state.supabase.user);
  const [teamId] = useState(uuidv4());
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCreate, setIsLoadingCreate] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const { isUploading, uploadedUrl, setUploadedUrl } = useImageUpload();
  const [fileExtension, setFileExtension] = useState<string | null>(null);
  const dispatch = useDispatch();

  const updateReduxTeamId = (newTeamId: string) => {
    dispatch(updateTeamId(newTeamId));
  };

  const handleCreateTeam = async ( ) => {
    if (!teamName.trim() || !supabaseUser?.id) {
      toast.error("El nombre del equipo es obligatorio.");
      return;
    }

    const requestData: CreateTeamFormData = {
      id: teamId,
      name: teamName,
      AdminTeamId: supabaseUser.id,
      urlLogo: uploadedUrl || "",
      extensionFile: fileExtension || "",
    };

    try {
      setIsLoadingCreate(true);
      const response = await createTeam(requestData);

      if (!response?.success) {
        throw new Error(response?.message || "Error al crear el equipo.");
      }

      dispatch(updateTeamId(teamId));

      toast.success("Equipo creado con éxito.");
      setTeamName("");
      setIsCreateOpen(false);
    } catch (error) {
      console.error("Error al crear el equipo:", error);
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoadingCreate(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      toast.error("El código de invitación es obligatorio.");
      return;
    }

    try {
      setIsLoading(true);
      const userId = supabaseUser?.id || "";
      const response = await joinTeam(userId, inviteCode);

      if (!response?.success || !response?.data?.teamId) {
        throw new Error(
          response?.message || "No se recibió un ID de equipo válido."
        );
      }

      updateReduxTeamId(response.data.teamId);

      toast.success("Te uniste al equipo con éxito.");
      setInviteCode("");
      setIsJoinOpen(false);
    } catch (error) {
      console.error("Error al unirse al equipo:", error);
      toast.error(error instanceof Error ? error.message : "Error desconocido");
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
                  Ingrese el nombre del equipo y suba una imagen (opcional).
                </DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Nombre del equipo"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
              />
              <InputUploadImage
                tipo="teams"
                id={teamId}
                onUploadComplete={(url, extension) => {
                  setUploadedUrl(url ?? "");
                  setFileExtension(extension);
                }}
              />
              {isUploading && <p>Subiendo imagen...</p>}
              <Button
                className="w-full mt-2"
                onClick={() =>
                  handleCreateTeam()
                }
                disabled={isLoadingCreate}
              >
                {isLoadingCreate ? "Creando..." : "Crear"}
              </Button>
            </DialogContent>
          </Dialog>

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
