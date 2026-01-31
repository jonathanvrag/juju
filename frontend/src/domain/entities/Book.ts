export type BookStatus = 'available' | 'reserved' | 'loaned';

export interface Book {
  id: string;
  title: string;
  author: string;
  publicationYear: number;
  status: BookStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
