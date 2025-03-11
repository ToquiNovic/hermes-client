// @/pages/sensor/components/ConectSensorDrawer.tsx
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { CodeBlock } from "@/components/ui/code-block";
import { codeTemplate } from "@/pages/sensor/utils/codeTemplate";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const code = codeTemplate(sensorId, teamId, token);  

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        {/* Contenedor del Drawer centrado */}
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
          <DrawerHeader className="p-4 border-b">
            <DrawerTitle>Conectar Sensor</DrawerTitle>
            <DrawerDescription>
              Copia el siguiente código y pégalo en tu proyecto de Arduino para
              conectar el sensor.
            </DrawerDescription>
          </DrawerHeader>

          {/* ScrollArea para el bloque de código */}
          <ScrollArea className="flex-1 px-4 pb-4">
              <CodeBlock
                language="cpp"
                filename="SensorCode.ino"
                highlightLines={[28, 39, 40, 41, 42]}
                code={code}
              />
          </ScrollArea>
        </div>
      </DrawerContent>
    </Drawer>
  );
};