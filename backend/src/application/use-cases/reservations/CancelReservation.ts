import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Reservation } from '../../../domain/entities/Reservation';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

export class CancelReservation {
  constructor(
    private reservationRepository: IReservationRepository,
    private bookRepository: IBookRepository
  ) {}

  async execute(reservationId: string, userId: string): Promise<Reservation> {
    const reservation =
      await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new ConflictError('You can only cancel your own reservations');
    }

    if (reservation.status !== 'active') {
      throw new ConflictError('Reservation is not active');
    }

    const updatedReservation = await this.reservationRepository.update(
      reservationId,
      {
        status: 'cancelled',
      }
    );

    await this.bookRepository.update(reservation.bookId, {
      status: 'available',
    });

    return updatedReservation!;
  }
}
