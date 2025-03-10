import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/ui/code-block";

interface ConectSensorDialogProps {
  isOpen: boolean;
  sensorId: string;
  teamId: string;
  onClose: () => void;
}

export const ConectSensorDialog = ({
  isOpen,
  sensorId,
  teamId,
  onClose,
}: ConectSensorDialogProps) => {
  const code = `const DummyComponent = () => {
    const [count, setCount] = React.useState(0);
   
    const handleClick = () => {
      setCount(prev => prev + 1);
    };

    ${sensorId}
    ${teamId}
   
    return (
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">Fights Counter</h2>
        <p className="mb-2">Fight Club Fights Count: {count}</p>
        <button 
          onClick={handleClick}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Increment
        </button>
      </div>
    );
  };
  `;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Campos</DialogTitle>
          <DialogDescription>
            Aquí puedes modificar los campos.
          </DialogDescription>
        </DialogHeader>
        <CodeBlock
          language="jsx"
          filename="DummyComponent.jsx"
          highlightLines={[9, 13, 14, 18]}
          code={code}
        />
      </DialogContent>
    </Dialog>
  );
};
