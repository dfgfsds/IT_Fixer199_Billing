import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Api from '../api-endpoints/ApiUrls'

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);

      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);


  const login = async (email, password, role) => {
    try {
      setIsLoading(true);

      const response = await axios.post(Api.login, {
        username: email,
        password,
        role,
        login_type: "PASSWORD",
        device_type: "ANDROID",
        device_id: "web",
        device_name: "Chrome",
        ip_address: "127.0.0.1"
      });
      if (response) {
        const user = response.data?.data?.user;
        const token = response.data?.data?.tokens?.access;
        const refresh = response.data?.data?.tokens?.refresh;
          if (!token) {
        throw new Error("Token not received");
      }

      setToken(token);
      setUser(user);

      localStorage.setItem("token", token);
      localStorage.setItem("refresh", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      
        window.location.reload(); // ✅ correct
      }

    

    } catch (error) {

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Login failed";

      throw new Error(message);   // ⭐ IMPORTANT
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('refresh');

    window.location.reload(); // ✅ correct
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};