import { apiClient } from './apiClient';
import type {
  IBookRepository,
  BookFilters,
  PaginatedBooks,
  CreateBookData,
  UpdateBookData,
} from '../../domain/repositories';
import type { Book } from '../../domain/entities';

export class BookApi implements IBookRepository {
  async getAll(filters: BookFilters): Promise<PaginatedBooks> {
    const { data } = await apiClient.get('/books', { params: filters });
    return {
      books: data.data.books,
      pagination: data.data.pagination,
    };
  }

  async getById(id: string): Promise<Book> {
    const { data } = await apiClient.get(`/books/${id}`);
    return data.data.book;
  }

  async create(bookData: CreateBookData): Promise<Book> {
    const { data } = await apiClient.post('/books', bookData);
    return data.data.book;
  }

  async update(id: string, bookData: UpdateBookData): Promise<Book> {
    const { data } = await apiClient.put(`/books/${id}`, bookData);
    return data.data.book;
  }

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/books/${id}`);
  }
}
