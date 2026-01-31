import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Logger } from '../../../infrastructure/logging/Logger';

export class ExpireReservations {
  constructor(
    private reservationRepository: IReservationRepository,
    private bookRepository: IBookRepository
  ) {}

  async execute(): Promise<number> {
    const expiredReservations = await this.reservationRepository.findExpired();

    if (expiredReservations.length === 0) {
      return 0;
    }

    for (const reservation of expiredReservations) {
      try {
        await this.reservationRepository.update(reservation.id!, {
          status: 'expired',
        });

        await this.bookRepository.update(reservation.bookId, {
          status: 'available',
        });

        Logger.info(
          `[Reservations] Expired reservation ${reservation.id} for book ${reservation.bookId}`
        );
      } catch (error) {
        Logger.error(
          `[Reservations] Error expiring reservation ${reservation.id}:`,
          error
        );
      }
    }

    return expiredReservations.length;
  }
}
