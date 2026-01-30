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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

bookSchema.index({ title: 1 });
bookSchema.index({ author: 1 });
bookSchema.index({ status: 1 });

export const bookModel = mongoose.model<BookDocument>('Book', bookSchema);
