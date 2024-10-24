import axios, { AxiosError } from "axios";

// Función para registrar un nuevo usuario
export const registerUser = async (username: string, password: string, role: string) => {
  try {
    // Hacer la petición POST a la ruta de registro
    const response = await axios.post("/api/auth/register", {
      username,
      password,
      role
    });

    // Mostrar la respuesta del servidor en la consola
    console.log("Response:", response.data);

    // Retorna los datos de la respuesta si el registro es exitoso
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Manejo de errores: lanza el mensaje de error recibido del servidor
      throw new Error(error.response?.data.message || "Error en el registro");
    } else {
      // Manejo de otros errores desconocidos
      throw new Error("Ocurrió un error desconocido durante el registro");
    }
  }
};
