import { Book } from '../entities/Book';

export interface ListBooksQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'available' | 'reserved';
  sortBy?: 'title' | 'author' | 'publicationYear' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface IBookRepository {
  create(book: Book): Promise<Book>;
  findById(id: string): Promise<Book | null>;
  findAll(query: ListBooksQuery): Promise<PaginatedResult<Book>>;
  update(id: string, book: Partial<Book>): Promise<Book | null>;
  delete(id: string): Promise<boolean>;
  existsByTitle(title: string, excludeId?: string): Promise<boolean>;
}
