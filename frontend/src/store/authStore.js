import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('userInfo')) || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
    }
  },

  register: async (name, email, password, role) => {
    set({ loading: true, error: null });
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || error.message, 
        loading: false 
      });
    }
  },

  socialLogin: async (provider) => {
    set({ loading: true, error: null });
    try {
      const mockData = {
        name: `Social User (${provider})`,
        email: `user_${provider.toLowerCase()}@taskflow.com`,
        role: 'Admin',
      };
      const { data } = await api.post('/auth/social-login', mockData);
      localStorage.setItem('userInfo', JSON.stringify(data));
      set({ user: data, loading: false });
    } catch (error) {
      set({ 
        error: error.response?.data?.message || 'Social login failed', 
        loading: false 
      });
    }
  },

  forgotPassword: async (email) => {
    set({ loading: true, error: null });
    try {
      // Simulation of sending reset email
      await new Promise(resolve => setTimeout(resolve, 1500));
      set({ loading: false });
      return true;
    } catch (error) {
      set({ error: 'Failed to send reset email', loading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('userInfo');
      set({ user: null });
    } catch (error) {
      console.error(error);
    }
  },
}));

export { api };
export default useAuthStore;
