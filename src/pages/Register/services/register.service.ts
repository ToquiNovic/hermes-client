import axios, { AxiosError } from "axios";

// Registrar usuario
export const registerUser = async (username: string, password: string) => {
  try {
    const response = await axios.post("/api/auth/register", { username, password });
    return response.data; // Debe retornar el id del usuario registrado
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error en el registro");
    } else {
      throw new Error("Ocurrió un error desconocido durante el registro");
    }
  }
};

// Crear equipo
export const createTeam = async (teamName: string, userId: string) => {
  try {
    const response = await axios.post("/api/team/create", { teamName, userId });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al crear el equipo");
    } else {
      throw new Error("Ocurrió un error desconocido durante la creación del equipo");
    }
  }
};

// Unirse a un equipo
export const joinTeam = async (teamCode: string, userId: string) => {
  try {
    const response = await axios.post("/api/team/join", { teamCode, userId });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al unirse al equipo");
    } else {
      throw new Error("Ocurrió un error desconocido al unirse al equipo");
    }
  }
};

export const registerUserWithTeam = async (
  username: string,
  password: string,
  role: string,
  teamName: string
) => {
  try {
    const response = await axios.post("/api/auth/register-with-team", {
      username,
      password,
      role,
      teamName,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al registrar usuario y equipo");
    } else {
      throw new Error("Ocurrió un error desconocido durante el registro");
    }
  }
};

// Unirse a un equipo usando un código de invitación
export const joinTeamWithCode = async (
  username: string,
  password: string,
  role: string,
  codeInvitation: string
) => {
  try {
    const response = await axios.post("/api/auth/register-and-join", {
      username,
      password,
      role,
      codeInvitation,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Error al unirse al equipo con el código");
    } else {
      throw new Error("Ocurrió un error desconocido durante el registro del equipo");
    }
  }
};
