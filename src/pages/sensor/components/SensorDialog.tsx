// @/pages/sensor/components/SensorDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardFooter } from "@/components/ui/card";
import { createSensor } from "../service";
import { CreateSensorFormData, Sensor } from "@/models";
import { toast } from "sonner";
import { useState } from "react";

interface SensorDialogProps {
  idTeam: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onNewSensor: (sensor: Sensor) => void;
}

export const SensorDialog: React.FC<SensorDialogProps> = ({
  idTeam,
  open,
  setOpen,
  onNewSensor,
}) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreateSensor = async () => {
    if (!idTeam || !name) return;

    setLoading(true);

    const requestData: CreateSensorFormData = {
      name,
      description,
      teamId: idTeam,
    };

    try {
      const response = await createSensor(requestData);
      if (!response?.success) {
        throw new Error(response?.message || "Error al crear el sensor.");
      }

      toast.success("Sensor creado correctamente.");

      if (response?.data) {
        onNewSensor(response.data[0]);
      }

      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Nuevo Sensor</DialogTitle>
          <DialogDescription>
            Ingrese los campos necesarios para crear un sensor.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Nombre del Sensor"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Descripción del Sensor"
            className="w-full p-2 border rounded-md"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              type="button"
              onClick={handleCreateSensor}
              disabled={loading}
            >
              Guardar Sensor
            </Button>
          </CardFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
