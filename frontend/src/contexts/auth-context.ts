import { createContext } from 'react';

// This describes what actions are available for authentication
export interface AuthContextType {
  token: string | null;
  user: { id: string; name: string; email: string } | null;
  login: (newToken: string, remember: boolean) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);