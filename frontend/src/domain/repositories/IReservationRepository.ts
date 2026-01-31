import type { Loan, Reservation } from '../entities';

export interface CreateReservationData {
  bookId: string;
  expirationDate: string;
}

export interface FulfillReservationData {
  loanDueDate: string;
}

export interface IReservationRepository {
  create(data: CreateReservationData): Promise<Reservation>;
  getUserReservations(): Promise<Reservation[]>;
  cancel(id: string): Promise<Reservation>;
  fulfill(id: string, data: FulfillReservationData): Promise<Loan>;
}
