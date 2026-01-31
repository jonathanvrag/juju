export const ReservationStatus = {
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  CANCELLED: 'cancelled',
  EXPIRED: 'expired',
} as const;

export type ReservationStatus = typeof ReservationStatus[keyof typeof ReservationStatus];

export interface Reservation {
  id: string;
  bookId: string;
  book?: {
    id: string;
    title: string;
    author: string;
    isbn?: string;
    coverImage?: string;
  };
  userId: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  reservationDate: Date;
  expirationDate: Date;
  status: ReservationStatus;
}