import axios from "axios";

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