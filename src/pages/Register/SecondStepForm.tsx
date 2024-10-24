import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from '@/components/ui/card';
import useFormStore from '@/store/states/useFormStore';
import { toast } from 'sonner';
import { registerUserWithTeam, joinTeamWithCode } from './services/register.service.ts';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface SecondStepFormProps {
  onPrevious: () => void;
  onNext: () => void;
}

export const SecondStepForm: FC<SecondStepFormProps> = ({ onPrevious, onNext }) => {
  const [open, setOpen] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const formStore = useFormStore();

  // Función para crear un equipo nuevo
  const handleCreateTeam = async () => {
    if (!teamName) return;

    setLoading(true);
    try {
      const response = await registerUserWithTeam(
        formStore.username,
        formStore.password,
        formStore.role,
        teamName
      );

      formStore.setTeamName(response.team.name);
      formStore.setInviteCode(response.team.codeInvitation);

      toast.success('Equipo creado exitosamente. Código de invitación: ' + response.team.codeInvitation);

      setOpen(false);
      onNext();
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error al crear el equipo: ' + error.message);
        console.error('Error al registrar el equipo:', error.message);
      } else {
        toast.error('Error desconocido al crear el equipo');
        console.error('Error desconocido:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Función para unirse a un equipo existente usando un código de invitación
  const handleJoinTeam = async () => {
    if (!inviteCode) return;

    setLoading(true);
    try {
      const response = await joinTeamWithCode(
        formStore.username,
        formStore.password,
        formStore.role,
        inviteCode // Aquí mandamos el código de invitación
      );

      formStore.setTeamName(response.team.name);
      formStore.setInviteCode(response.team.codeInvitation);

      toast.success('Te has unido al equipo con éxito. Código de invitación: ' + response.team.codeInvitation);
      onNext();
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Error al unirse al equipo: ' + error.message);
        console.error('Error al unirse al equipo:', error.message);
      } else {
        toast.error('Error desconocido al unirse al equipo');
        console.error('Error desconocido:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-8 w-full max-w-md mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="flex flex-col items-center justify-between p-6 h-64">
            <h3 className="text-lg font-semibold text-center">Crear un equipo</h3>
            <Button onClick={() => setOpen(true)}>Crear un equipo</Button>
          </Card>

          <Card className="flex flex-col items-center justify-between p-6 h-64">
            <h3 className="text-lg font-semibold text-center">Unirse a un equipo con un código</h3>
            <Input
              placeholder="Ingrese el código de equipo"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="w-full"
            />
            <Button className="mt-4 bg-green-600" onClick={handleJoinTeam} disabled={loading}>
              {loading ? 'Uniéndose...' : 'Unirse al equipo'}
            </Button>
          </Card>
        </div>

        <div className="w-full flex justify-between mt-6">
          <Button variant="outline" onClick={onPrevious}>Anterior</Button>
        </div>
      </div>

      {/* Modal para crear un nuevo equipo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear equipo</DialogTitle>
            <DialogDescription>Por favor, ingresa el nombre de tu equipo.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Nombre del equipo"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mt-4"
          />
          <div className="flex justify-end mt-4">
            <Button onClick={handleCreateTeam} className="bg-green-600" disabled={loading}>
              {loading ? 'Creando equipo...' : 'Crear equipo'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
