// services/backendService.ts
import axios from 'axios';

export const checkBackendStatus = async () => {
  try {
    const response = await axios.get('/ping');
    return response.data.message === 'pong';
  } catch (error) {
    console.error("Error checking backend status:", error);
    return false;
  }
};
