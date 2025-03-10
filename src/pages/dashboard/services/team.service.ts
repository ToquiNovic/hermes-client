import axios from "axios";
import { AxiosError } from "axios";
import { CreateTeamFormData } from "@/models";

export const getTeamMembers = async (teamId: string) => {
  try {
    const response = await axios.get(`/api/team/${teamId}/members`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener miembros del equipo:", error);
    throw new Error("Hubo un error al obtener los miembros del equipo.");
  }
};

export const joinTeam = async (userId: string, inviteCode: string) => {
  try {
    const response = await axios.post(`/api/user/jointeam`, {
      inviteCode,
      userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error al unirse al equipo:", error);
    throw new Error("Hubo un error al unirse al equipo.");
  }
};

export const createTeam = async (teamData: CreateTeamFormData) => {
  try {
    const response = await axios.post(`/api/team`, teamData);

    if (response.data.success) {
      return response.data;
    }

    console.warn("Respuesta inesperada al crear el equipo:", response.data);
    throw new Error(response.data.message || "Respuesta inesperada del servidor.");
  } catch (error: unknown) {
    console.error("Error al crear el equipo:", error);

    if (error instanceof AxiosError && error.response?.data) {
      throw new Error(error.response.data.message || "Error desconocido del servidor.");
    }

    throw new Error("Hubo un error al crear el equipo.");
  }
};