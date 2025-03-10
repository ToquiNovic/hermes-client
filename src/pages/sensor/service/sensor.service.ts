// @/pages/sensor/service/sensor.service.ts
import axios from "axios";
import { Sensor, SensorData, SensorAPIResponse, SensorDataAPIResponse } from "@/models";

interface APIResponse {
  success: boolean;
  message: string;
  data: SensorAPIResponse[];
}

export const getSensorsByTeam = async (id: string): Promise<Sensor[]> => {
  try {
    const response = await axios.get<APIResponse>(`/api/sensor/team/${id}`);

    return response.data.data.map((sensor) => ({
      id: sensor.id,
      name: sensor.name,
      description: sensor.description,
      teamId: sensor.teamId,
    }));
  } catch (error) {
    console.error("Error obteniendo los sensores:", error);
    return [];
  }
};

export const getSensorData = async (id: string): Promise<SensorData[]> => {
  try {
    const response = await axios.get<SensorDataAPIResponse>(`/api/sensor/data/${id}`);

    return response.data.data.map((sensordata) => ({
      id: sensordata.id,
      type: sensordata.type,
      value: sensordata.value,
      createdAt: sensordata.createdAt,
      teamId: sensordata.teamId,
    }));
  } catch (error) {
    console.error("Error obteniendo los datos del sensor:", error);
    return [];
  }
};

