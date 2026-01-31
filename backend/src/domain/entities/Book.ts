export interface Book {
  id?: string;
  title: string;
  author: string;
  publicationYear: number;
  status: 'available' | 'reserved' | 'loaned';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
