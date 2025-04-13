import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [role, setRole] = useState(() => localStorage.getItem("role") || null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user details and role after login or app initialization
  const fetchUserDetails = async () => {
    try {
      const response = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userData = response.data.user;
      setUser(userData);
      setRole(userData.role.name);
      localStorage.setItem("role", userData.role.name);
      localStorage.setItem("userId", userData._id);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      logout(); // Clear token and role if fetching user details fails
    } finally {
      setIsLoading(false);
    }
  };

  // Login function to set token and fetch user details
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  // Logout function to clear token, role, and user data
  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
  };

  // Fetch user details on app initialization if token exists
  useEffect(() => {
    if (token) {
      fetchUserDetails();
    } else {
      setIsLoading(false); // No token, stop loading
    }
  }, [token]);

  // Automatically attach token to API requests
  useEffect(() => {
    const authInterceptor = api.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(authInterceptor);
    };
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, role, user, login, logout, isLoading }}
    >
      {!isLoading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};
