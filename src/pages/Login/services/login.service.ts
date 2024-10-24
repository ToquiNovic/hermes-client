import axios, { AxiosError } from "axios";

export const loginUser = async (username: string, password: string) => {
  try {
    await axios.post("/api/users", {
      username,
      password,
    });
    return (
      await axios.post("/api/auth/signin", {
        username,
        password,
      })
    ).data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.status === 409) {
        try {
          return (
            await axios.post("/api/auth/signin", {
              username,
              password,
            })
          ).data;
        } catch (err) {
          if (err instanceof AxiosError) {
            throw new Error(err.response?.data.message);
          }
        }
      }
      throw new Error(error.response?.data.message);
    }
  }
};