import axios from "axios";
import { TeamResponse } from "@/models";

export const getTeamById = async (id: string): Promise<TeamResponse | null> => {
  try {
    const response = await axios.get(`/api/team/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error obteniendo el equipo:", error);
    return null;
  }
};