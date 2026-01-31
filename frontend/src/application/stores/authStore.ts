import { create } from 'zustand';
import { AuthApi } from '../../infrastructure/api';
import { TokenStorage } from '../../infrastructure/storage';
import type { User } from '../../domain/entities';
import type { LoginCredentials, RegisterData } from '../../domain/repositories';
import type { ApiError } from '../../shared/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

const authApi = new AuthApi();

export const useAuthStore = create<AuthState>(set => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async credentials => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);
      TokenStorage.save(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al iniciar sesión',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async data => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(data);
      TokenStorage.save(response.token);
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al registrarse',
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    TokenStorage.remove();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  checkAuth: async () => {
    const token = TokenStorage.get();
    if (!token) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getCurrentUser(token);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      TokenStorage.remove();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
