import React, { createContext, useContext, useState, useEffect } from 'react';
import { logout as apiLogout, clearTokens } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
      const [user, setUser] = useState(() => {
            try {
                  const stored = localStorage.getItem('user');
                  return stored ? JSON.parse(stored) : null;
            } catch {
                  return null;
            }
      });

      const [isLoading, setIsLoading] = useState(false);

      // Called by Login/Register pages after a successful API response
      const onLoginSuccess = (userData) => {
            setUser(userData);
      };

      const handleLogout = async () => {
            setIsLoading(true);
            try {
                  await apiLogout();
            } catch {
                  // Even if the API call fails, clear locally
                  clearTokens();
            } finally {
                  setUser(null);
                  setIsLoading(false);
            }
      };

      return (
            <AuthContext.Provider value={{ user, isLoading, onLoginSuccess, handleLogout }}>
                  {children}
            </AuthContext.Provider>
      );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
      const ctx = useContext(AuthContext);
      if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
      return ctx;
};

export default AuthContext;
