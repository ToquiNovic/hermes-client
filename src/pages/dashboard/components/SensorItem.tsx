import { useEffect, useState } from "react";
import { BentoGridItem } from "@/components/ui/bento-grid";
import { SensorItemProps, Sensor } from "@/models/sensor.model";
import { getSensorsByTeam } from "@/pages/sensor/service/sensor.service";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const MAX_VISIBLE_SENSORS = 4;

const SensorItem = ({ teamId }: SensorItemProps) => {
  const [sensors, setSensors] = useState<Sensor[] | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      if (!teamId) return;
      try {
        const sensorData = await getSensorsByTeam(teamId);
        setSensors(sensorData);
      } catch (err) {
        console.error("Error fetching sensors:", err);
        setSensors([]);
      }
    };

    fetchSensors();
  }, [teamId]);

  const SkeletonLoader = () => (
    <Card className="w-full min-h-[6rem]">
      <CardHeader className="text-lg font-bold">📡 Sensores</CardHeader>
      <CardContent>
        <Skeleton className="w-full h-4 mb-2" />
        <Skeleton className="w-3/4 h-4 mb-2" />
        <Skeleton className="w-2/4 h-4" />
      </CardContent>
    </Card>
  );

  const SensorContent = () => {
    if (!teamId) {
      return (
        <Card className="w-full min-h-[6rem]">
          <CardHeader className="text-lg font-bold">📡 Sensores</CardHeader>
          <CardContent>
            <Link to="/sensors" className="text-sm text-red-500 hover:underline">
              El equipo no tiene sensores
            </Link>
          </CardContent>
        </Card>
      );
    }

    if (!sensors?.length) {
      return (
        <div className="w-full min-h-[20rem]">
          <CardHeader className="text-lg font-bold">📡 Sensores</CardHeader>
          <CardContent>
            <Link to="/sensors" className="text-sm text-neutral-500 hover:underline">
              No hay sensores
            </Link>
          </CardContent>
        </div>
      );
    }

    const visibleSensors = sensors.slice(0, MAX_VISIBLE_SENSORS);
    const remainingCount = sensors.length - MAX_VISIBLE_SENSORS;

    return (
      <Card className="w-full min-h-[6rem]">
        <CardHeader className="text-lg font-bold">📡 Sensores</CardHeader>
        <CardContent>
          {visibleSensors.map((sensor) => (
            <p key={sensor.id} className="text-sm">
              ✅ {sensor.name} ({sensor.description})
            </p>
          ))}
          {remainingCount > 0 && (
            <Link to="/sensors" className="text-sm text-gray-500 hover:underline">
              ({remainingCount} más)
            </Link>
          )}
        </CardContent>
      </Card>
    );
  };

  return <BentoGridItem header={sensors === null ? <SkeletonLoader /> : <SensorContent />} className="md:col-span-1" />;
};

export default SensorItem;
