import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  user: { id: string; email: string; nickname: string; name?: string; birthdate?: string; phone?: string; address?: string } | null;
  loading: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string; nickname: string; name?: string; birthdate?: string; phone?: string; address?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:5003/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { _id: id, email, nickname, name, birthdate, phone, address } = response.data.user;
          setUser({ id, email, nickname, name, birthdate, phone, address });
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = (token: string, userData?: any) => {
    localStorage.setItem('token', token);
    setLoading(true); // 로그인 시 로딩 시작
    if (userData) {
      const { id, email, nickname } = userData;
      setUser({ id, email, nickname });
      setLoading(false); // 로딩 완료
    } else {
      axios
        .get('http://localhost:5003/api/user/me', {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          const { _id: id, email, nickname, name, birthdate, phone, address } = response.data.user;
          setUser({ id, email, nickname, name, birthdate, phone, address });
        })
        .catch((err) => {
          console.error('Login API error:', err);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false); // 로딩 완료
        });
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};