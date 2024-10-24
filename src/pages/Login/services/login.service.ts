import axios, { AxiosError } from "axios";

export const loginUser = async (username: string, password: string) => {
  try {
    // Realiza el login con la URL proporcionada
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      username,
      password,
    });

    // Retorna los datos de la respuesta si la autenticación es exitosa
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Manejo de errores: lanza el mensaje de error recibido del servidor
      throw new Error(error.response?.data.message || "Error de autenticación");
    } else {
      // Manejo de otros errores desconocidos
      throw new Error("Ocurrió un error desconocido durante el login");
    }
  }
};
