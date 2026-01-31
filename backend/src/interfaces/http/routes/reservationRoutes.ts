import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import {
  createReservationSchema,
  fulfillReservationSchema,
} from '../validators/reservationValidators';

const router = Router();
const reservationController = new ReservationController();

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Create a new reservation (reserve a book)
 *     tags: [Reservations]
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
 *               - expirationDate
 *             properties:
 *               bookId:
 *                 type: string
 *                 example: 679d4680452aaa6de8fdf1ae
 *                 description: ID of the book to reserve
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-05T23:59:59.000Z
 *                 description: Date when the reservation expires (deadline to pick up the book)
 *     responses:
 *       201:
 *         description: Reservation created successfully
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
 *                     reservation:
 *                       $ref: '#/components/schemas/Reservation'
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
 *         description: Book not available or already has an active reservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  authMiddleware,
  validate(createReservationSchema),
  reservationController.create.bind(reservationController)
);

/**
 * @swagger
 * /api/reservations/{id}/cancel:
 *   delete:
 *     summary: Cancel a reservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
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
 *                     reservation:
 *                       $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Reservation is not active or does not belong to you
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id/cancel',
  authMiddleware,
  reservationController.cancel.bind(reservationController)
);

/**
 * @swagger
 * /api/reservations/{id}/fulfill:
 *   post:
 *     summary: Fulfill a reservation (convert to loan when picking up the book)
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - loanDueDate
 *             properties:
 *               loanDueDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-02-20T23:59:59.000Z
 *                 description: Due date for the loan
 *     responses:
 *       201:
 *         description: Reservation fulfilled successfully, loan created
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
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Reservation expired, not active, or does not belong to you
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/:id/fulfill',
  authMiddleware,
  validate(fulfillReservationSchema),
  reservationController.fulfill.bind(reservationController)
);

/**
 * @swagger
 * /api/reservations/my-reservations:
 *   get:
 *     summary: Get all reservations of the authenticated user
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
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
 *                     reservations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/my-reservations',
  authMiddleware,
  reservationController.getUserReservations.bind(reservationController)
);

export default router;
