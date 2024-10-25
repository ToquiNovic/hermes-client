import React, { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { ISensor, SensorData, getSensorById } from "../service/sensor.service";
import { TrendingUp, Clipboard } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/store/states/userSlice";
import { toast } from "sonner";

interface SensorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sensor: ISensor;
}

const SensorDrawer: React.FC<SensorDrawerProps> = ({
  isOpen,
  onClose,
  sensor,
}) => {
  const [currentSensor, setCurrentSensor] = useState<ISensor>(sensor);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>(
    sensor.data || []
  );
  const [endpoint, setEndpoint] = useState<string>("");

  const { token } = useUserStore();

  useEffect(() => {
    const updateSensorData = async () => {
      try {
        if (token) {
          const { sensor: updatedSensor, endpoint } = await getSensorById(
            sensor._id,
            token
          );

          if (Array.isArray(updatedSensor.data)) {
            setSensorHistory(updatedSensor.data);
            setCurrentSensor(updatedSensor);
            setEndpoint(endpoint);
          }
        }
      } catch (error) {
        console.error("Error al actualizar los datos del sensor:", error);
      }
    };

    const intervalId = setInterval(updateSensorData, 1000);

    return () => clearInterval(intervalId);
  }, [sensor._id, token]);

  const copyEndpointToClipboard = (dataPointId: string) => {
    const fullEndpoint = `${endpoint}/${dataPointId}`;
    navigator.clipboard
      .writeText(fullEndpoint)
      .then(() => {
        toast.success(
          <span>
            Endpoint copiado al portapapeles:{" "}
            <a
              href={fullEndpoint}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4CAF50" }}
            >
              {fullEndpoint}
            </a>
          </span>
        );
      })
      .catch((err) => {
        toast.error("Error al copiar el endpoint");
        console.error("Error al copiar el endpoint:", err);
      });
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{currentSensor.name}</h2>

        {sensorHistory.map((dataPoint) => {
          const chartData = dataPoint.history.map((historyPoint) => ({
            name: new Date(historyPoint.timestamp).toLocaleTimeString(),
            value: historyPoint.value,
          }));

          return (
            <Card key={dataPoint._id} className="mb-4">
              <CardHeader>
                <CardTitle>
                  <TrendingUp />
                  {dataPoint.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">
                  Valor Actual: {dataPoint.value}
                </div>

                {/* Botón de "Copiar al portapapeles" para cada punto de datos */}
                <div className="mb-4 flex items-center">
                  <button
                    className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => copyEndpointToClipboard(dataPoint._id)}
                  >
                    <Clipboard size={18} />
                    <span>Copiar Endpoint</span>
                  </button>
                </div>

                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p>No hay datos disponibles para este sensor.</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </Drawer>
  );
};

export default SensorDrawer;
