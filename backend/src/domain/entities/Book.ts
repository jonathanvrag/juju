export interface Book {
  id?: string;
  title: string;
  author: string;
  publicationYear: number;
  status: 'available' | 'reserved';
  createdAt?: Date;
  updatedAt?: Date;
}
