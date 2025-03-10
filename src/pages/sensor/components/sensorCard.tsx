import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Trash2, IndentIncrease } from "lucide-react";
import { Sensor } from "@/models";
import { ConectSensorDialog } from "./ConectSensorDialog";
import { getSensorData } from "../service";
import { SensorData } from "@/models";

interface SensorCardProps {
  sensor: Sensor;
  onDelete: (sensor: Sensor) => void;
}

export const SensorCard: React.FC<SensorCardProps> = ({ sensor, onDelete }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    const fetchSensorData = async () => {
      if (!sensor.id) return;
      try {
        const sensorData = await getSensorData(sensor.id);
        console.log("sensorData:", sensorData);
        setSensorData(sensorData);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    fetchSensorData();
  }, [sensor.id]);

  return (
    <Card className="shadow-lg rounded-lg relative flex flex-col justify-between h-full">
      <CardHeader className="relative flex flex-col items-center text-center space-y-2">
        <CardTitle>{sensor.name.toUpperCase()}</CardTitle>
        {sensor.description && (
          <CardDescription className="flex items-center gap-x-2">
            {sensor.description.toUpperCase()}
          </CardDescription>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-red-500 hover:bg-red-100"
              onClick={() => onDelete(sensor)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Eliminar</TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="flex flex-col justify-end flex-grow space-y-2">
        {sensorData.length > 0 ? (
          <div
            key={sensorData[0].id}
            className="flex justify-between items-center border-b py-1"
          >
            <span className="font-semibold">{sensorData[0].type}:</span>
            <span>{sensorData[0].value}</span>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">
            No hay datos disponibles
          </span>
        )}
      </CardContent>

      <CardFooter className="flex justify-between mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
            >
              <IndentIncrease className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Campos</TooltipContent>
        </Tooltip>
      </CardFooter>

      {/* Diálogo para agregar campos */}
      <ConectSensorDialog
        sensorId={sensor.id}
        teamId={sensor.teamId}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  );
};
