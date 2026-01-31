import { Request, Response, NextFunction } from 'express';
import { CreateLoan } from '../../../application/use-cases/loans/CreateLoan';
import { ReturnBook } from '../../../application/use-cases/loans/ReturnLoan';
import { GetUserLoans } from '../../../application/use-cases/loans/GetUserLoans';
import { MongoLoanRepository } from '../../../infrastructure/database/mongodb/repositories/MongoLoanRepository';
import { MongoBookRepository } from '../../../infrastructure/database/mongodb/repositories/MongoBookRepository';
import { Logger } from '../../../infrastructure/logging/Logger';

export class LoanController {
  private loanRepository = new MongoLoanRepository();
  private bookRepository = new MongoBookRepository();

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const createLoan = new CreateLoan(
        this.loanRepository,
        this.bookRepository
      );

      const dto = {
        ...req.body,
        userId: req.user?.userId,
      };

      const loan = await createLoan.execute(dto);

      Logger.info(
        `[Loans] Loan created for book ${loan.bookId} by user ${req.user?.userId}`
      );

      res.status(201).json({
        status: 'success',
        data: { loan },
      });
    } catch (error) {
      next(error);
    }
  }

  async returnBook(req: Request, res: Response, next: NextFunction) {
    try {
      const returnBook = new ReturnBook(
        this.loanRepository,
        this.bookRepository
      );
      const loanId = req.params.id as string;

      const loan = await returnBook.execute(loanId, req.body.returnDate);

      Logger.info(
        `[Loans] Book returned for loan ${loanId} by user ${req.user?.userId}`
      );

      res.status(200).json({
        status: 'success',
        data: { loan },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserLoans(req: Request, res: Response, next: NextFunction) {
    try {
      const getUserLoans = new GetUserLoans(this.loanRepository);

      const loans = await getUserLoans.execute(req.user?.userId!);

      res.status(200).json({
        status: 'success',
        data: { loans },
      });
    } catch (error) {
      next(error);
    }
  }
}
