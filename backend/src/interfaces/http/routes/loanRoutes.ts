import { Router } from 'express';
import { LoanController } from '../controllers/LoanController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import {
  createLoanSchema,
  returnLoanSchema,
} from '../validators/loanValidators';

const router = Router();
const loanController = new LoanController();

/**
 * @route   POST /api/loans
 * @desc    Create a new loan (borrow a book)
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  validate(createLoanSchema),
  loanController.create.bind(loanController)
);

/**
 * @route   PUT /api/loans/:id/return
 * @desc    Return a borrowed book
 * @access  Private
 */
router.put(
  '/:id/return',
  authMiddleware,
  validate(returnLoanSchema),
  loanController.returnBook.bind(loanController)
);

/**
 * @route   GET /api/loans/my-loans
 * @desc    Get all loans of the authenticated user
 * @access  Private
 */
router.get(
  '/my-loans',
  authMiddleware,
  loanController.getUserLoans.bind(loanController)
);

export default router;
