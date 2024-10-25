import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getSensors, getSensorById, ISensor, SensorData } from "./service/sensor.service";
import { useUserStore } from "@/store/states/userSlice";
import SensorDrawer from './Sensor/SensorDrawer';
import { Bolt, Trash2, ScanEye, BadgePlus } from "lucide-react";

const Sensor = () => {
  const [sensorData, setSensorData] = useState<ISensor[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<ISensor | null>(null);

  const { user, token } = useUserStore();

  const toggleActions = () => setShowActions((prev) => !prev);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const userId = user._id;
        const accessToken = token;

        if (userId && accessToken) {
          const sensorsDataResponse = await getSensors(userId, accessToken);
          setSensorData(sensorsDataResponse);
        } else {
          setError("No se encontraron las credenciales del usuario.");
        }
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSensorData();
  }, [user, token]);

  const handleOpenDrawer = async (sensorId: string) => {
    try {
      if (token) {
        const detailedSensor = await getSensorById(sensorId, token);                
        setSelectedSensor(detailedSensor);
        setShowDrawer(true);
      }
    } catch (err) {
      console.error("Error al obtener detalles del sensor:", err);
    }
  };

  if (loading) return <p>Cargando datos del sensor...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-screen m-4 p-2">
      <div className="flex justify-between mb-4">
        <button
          className={`p-2 text-xl text-gray-600 hover:text-gray-800 ${!showActions ? "invisible" : ""}`}
          onClick={() => console.log("Add new sensor action")}
        >
          <BadgePlus size={24} />
        </button>
        <button
          className="p-2 text-xl text-gray-600 hover:text-gray-800"
          onClick={toggleActions}
        >
          <Bolt />
        </button>
      </div>

      {sensorData && sensorData.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sensorData.map((sensor) => (
            <div key={sensor._id} className="relative">
              {showActions && (
                <button
                  className="absolute top-6 right-2 text-red-600 hover:text-red-800 z-10"
                  onClick={() => console.log(`Eliminar sensor con ID: ${sensor._id}`)}
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button
                onClick={() => handleOpenDrawer(sensor._id)}
                className="absolute bottom-6 left-2 text-gray-600 z-10"
              >
                <ScanEye size={20} />
              </button>

              <Card className="relative w-full p-4 bg-card text-card-foreground shadow my-4">
                <CardHeader>
                  <CardTitle>{sensor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Equipo: {sensor.team}</p>
                  <p className="text-sm text-muted-foreground">
                    Creado: {new Date(sensor.createdAt).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Actualizado: {new Date(sensor.updatedAt).toLocaleString() || "No disponible"}
                  </p>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold">Datos del Sensor:</h4>
                    {sensor.data.length > 0 ? (
                      sensor.data.map((dataPoint: SensorData) => (
                        <div
                          key={`${sensor._id}-${dataPoint._id}`}
                          className="my-2 p-2 bg-gray-100 rounded-md"
                        >
                          <p className="text-sm">Nombre: {dataPoint.name}</p>
                          <p className="text-sm">Valor: {dataPoint.value}</p>
                          <p className="text-sm">
                            Fecha: {new Date(dataPoint.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p>No hay datos disponibles para este sensor.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay sensores disponibles.</p>
      )}

      {selectedSensor && (
        <SensorDrawer
          isOpen={showDrawer}
          onClose={() => setShowDrawer(false)}
          sensor={selectedSensor.sensor} endpoint={""}        />
      )}
    </div>
  );
};

export default Sensor;
