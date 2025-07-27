import { createContext } from 'react';

export interface AuthContextType {
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  login: (newToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);