import { Loan } from '../../../../domain/entities/Loan';
import { ILoanRepository } from '../../../../domain/repositories/ILoanRepository';
import { LoanModel } from '../models/LoanModel';

export class MongoLoanRepository implements ILoanRepository {
  async create(loan: Loan): Promise<Loan> {
    const createdLoan = await LoanModel.create(loan);
    return this.toEntity(createdLoan);
  }

  async findById(id: string): Promise<Loan | null> {
    const loan = await LoanModel.findById(id);
    return loan ? this.toEntity(loan) : null;
  }

  async findByUserId(userId: string): Promise<Loan[]> {
    const loans = await LoanModel.find({ userId });
    return loans.map(loan => this.toEntity(loan));
  }

  async findActiveByBookId(bookId: string): Promise<Loan | null> {
    const loan = await LoanModel.findOne({
      bookId,
      status: 'active',
    });
    return loan ? this.toEntity(loan) : null;
  }

  async findOverdue(): Promise<Loan[]> {
    const now = new Date();
    const loans = await LoanModel.find({
      status: 'active',
      dueDate: { $lt: now },
    });
    return loans.map(loan => this.toEntity(loan));
  }

  async update(id: string, loan: Partial<Loan>): Promise<Loan | null> {
    const updatedLoan = await LoanModel.findByIdAndUpdate(
      id,
      { $set: loan },
      { new: true }
    );
    return updatedLoan ? this.toEntity(updatedLoan) : null;
  }
  private toEntity(loanDoc: any): Loan {
    return {
      id: loanDoc._id.toString(),
      bookId: loanDoc.bookId.toString(),
      userId: loanDoc.userId.toString(),
      loanDate: loanDoc.loanDate,
      dueDate: loanDoc.dueDate,
      returnDate: loanDoc.returnDate,
      status: loanDoc.status,
      createdAt: loanDoc.createdAt,
      updatedAt: loanDoc.updatedAt,
    };
  }
}
