import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Set your Render backend URL here
const API_BASE_URL = 'https://digital-warranty-vault.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vault_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error('Token verification failed');
        })
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('vault_token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = (userData, authToken) => {
    localStorage.setItem('vault_token', authToken);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('vault_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);