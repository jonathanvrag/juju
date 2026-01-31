import type { Book } from '../entities/Book';

export interface BookFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'available' | 'reserved' | 'loaned';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedBooks {
  books: Book[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface CreateBookData {
  title: string;
  author: string;
  publicationYear: number;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  publicationYear?: number;
  status?: 'available' | 'reserved' | 'loaned';
}

export interface IBookRepository {
  getAll(filters: BookFilters): Promise<PaginatedBooks>;
  getById(id: string): Promise<Book>;
  create(bookData: CreateBookData): Promise<Book>;
  update(id: string, bookData: UpdateBookData): Promise<Book>;
  delete(id: string): Promise<void>;
}
