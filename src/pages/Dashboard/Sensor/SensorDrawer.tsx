import React, { useEffect, useState } from "react";
import { Drawer } from "@/components/ui/drawer";
import { ISensor, SensorData, getSensorById } from "../service/sensor.service";
import { TrendingUp, Clipboard } from "lucide-react";
import { AreaChart, Area, XAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserStore } from "@/store/states/userSlice";

interface SensorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sensor: ISensor;
  endpoint: string;
}

const SensorDrawer: React.FC<SensorDrawerProps> = ({ isOpen, onClose, sensor }) => {

    console.log(sensor);
    
  const [currentSensor, setCurrentSensor] = useState<ISensor>(sensor);
  const [sensorHistory, setSensorHistory] = useState<SensorData[]>(sensor.data || []);

  // Obtener token del store
  const { token } = useUserStore();
  const accessToken = token;

  // Actualizar el sensor en tiempo real y acumular en el historial
  useEffect(() => {
    const updateSensorData = async () => {
      try {
        if (accessToken) {
          const updatedSensor = await getSensorById(sensor._id, accessToken);

          // Verificar si updatedSensor.data es un array antes de intentar usar filter
          if (Array.isArray(updatedSensor.data)) {
            setSensorHistory((prevHistory) => {
              const newHistory = [...prevHistory];

              // Para cada punto de datos en el sensor actualizado, verificamos si ya está en el historial
              updatedSensor.data.forEach((newData) => {
                const existingDataIndex = newHistory.findIndex(
                  (oldData) => oldData._id === newData._id
                );

                if (existingDataIndex !== -1) {
                  // Si ya existe, actualizamos el historial
                  newHistory[existingDataIndex] = {
                    ...newHistory[existingDataIndex],
                    history: [...newHistory[existingDataIndex].history, ...newData.history],
                  };
                } else {
                  // Si es un dato nuevo, lo agregamos al historial
                  newHistory.push(newData);
                }
              });

              return newHistory;
            });
            setCurrentSensor(updatedSensor);
          }
        }
      } catch (error) {
        console.error("Error al actualizar los datos del sensor:", error);
      }
    };

    // Configurar un intervalo para actualizar cada 10 segundos
    const intervalId = setInterval(() => {
      updateSensorData();
    }, 10000);

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [sensor._id, accessToken]);

  // Crear los datos de la gráfica a partir del historial acumulado
  const chartData = sensorHistory.flatMap((dataPoint: SensorData) =>
    dataPoint.history.map((historyPoint) => ({
      name: new Date(historyPoint.timestamp).toLocaleTimeString(),
      value: historyPoint.value,
    }))
  );

  // Obtener el último valor del sensor
  const latestValue = sensorHistory.length > 0
    ? sensorHistory[sensorHistory.length - 1].value
    : "No disponible";

  // Función para copiar el endpoint al portapapeles
  const copyEndpointToClipboard = () => {
    navigator.clipboard.writeText(currentSensor.endpoint)
      .then(() => {
        alert("Endpoint copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar el endpoint:", err);
      });
  };

  return (
    <Drawer open={isOpen} onClose={onClose}>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">{currentSensor.name}</h2>

        {/* Botón para copiar el endpoint al portapapeles */}
        <div className="mb-4 flex items-center">
          <button
            className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={copyEndpointToClipboard}
          >
            <Clipboard size={18} />
            <span>Copiar Endpoint</span>
          </button>
        </div>

        {/* Card con el valor actual del sensor */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Valor Actual del Sensor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestValue}
            </div>
          </CardContent>
        </Card>

        {/* Card con gráfico de datos */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>
              <TrendingUp className="inline mr-2" /> Datos del Sensor
            </CardTitle>
          </CardHeader>
          <CardContent>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p>No hay datos disponibles para este sensor.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Drawer>
  );
};

export default SensorDrawer;
