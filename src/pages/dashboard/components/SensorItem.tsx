// @/pages/dashboard/components/SensorItem.tsx
import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { PenTool } from "lucide-react";
import { SensorItemProps, Sensor } from "@/models/sensor.model";

const SensorItem = ({ teamId }: SensorItemProps) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  // console.log("teamId:", teamId);

  useEffect(() => {
    if (!teamId) return;
    const fetchSensors = async () => {
      const mockSensors: Sensor[] = [
        { id: "1", name: "Sensor de Temperatura", teamId: teamId },
        { id: "2", name: "Sensor de Humedad", teamId: teamId },
        { id: "3", name: "Sensor de Presión", teamId: teamId },
      ];
      setSensors(mockSensors);
    };

    fetchSensors();
  }, [teamId]);

  return (
    <BentoGridItem
      title="Sensores del equipo"
      description={
        !teamId
          ? "El equipo no tiene sensores"
          : sensors.length > 0
          ? sensors.map((sensor) => `• ${sensor.name} (${sensor.description})`).join("\n")
          : "No hay sensores disponibles"
      }
      header={
        <div className="flex flex-col items-start justify-center min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2] p-4">
          <p className="font-bold">📡 Sensores:</p>
          {!teamId ? (
            <p className="text-sm text-red-500">El equipo no tiene sensores</p>
          ) : sensors.length > 0 ? (
            sensors.map((sensor) => (
              <p key={sensor.id} className="text-sm">
                ✅ {sensor.name} ({sensor.description})
              </p>
            ))
          ) : (
            <p className="text-sm text-neutral-500">No hay sensores</p>
          )}
        </div>
      }
      className="md:col-span-1"
      icon={<PenTool className="h-4 w-4 text-neutral-500" />}
    />
  );
};

export default SensorItem;

