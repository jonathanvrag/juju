export interface Reservation {
  id?: string;
  bookId: string;
  userId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: 'active' | 'cancelled' | 'expired' | 'fulfilled';
  createdAt?: Date;
  updatedAt?: Date;
}
