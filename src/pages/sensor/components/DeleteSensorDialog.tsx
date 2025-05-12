import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Clipboard } from "lucide-react";
import { toast } from "sonner";

interface DeleteSensorDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  sensorName: string;
}

export const DeleteSensorDialog = ({
  isOpen,
  onClose,
  onDelete,
  sensorName,
}: DeleteSensorDialogProps) => {
  const [inputValue, setInputValue] = useState("");

  const handleDelete = () => {
    if (inputValue === sensorName) {
      onDelete();
      onClose();
    } else {
      toast.error("El nombre ingresado no coincide.");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(sensorName);
    toast.success("Nombre copiado al portapapeles");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Elemento</DialogTitle>
          <DialogDescription className="space-y-4">
            <Alert variant="destructive" >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>¡Atención!</AlertTitle>
              <AlertDescription>
                Eliminar este sensor es irreversible. Confirma que deseas
                eliminarlo ingresando el nombre del sensor a continuación.
              </AlertDescription>
            </Alert>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2 bg-gray-100">
            <span className="flex-1">{sensorName}</span>
            <Button variant="ghost" size="icon" onClick={handleCopyToClipboard}>
              <Clipboard size={16} />
            </Button>
          </div>
          <Input
            placeholder="Ingresa el nombre del sensor"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={inputValue !== sensorName}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
