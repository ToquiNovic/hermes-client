// @/pages/sensor/service/sensor.service.ts
import axios from "axios";
import { Sensor, SensorData, SensorAPIResponse, SensorDataAPIResponse, CreateSensorFormData } from "@/models";
import { AxiosError } from "axios";

interface APIResponse {
  success: boolean;
  message: string;
  data: SensorAPIResponse[];
}

export const createSensor = async (sensorData: CreateSensorFormData) => {
  try {
    const response = await axios.post<APIResponse>(`/api/sensor`, sensorData);

    if (response.data.success) {
      return response.data;
    }

    console.warn("Respuesta inesperada al crear el sensor:", response.data);
    throw new Error(response.data.message || "Respuesta inesperada del servidor.");
  } catch (error: unknown) {
    console.error("Error al crear el sensor:", error);

    if (error instanceof AxiosError && error.response?.data) {
      throw new Error(error.response.data.message || "Error desconocido del servidor.");
    }

    throw new Error("Hubo un error al crear el sensor.");
  }
};

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
    }));
  } catch (error) {
    console.error("Error obteniendo los datos del sensor:", error);
    return [];
  }
};

export const deleteSensor = async (id: string) => {
  try {
    const response = await axios.delete(`/api/sensor/${id}`);

    if (response.data.success) {
      return response.data;
    }

    console.warn("Respuesta inesperada al eliminar el sensor:", response.data);
    throw new Error(response.data.message || "Respuesta inesperada del servidor.");
  } catch (error: unknown) {
    console.error("Error al eliminar el sensor:", error);

    if (error instanceof AxiosError && error.response?.data) {
      throw new Error(error.response.data.message || "Error desconocido del servidor.");
    }

    throw new Error("Hubo un error al eliminar el sensor.");
  }
};

