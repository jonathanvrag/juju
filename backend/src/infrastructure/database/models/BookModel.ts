import mongoose, { Schema, Document } from 'mongoose';
import { Book } from '../../../domain/entities/Book';

export interface BookDocument extends Omit<Book, 'id'>, Document {}

const bookSchema = new Schema<BookDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    publicationYear: {
      type: Number,
      required: true,
      min: 1000,
      max: new Date().getFullYear() + 1,
    },
    status: {
      type: String,
      enum: ['available', 'reserved'],
      default: 'available',
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ status: 1 });
bookSchema.index({ deletedAt: 1 });

export const BookModel = mongoose.model<BookDocument>('Book', bookSchema);
