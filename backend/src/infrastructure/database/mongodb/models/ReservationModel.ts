import mongoose, { Schema, Document } from 'mongoose';
import { Reservation } from '../../../../domain/entities/Reservation';

export interface IReservationDocument
  extends Omit<Reservation, 'id' | 'bookId' | 'userId'>, Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const reservationSchema = new Schema<IReservationDocument>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    reservationDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expirationDate: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'fulfilled'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'reservations',
  }
);

reservationSchema.index({ bookId: 1, status: 1 });

reservationSchema.index({ status: 1, expirationDate: 1 });

export const ReservationModel = mongoose.model<IReservationDocument>(
  'Reservation',
  reservationSchema
);
