import type { Book } from '../entities';

export interface BookFilters {
  page?: number;
  limit?: number;
  status?: string;
  genre?: string;
  author?: string;
  search?: string;
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
  status?: string;
}

export interface IBookRepository {
  getAll(filters: BookFilters): Promise<PaginatedBooks>;
  getById(id: string): Promise<Book>;
  create(data: CreateBookData): Promise<Book>;
  update(id: string, data: UpdateBookData): Promise<Book>;
  delete(id: string): Promise<void>;
}
