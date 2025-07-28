import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {

  // The initial token is can read from both localStorage and sessionStorage
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  });
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    console.log('AuthContext Effect: Token has changed to ->', token);

    if (token) {
      try {
        const decodedUser: { id: string, name: string, email: string } = jwtDecode(token);
        setUser(decodedUser);
        localStorage.setItem('token', token);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setToken(null);
      }
    } else {
      setUser(null);
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  }, [token]); 

  // The login function now decides where to save the token
  const login = useCallback((newToken: string, remember: boolean) => {
    if (remember) {
      localStorage.setItem('token', newToken);
    } else {
      sessionStorage.setItem('token', newToken);
    }
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    login,
    logout
  }), [token, user, login, logout]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};