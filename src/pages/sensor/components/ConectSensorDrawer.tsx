import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CodeBlock } from "@/components/ui/code-block";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  InterfaceTemplateCode,
  ClassTemplateCode,
  MainTemplateCode,
} from "@/pages/sensor/utils/codeTemplate";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface ConectSensorDialogProps {
  isOpen: boolean;
  sensorId: string;
  teamId: string;
  token: string;
  onClose: () => void;
}

export const ConectSensorDialog = ({
  isOpen,
  sensorId,
  teamId,
  token,
  onClose,
}: ConectSensorDialogProps) => {
  const InterfaceTemplate = InterfaceTemplateCode();
  const ClassTemplate = ClassTemplateCode();
  const MainTemplate = MainTemplateCode(sensorId, teamId, token);

  const codeTabs = [
    {
      name: "hermes.h",
      code: InterfaceTemplate,
      language: "cpp",
    },
    {
      name: "hermes.cpp",
      code: ClassTemplate,
      language: "cpp",
    },
    {
      name: "main.ino",
      code: MainTemplate,
      language: "cpp",
      highlightLines: [7, 8, 9, 10, 11, 12],
    },
  ];

  const [activeCode, setActiveCode] = useState(codeTabs[0].code);
  const [copied, setCopied] = useState(false);

  const handleTabChange = (_index: number, code: string) => {
    setActiveCode(code);
  };

  const copyToClipboard = async () => {
    if (activeCode) {
      try {
        await navigator.clipboard.writeText(activeCode);
        setCopied(true);
        toast.success("Código copiado al portapapeles");
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error("Error al copiar el código");
      }
    } else {
      toast.error("No hay código para copiar");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1024px] w-full p-0 rounded-lg max-w-[calc(100vw-2rem)]">
        <div className="flex flex-col w-full h-full">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Conectar Sensor</DialogTitle>
            <DialogDescription>
              Copia el siguiente código según tu entorno para conectar el
              sensor.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="flex-1 px-4 pb-4">
            <CodeBlock
              language="cpp"
              tabs={codeTabs}
              onTabChange={handleTabChange}
            />
          </ScrollArea>

          <DialogFooter className="p-4 border-t">
            <Button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              Copiar código
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
