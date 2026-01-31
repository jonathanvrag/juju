import { Reservation } from '../entities/Reservation';

export interface IReservationRepository {
  create(reservation: Reservation): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findActiveByBookId(bookId: string): Promise<Reservation | null>;
  update(
    id: string,
    reservation: Partial<Reservation>
  ): Promise<Reservation | null>;
  findExpired(): Promise<Reservation[]>;
}
