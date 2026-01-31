import { create } from 'zustand';
import { BookApi } from '../../infrastructure/api';
import type { Book } from '../../domain/entities';
import type {
  BookFilters,
  CreateBookData,
  UpdateBookData,
} from '../../domain/repositories';
import type { ApiError } from '../../shared/types';

interface BookState {
  books: Book[];
  selectedBook: Book | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  isLoading: boolean;
  error: string | null;

  fetchBooks: (filters?: BookFilters) => Promise<void>;
  fetchBookById: (id: string) => Promise<void>;
  createBook: (data: CreateBookData) => Promise<void>;
  updateBook: (id: string, data: UpdateBookData) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  clearSelectedBook: () => void;
  clearError: () => void;
}

const bookApi = new BookApi();

export const useBookStore = create<BookState>(set => ({
  books: [],
  selectedBook: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
  isLoading: false,
  error: null,

  fetchBooks: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await bookApi.getAll(filters);
      set({
        books: response.books,
        pagination: response.pagination,
        isLoading: false,
      });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al cargar libros',
        isLoading: false,
      });
    }
  },

  fetchBookById: async id => {
    set({ isLoading: true, error: null });
    try {
      const book = await bookApi.getById(id);
      set({ selectedBook: book, isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al cargar el libro',
        isLoading: false,
      });
    }
  },

  createBook: async data => {
    set({ isLoading: true, error: null });
    try {
      await bookApi.create(data);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al crear libro',
        isLoading: false,
      });
      throw error;
    }
  },

  updateBook: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBook = await bookApi.update(id, data);
      set({ selectedBook: updatedBook, isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al actualizar libro',
        isLoading: false,
      });
      throw error;
    }
  },

  deleteBook: async id => {
    set({ isLoading: true, error: null });
    try {
      await bookApi.delete(id);
      set({ isLoading: false });
    } catch (err) {
      const error = err as ApiError;
      set({
        error: error.response?.data?.message || 'Error al eliminar libro',
        isLoading: false,
      });
      throw error;
    }
  },

  clearSelectedBook: () => set({ selectedBook: null }),
  clearError: () => set({ error: null }),
}));
