import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { ILoanRepository } from '../../../domain/repositories/ILoanRepository';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { Loan } from '../../../domain/entities/Loan';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

export class FulfillReservation {
  constructor(
    private reservationRepository: IReservationRepository,
    private loanRepository: ILoanRepository,
    private bookRepository: IBookRepository
  ) {}

  async execute(
    reservationId: string,
    userId: string,
    loanDueDate: Date
  ): Promise<Loan> {
    const reservation =
      await this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reservation not found');
    }

    if (reservation.userId !== userId) {
      throw new ConflictError('You can only fulfill your own reservations');
    }

    if (reservation.status !== 'active') {
      throw new ConflictError('Reservation is not active');
    }

    if (new Date() > reservation.expirationDate) {
      await this.reservationRepository.update(reservationId, {
        status: 'expired',
      });
      await this.bookRepository.update(reservation.bookId, {
        status: 'available',
      });
      throw new ConflictError('Reservation has expired');
    }

    const loan: Loan = {
      bookId: reservation.bookId,
      userId: reservation.userId,
      loanDate: new Date(),
      dueDate: loanDueDate,
      status: 'active',
    };

    const createdLoan = await this.loanRepository.create(loan);

    await this.reservationRepository.update(reservationId, {
      status: 'fulfilled',
    });

    await this.bookRepository.update(reservation.bookId, { status: 'loaned' });

    return createdLoan;
  }
}
