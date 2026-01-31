import { IReservationRepository } from '../../../domain/repositories/IReservationRepository';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { CreateReservationDto } from '../../dtos/ReservationDto';
import { Reservation } from '../../../domain/entities/Reservation';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ConflictError } from '../../../shared/errors/ConflictError';

export class CreateReservation {
  constructor(
    private reservationRepository: IReservationRepository,
    private bookRepository: IBookRepository
  ) {}

  async execute(dto: CreateReservationDto): Promise<Reservation> {
    const book = await this.bookRepository.findById(dto.bookId);
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    if (book.status !== 'available') {
      throw new ConflictError('Book is not available for reservation');
    }

    const existingReservation =
      await this.reservationRepository.findActiveByBookId(dto.bookId);
    if (existingReservation) {
      throw new ConflictError('Book already has an active reservation');
    }

    const reservation: Reservation = {
      bookId: dto.bookId,
      userId: dto.userId,
      reservationDate: new Date(),
      expirationDate: dto.expirationDate,
      status: 'active',
    };

    const createdReservation =
      await this.reservationRepository.create(reservation);

    await this.bookRepository.update(dto.bookId, { status: 'reserved' });

    return createdReservation;
  }
}
