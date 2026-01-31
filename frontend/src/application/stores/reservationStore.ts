import { create } from 'zustand';
import { ReservationApi } from '../../infrastructure/api';
import type { Reservation } from '../../domain/entities';
import type {
  CreateReservationData,
  FulfillReservationData,
} from '../../domain/repositories';
import type { ApiError } from '../../shared/types';

interface ReservationState {
  reservations: Reservation[];
  isLoading: boolean;
  error: string | null;

  fetchUserReservations: () => Promise<void>;
  createReservation: (data: CreateReservationData) => Promise<void>;
  cancelReservation: (id: string) => Promise<void>;
  fulfillReservation: (
    id: string,
    data: FulfillReservationData
  ) => Promise<void>;
  clearError: () => void;
}

const reservationApi = new ReservationApi();

export const useReservationStore = create<ReservationState>(set => ({
  reservations: [],
  isLoading: false,
  error: null,

  fetchUserReservations: async () => {
    set({ isLoading: true, error: null });
    try {
      const reservations = await reservationApi.getUserReservations();
      set({ reservations, isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al cargar reservas',
        isLoading: false,
      });
    }
  },

  createReservation: async data => {
    set({ isLoading: true, error: null });
    try {
      await reservationApi.create(data);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al crear reserva',
        isLoading: false,
      });
      throw error;
    }
  },

  cancelReservation: async id => {
    set({ isLoading: true, error: null });
    try {
      await reservationApi.cancel(id);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al cancelar reserva',
        isLoading: false,
      });
      throw error;
    }
  },

  fulfillReservation: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      await reservationApi.fulfill(id, data);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al cumplir reserva',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
