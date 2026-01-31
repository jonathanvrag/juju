import { Loan } from '../../../domain/entities/Loan';
import { ILoanRepository } from '../../../domain/repositories/ILoanRepository';
import { IBookRepository } from '../../../domain/repositories/IBookRepository';
import { CreateLoanDto } from '../../dtos/CreateLoanDto';
import { ValidationError } from '../../../shared/errors/ValidationError';
import { NotFoundError } from '../../../shared/errors/NotFoundError';

export class CreateLoan {
  constructor(
    private loanRepository: ILoanRepository,
    private bookRepository: IBookRepository
  ) {}

  async execute(dto: CreateLoanDto): Promise<Loan> {
    const book = await this.bookRepository.findById(dto.bookId);
    if (!book) {
      throw new NotFoundError('Book not found');
    }

    if (book.status !== 'available') {
      throw new ValidationError('Book is not available for loan');
    }

    const activeLoan = await this.loanRepository.findActiveByBookId(dto.bookId);
    if (activeLoan) {
      throw new ValidationError('Book already has an active loan');
    }

    const loan: Loan = {
      bookId: dto.bookId,
      userId: dto.userId,
      loanDate: new Date(),
      dueDate: dto.dueDate,
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdLoan = await this.loanRepository.create(loan);

    await this.bookRepository.update(dto.bookId, { status: 'reserved' });

    return createdLoan;
  }
}
