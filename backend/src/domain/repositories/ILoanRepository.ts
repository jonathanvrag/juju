import { Loan } from '../entities/Loan';

export interface ILoanRepository {
  create(loan: Loan): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  findByUserId(userId: string): Promise<Loan[]>;
  findActiveByBookId(bookId: string): Promise<Loan | null>;
  findOverdue(): Promise<Loan[]>;
  update(id: string, loan: Partial<Loan>): Promise<Loan | null>;
}
