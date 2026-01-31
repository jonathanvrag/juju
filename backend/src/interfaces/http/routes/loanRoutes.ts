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
 * @swagger
 * /api/loans:
 *   post:
 *     summary: Create a new loan (borrow a book directly)
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - dueDate
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 679d4680452aaa6de8fdf1ae
 *                 description: ID of the book to borrow
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-15T23:59:59.000Z
 *                 description: Due date for returning the book
 *     responses:
 *       201:
 *         description: Loan created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     loan:
 *                       $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Book not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Book not available for loan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authMiddleware,
  validate(createLoanSchema),
  loanController.create.bind(loanController)
);

/**
 * @swagger
 * /api/loans/{id}/return:
 *   put:
 *     summary: Return a borrowed book
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Loan ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               returnDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-01-30T10:30:00.000Z
 *                 description: Return date (defaults to current date if not provided)
 *     responses:
 *       200:
 *         description: Book returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     loan:
 *                       $ref: '#/components/schemas/Loan'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Loan not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Loan is not active
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put(
  '/:id/return',
  authMiddleware,
  validate(returnLoanSchema),
  loanController.returnBook.bind(loanController)
);

/**
 * @swagger
 * /api/loans/my-loans:
 *   get:
 *     summary: Get all loans of the authenticated user
 *     tags: [Loans]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Loans retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     loans:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Loan'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/my-loans',
  authMiddleware,
  loanController.getUserLoans.bind(loanController)
);

export default router;
