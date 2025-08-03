/* eslint-disable no-useless-catch */
import api from './api';
import { Paths } from '@/paths';

const AUTH_TOKEN_KEY = 'auth_token';

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post(`${Paths.BASE_URL}admin/login`, { email, password });
    
    if (!response.data.token) {
      throw new Error('Authentication failed: No token received');
    }
    
    localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
    return response.data;
  } catch (error) {
    // You could transform the error here if needed
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = () => {
  return !!localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getAuthToken = () => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};