// @/pages/sensor/components/DialogGraph.tsx
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { SensorData } from "@/models";
import { useEffect, useState } from "react";
import { getSensorData } from "../service";
import { Bar, BarChart } from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";

interface DialogGraphProps {
  isOpen: boolean;
  sensorId: string;
  onClose: () => void;
}

export const DialogGraph = ({
  isOpen,
  onClose,
  sensorId,
}: DialogGraphProps) => {
  const [sensorData, setSensorData] = useState<SensorData[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    const fetchSensorData = async () => {
      if (!sensorId) return;
      try {
        const data = await getSensorData(sensorId);
        setSensorData(data);
      } catch (err) {
        console.error("Error fetching sensor data:", err);
      }
    };

    if (isOpen) {
      fetchSensorData();
      interval = setInterval(() => {
        fetchSensorData();
      }, 5000);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isOpen, sensorId]);

  const chartData = sensorData.map((data) => ({
    timestamp: data.createdAt,
    value: data.value,
  }));

  const chartConfig = {
    value: {
      label: "Sensor Value",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
          <DrawerHeader className="p-4 border-b">
            <DrawerTitle>Graph Dialog</DrawerTitle>
            <DrawerDescription>
              Aquí puedes ver el gráfico con los datos del sensor.
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 p-4">
            {sensorData.length > 0 ? (
              <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                <BarChart data={chartData}>
                  <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p>No hay datos disponibles para mostrar en el gráfico.</p>
            )}
          </div>

          <div className="p-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
