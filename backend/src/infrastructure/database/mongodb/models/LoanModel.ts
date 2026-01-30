import mongoose, { Schema, Document } from 'mongoose';
import { Loan } from '../../../../domain/entities/Loan';

export interface LoanDocument
  extends Omit<Loan, 'id' | 'bookId' | 'userId'>, Document {
  bookId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
}

const loanSchema = new Schema<LoanDocument>(
  {
    bookId: {
      type: Schema.Types.ObjectId,
      ref: 'Book',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loanDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'returned', 'overdue'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

loanSchema.index({ bookId: 1 });
loanSchema.index({ userId: 1 });
loanSchema.index({ status: 1 });
loanSchema.index({ dueDate: 1 });

export const LoanModel = mongoose.model<LoanDocument>('Loan', loanSchema);
