import { useState, useEffect } from 'react';
import api from '../services/api';
import type { Personal } from '../types/personal';

export const usePersonal = () => {
  const [personal, setPersonal] = useState<Personal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPersonal = async () => {
      try {
        const response = await api.get('/personal');
        setPersonal(response.data);
      } catch (error) {
        console.error('Error fetching personal:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPersonal();
  }, []);

  return { personal, isLoading };
};
