import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";
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

interface ConectSensorDrawerProps {
  isOpen: boolean;
  sensorId: string;
  teamId: string;
  token: string;
  onClose: () => void;
}

export const ConectSensorDrawer = ({
  isOpen,
  sensorId,
  teamId,
  token,
  onClose,
}: ConectSensorDrawerProps) => {
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
      highlightLines: [4,5, 6, 7, 8, 9,],
    },
  ];

  // ✅ Solo una declaración
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
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
          <DrawerHeader className="p-4 border-b">
            <DrawerTitle>Conectar Sensor</DrawerTitle>
            <DrawerDescription>
              Copia el siguiente código según tu entorno para conectar el
              sensor.
            </DrawerDescription>
          </DrawerHeader>

          <ScrollArea className="flex-1 px-4 pb-4">
            <CodeBlock
              language="cpp"
              tabs={codeTabs}
              onTabChange={handleTabChange}
            />
          </ScrollArea>

          <DrawerFooter className="p-4 border-t">
            <Button
              onClick={copyToClipboard}
              className="flex items-center gap-2 bg-gray-800 text-white hover:bg-gray-700"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              Copiar código
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
