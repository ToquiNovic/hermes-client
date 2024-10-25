import axios, { AxiosError } from "axios";

// Definición de la interfaz SensorData
export interface SensorHistory {
  timestamp: string;
  value: number;
}

export interface SensorData {
  history: SensorHistory[];
  _id: string;
  name: string;
  value: number;
  timestamp: string;
}

// Definición de la interfaz ISensor
export interface ISensor {
  sensor: ISensor;
  id: string;
  name: string;
  team: string;
  data: SensorData[];
  _id: string;
  endpoint: string;
  createdAt: string;
  updatedAt: string;
}

// Servicio para obtener los sensores de un usuario
export const getSensors = async (userId: string, accessToken: string): Promise<ISensor[]> => {
  try {
    const response = await axios.get(`/api/sensor/user/${userId}/sensors`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data.sensors;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al obtener los sensores");
    } else {
      throw new Error("Ocurrió un error desconocido al obtener los sensores");
    }
  }
};

export const getSensorById = async (sensorId: string, accessToken: string): Promise<ISensor> => {
  try {
    const response = await axios.get(`/api/sensor/${sensorId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al obtener el sensor");
    } else {
      throw new Error("Ocurrió un error desconocido al obtener el sensor");
    }
  }
};

export const updateSensorData = async (
  sensorId: string,
  dataId: string,
  newValue: number,
  accessToken: string
): Promise<void> => {
  try {
    // Realiza la solicitud PUT a la API con los valores de sensorId, dataId, y el nuevo valor
    const response = await axios.put(
      `/api/sensor/${sensorId}/data/${dataId}`, 
      {
        newValue, // Enviamos el nuevo valor en el cuerpo de la solicitud
      }, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Incluimos el token de autenticación
        },
      }
    );
    
    // Puedes hacer algo con la respuesta si lo necesitas, por ejemplo, retornar un mensaje de éxito
    console.log("Datos del sensor actualizados:", response.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al actualizar los datos del sensor");
    } else {
      throw new Error("Ocurrió un error desconocido al actualizar los datos del sensor");
    }
  }
};
