import { IReservationRepository } from '../../../../domain/repositories/IReservationRepository';
import { Reservation } from '../../../../domain/entities/Reservation';
import { ReservationModel } from '../models/ReservationModel';

export class MongoReservationRepository implements IReservationRepository {
  async create(reservation: Reservation): Promise<Reservation> {
    const newReservation = await ReservationModel.create(reservation);
    return this.toEntity(newReservation);
  }

  async findById(id: string): Promise<Reservation | null> {
    const reservation = await ReservationModel.findById(id);
    return reservation ? this.toEntity(reservation) : null;
  }

  async findByUserId(userId: string): Promise<Reservation[]> {
    const reservations = await ReservationModel.find({ userId }).sort({
      createdAt: -1,
    });
    return reservations.map(this.toEntity);
  }

  async findActiveByBookId(bookId: string): Promise<Reservation | null> {
    const reservation = await ReservationModel.findOne({
      bookId,
      status: 'active',
    });
    return reservation ? this.toEntity(reservation) : null;
  }

  async update(
    id: string,
    data: Partial<Reservation>
  ): Promise<Reservation | null> {
    const reservation = await ReservationModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return reservation ? this.toEntity(reservation) : null;
  }

  async findExpired(): Promise<Reservation[]> {
    const now = new Date();
    const reservations = await ReservationModel.find({
      status: 'active',
      expirationDate: { $lt: now },
    });
    return reservations.map(this.toEntity);
  }

  private toEntity(doc: any): Reservation {
    return {
      id: doc._id.toString(),
      bookId: doc.bookId.toString(),
      userId: doc.userId.toString(),
      reservationDate: doc.reservationDate,
      expirationDate: doc.expirationDate,
      status: doc.status,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
