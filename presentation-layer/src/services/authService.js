import api from './api.js';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = (data) => {
  return api.post("/auth/register", data);
};


