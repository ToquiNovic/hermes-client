import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { PenTool } from "lucide-react";

interface Sensor {
  id: string;
  name: string;
  type: string;
}

interface SensorItemProps {
  teamId: string;
}

const SensorItem = ({ teamId }: SensorItemProps) => {
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    // Simulación de fetch de sensores (puedes reemplazar con una API real)
    const fetchSensors = async () => {
      // Aquí iría tu petición real a la API
      const mockSensors: Sensor[] = [
        { id: "1", name: "Sensor de Temperatura", type: "Temperatura" },
        { id: "2", name: "Sensor de Humedad", type: "Humedad" },
        { id: "3", name: "Sensor de Presión", type: "Presión" },
      ];
      setSensors(mockSensors);
    };

    fetchSensors();
  }, [teamId]);

  return (
    <BentoGridItem
      title="Sensores del equipo"
      description={
        sensors.length > 0
          ? sensors.map((sensor) => `• ${sensor.name} (${sensor.type})`).join("\n")
          : "No hay sensores disponibles"
      }
      header={
        <div className="flex flex-col items-start justify-center min-h-[6rem] rounded-xl bg-neutral-100 dark:bg-black border dark:border-white/[0.2] p-4">
          <p className="font-bold">📡 Sensores:</p>
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <p key={sensor.id} className="text-sm">
                ✅ {sensor.name} ({sensor.type})
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
