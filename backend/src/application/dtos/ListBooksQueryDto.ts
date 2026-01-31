export interface ListBooksQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'available' | 'reserved';
  sortBy?: 'title' | 'author' | 'publicationYear' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}
