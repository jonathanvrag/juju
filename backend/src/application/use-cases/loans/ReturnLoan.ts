import { Loan } from '../../../domain/entities/Loan';
import { ILoanRepository } from '../../../domain/repositories/ILoanRepository';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { ValidationError } from '../../../shared/errors/ValidationError';

export class ReturnBook {
  constructor(
    private loanRepository: ILoanRepository,
    private bookRepository: IBookRepository
  ) {}

  async execute(loanId: string, returnDate?: Date): Promise<Loan> {
    const loan = await this.loanRepository.findById(loanId);
    if (!loan) {
      throw new NotFoundError('Loan not found');
    }

    if (loan.status !== 'active') {
      throw new ValidationError('Loan is not active');
    }

    const updatedLoan = await this.loanRepository.update(loanId, {
      returnDate: returnDate || new Date(),
      status: 'returned',
      updatedAt: new Date(),
    });

    if (!updatedLoan) {
      throw new NotFoundError('Loan not found');
    }

    await this.bookRepository.update(loan.bookId, { status: 'available' });

    return updatedLoan;
  }
}
