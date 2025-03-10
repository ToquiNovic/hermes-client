import { ContentLayout } from "@/components/app/sidebar/content-layout";
import { Button } from "@/components/ui/button";
import { ChevronRight, UtilityPole, Plus } from "lucide-react";
import { useUser } from "@/hooks";
import { useAuth } from "@/context";
import { Sensor } from "@/models";
import { SensorCard } from "./components";
import { useEffect, useState } from "react";
import { getSensorsByTeam } from "./service";

export const SensorsPage = () => {
  const { user } = useAuth();
  const { userData, loading, error } = useUser(user?.id || "");
  const [sensors, setSensors] = useState<Sensor[]>([]);

  useEffect(() => {
    const fetchSensors = async () => {
      if (!userData?.teamId || loading) return;
      try {
        const sensorData = await getSensorsByTeam(userData.teamId);
        console.log("sensorData:", sensorData);
        setSensors(sensorData);
      } catch (err) {
        console.error("Error fetching sensors:", err);
      }
    };

    fetchSensors();
  }, [userData?.teamId, loading]);

  return (
    <ContentLayout title="Sensores" icon={<UtilityPole />}>
      <div className="w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center gap-x-2">
            <ChevronRight />
            {loading
              ? "Cargando..."
              : error
              ? "Error"
              : userData?.name || "Sensores"}
          </h1>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>

        {/* Grid de Sensores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <SensorCard key={sensor.id} sensor={sensor} onDelete={() => {}} />
            ))
          ) : (
            <div className="border rounded-lg p-4 flex items-center justify-center bg-neutral-800 text-white cursor-pointer hover:bg-neutral-700 transition">
              <Plus className="mr-2" />
              <span className="text-lg">Create new sensor</span>
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
