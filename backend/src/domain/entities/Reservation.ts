export interface Reservation {
  id?: string;
  bookId: string;
  book?: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    coverImage?: string;
  };
  userId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: 'active' | 'fulfilled' | 'cancelled' | 'expired';
  createdAt?: Date;
  updatedAt?: Date;
}
