import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Ensure this is your Render BACKEND URL
const API_BASE_URL = 'https://YOUR-BACKEND-SERVICE-NAME.onrender.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('vault_token') || null);
  const [loading, setLoading] = useState(true);

  // Run session check only once on mount / page refresh
  useEffect(() => {
    const verifyToken = async () => {
      const storedToken = localStorage.getItem('vault_token');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (!res.ok) {
          throw new Error('Token verification failed');
        }

        const data = await res.json();
        setUser(data.user);
        setToken(storedToken);
      } catch (err) {
        console.error('Session expired or invalid:', err);
        localStorage.removeItem('vault_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []); // Empty dependency array prevents re-verifying right on login

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