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
 * @route   POST /api/reservations
 * @desc    Create a new reservation (reserve a book)
 * @access  Private
 */
router.post(
  '/',
  authMiddleware,
  validate(createReservationSchema),
  reservationController.create.bind(reservationController)
);

/**
 * @route   DELETE /api/reservations/:id/cancel
 * @desc    Cancel a reservation
 * @access  Private
 */
router.delete(
  '/:id/cancel',
  authMiddleware,
  reservationController.cancel.bind(reservationController)
);

/**
 * @route   POST /api/reservations/:id/fulfill
 * @desc    Fulfill a reservation (convert to loan when picking up the book)
 * @access  Private
 */
router.post(
  '/:id/fulfill',
  authMiddleware,
  validate(fulfillReservationSchema),
  reservationController.fulfill.bind(reservationController)
);

/**
 * @route   GET /api/reservations/my-reservations
 * @desc    Get all reservations of the authenticated user
 * @access  Private
 */
router.get(
  '/my-reservations',
  authMiddleware,
  reservationController.getUserReservations.bind(reservationController)
);

export default router;
