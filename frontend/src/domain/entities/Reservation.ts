export type ReservationStatus =
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'fulfilled';

export interface Reservation {
  id: string;
  bookId: string;
  userId: string;
  reservationDate: Date;
  expirationDate: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
}
