export type BookStatus = 'available' | 'reserved' | 'loaned';

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publishedYear: number;
  genre: string;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
}
