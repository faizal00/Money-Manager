import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('finance-app-user');
    if (savedUser && savedUser !== 'undefined') {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('finance-app-user');
        localStorage.removeItem('finance-app-token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('finance-app-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('finance-app-user');
    // Clear any cached data
    localStorage.removeItem('finance-transactions');
    localStorage.removeItem('finance-settings');
  };

  return { user, login, logout, isLoading };
};