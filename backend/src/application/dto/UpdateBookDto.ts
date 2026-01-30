export interface UpdateBookDto {
  title?: string;
  author?: string;
  publicationYear?: number;
  status?: 'available' | 'reserved';
}
