export interface Loan {
  id?: string;
  bookId: string;
  userId: string;
  loanDate: Date;
  dueDate: Date;
  returnDate?: Date;
  status: 'active' | 'returned' | 'overdue';
  createdAt?: Date;
  updatedAt?: Date;
}
