import { useState, useEffect, useMemo, useCallback } from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './auth-context';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
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
    }
  }, [token]); 

  const login = useCallback((newToken: string) => {

        // --- DEBUGGING STEP 2: Check if login function is called with the token ---
    console.log('AuthProvider login function called with token:', newToken);
    
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