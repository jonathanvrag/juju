export interface CreateBookDto {
  title: string;
  author: string;
  publicationYear: number;
  status: 'available' | 'reserved';
}
