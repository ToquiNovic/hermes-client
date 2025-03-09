import { useState, useEffect } from 'react';
import axios from 'axios';

export const useCheckBackend = () => {
  const [backendReady, setBackendReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await axios.get('/ping');
        if (response.data === 'pong') {
          setBackendReady(true);
        } else {
          setBackendReady(false);
        }
      } catch (error) {
        console.error('Error checking backend:', error);
        setBackendReady(false);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
  }, []);

  return { backendReady, loading };
};