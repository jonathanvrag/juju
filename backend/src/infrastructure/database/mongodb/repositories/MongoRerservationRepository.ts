import { IReservationRepository } from '../../../../domain/repositories/IReservationRepository';
import { Reservation } from '../../../../domain/entities/Reservation';
import { ReservationModel } from '../models/ReservationModel';

export class MongoReservationRepository implements IReservationRepository {
  async create(reservation: Reservation): Promise<Reservation> {
    const newReservation = await ReservationModel.create(reservation);
    return this.toEntity(newReservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await ReservationModel.findById(id).populate('bookId');
    return reservation ? this.toEntity(reservation) : null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await ReservationModel.find({ userId })
      .populate('bookId')
      .sort({ createdAt: -1 });
    return reservations.map(this.toEntity);
  }

  async findActiveByBookId(bookId: string): Promise<Reservation | null> {
    const reservation = await ReservationModel.findOne({
      bookId,
      status: 'active',
    }).populate('bookId');
    return reservation ? this.toEntity(reservation) : null;
  }

  async update(
    id: string,
    data: Partial<Reservation>
  ): Promise<Reservation | null> {
    const reservation = await ReservationModel.findByIdAndUpdate(id, data, {
      new: true,
    }).populate('bookId');
    return reservation ? this.toEntity(reservation) : null;
  }

  async findExpired(): Promise<Reservation[]> {
    const now = new Date();
    const reservations = await ReservationModel.find({
      status: 'active',
      expirationDate: { $lt: now },
    }).populate('bookId');
    return reservations.map(this.toEntity);
  }

  private toEntity(doc: any): Reservation {
    const hasPopulatedBook = doc.bookId && doc.bookId._id;

    return {
      id: doc._id.toString(),
      bookId: hasPopulatedBook
        ? doc.bookId._id.toString()
        : doc.bookId?.toString() || '',
      userId: doc.userId.toString(),
      reservationDate: doc.reservationDate,
      expirationDate: doc.expirationDate,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      book: hasPopulatedBook
        ? {
            id: doc.bookId._id.toString(),
            title: doc.bookId.title,
            author: doc.bookId.author,
            isbn: doc.bookId.isbn,
            coverImage: doc.bookId.coverImage,
          }
        : undefined,
    };
  }
}
