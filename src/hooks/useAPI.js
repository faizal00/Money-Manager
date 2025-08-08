import { useState } from 'react';

const API_BASE = process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : 'http://localhost:5000/api';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);

  const apiCall = async (endpoint, options = {}) => {
    setLoading(true);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers,
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = response.status !== 204 ? await response.json() : null;
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const authCall = async (endpoint, options = {}) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Auth API Error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { apiCall, authCall, loading };
};