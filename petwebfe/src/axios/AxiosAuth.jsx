import api from "../api";

export const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

// Signup API
export const signup = async (email, password, name) => {
  const response = await api.post("/auth/register", { email, password, name });
  return response.data;
};
