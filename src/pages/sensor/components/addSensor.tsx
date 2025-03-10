import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface AddSensorDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddSensorDialog = ({ isOpen, onClose }: AddSensorDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Campos</DialogTitle>
          <DialogDescription>
            Aquí puedes modificar los campos.
          </DialogDescription>
        </DialogHeader>
        {/* Contenido del diálogo */}
      </DialogContent>
    </Dialog>
  );
};
