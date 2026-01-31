import { create } from 'zustand';
import { LoanApi } from '../../infrastructure/api';
import type { Loan } from '../../domain/entities';
import type { CreateLoanData } from '../../domain/repositories';
import type { ApiError } from '../../shared/types';

interface LoanState {
  loans: Loan[];
  isLoading: boolean;
  error: string | null;

  fetchUserLoans: () => Promise<void>;
  createLoan: (data: CreateLoanData) => Promise<void>;
  returnBook: (id: string) => Promise<void>;
  clearError: () => void;
}

const loanApi = new LoanApi();

export const useLoanStore = create<LoanState>(set => ({
  loans: [],
  isLoading: false,
  error: null,

  fetchUserLoans: async () => {
    set({ isLoading: true, error: null });
    try {
      const loans = await loanApi.getUserLoans();
      set({ loans, isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al cargar préstamos',
        isLoading: false,
      });
    }
  },

  createLoan: async data => {
    set({ isLoading: true, error: null });
    try {
      await loanApi.create(data);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al crear préstamo',
        isLoading: false,
      });
      throw error;
    }
  },

  returnBook: async id => {
    set({ isLoading: true, error: null });
    try {
      await loanApi.returnBook(id);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al devolver libro',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
