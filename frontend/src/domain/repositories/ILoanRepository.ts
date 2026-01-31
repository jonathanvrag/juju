import type { Loan } from '../entities';

export interface CreateLoanData {
  bookId: string;
  dueDate: Date;
}

export interface ILoanRepository {
  create(data: CreateLoanData): Promise<Loan>;
  getUserLoans(): Promise<Loan[]>;
  returnBook(id: string): Promise<Loan>;
}
