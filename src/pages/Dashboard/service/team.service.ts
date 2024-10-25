import axios, { AxiosError } from "axios";

export interface ITeam {
    id: string;
    name: string;
    codeInvitation: string;
    leader: string;
    members: string[];
    createdAt: string;
    updatedAt: string;
}

export const getTeam = async (userId: string, accessToken: string): Promise<ITeam> => {
  try {
    const response = await axios.get(`/api/team/user/${userId}/team`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });    
    return response.data.team;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al obtener el equipo");
    } else {
      throw new Error("Ocurrió un error desconocido al obtener el equipo");
    }
  }
};
