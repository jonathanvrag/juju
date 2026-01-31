import { apiClient } from './apiClient';
import type {
  ILoanRepository,
  CreateLoanData,
} from '../../domain/repositories';
import type { Loan } from '../../domain/entities';

export class LoanApi implements ILoanRepository {
  async create(loanData: CreateLoanData): Promise<Loan> {
    const { data } = await apiClient.post('/loans', loanData);
    return data.data.loan;
  }

  async getUserLoans(): Promise<Loan[]> {
    const { data } = await apiClient.get('/loans/my-loans');
    return data.data.loans;
  }

  async returnBook(id: string): Promise<Loan> {
    const { data } = await apiClient.put(`/loans/${id}/return`, {});
    return data.data.loan;
  }
}
