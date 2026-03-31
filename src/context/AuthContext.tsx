import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (userData: any, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('akayra_user');
    const savedToken = localStorage.getItem('akayra_token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData: any, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('akayra_user', JSON.stringify(userData));
    localStorage.setItem('akayra_token', jwtToken);
    localStorage.setItem('akayra_user_type', userData.type || '5');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('akayra_user');
    localStorage.removeItem('akayra_token');
    localStorage.removeItem('akayra_user_type');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
