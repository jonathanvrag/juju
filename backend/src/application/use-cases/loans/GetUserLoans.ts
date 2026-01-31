import { Loan } from '../../../domain/entities/Loan';
import { ILoanRepository } from '../../../domain/repositories/ILoanRepository';

export class GetUserLoans {
  constructor(private loanRepository: ILoanRepository) {}

  async execute(userId: string): Promise<Loan[]> {
    return await this.loanRepository.findByUserId(userId);
  }
}
