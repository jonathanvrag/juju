import { Router } from 'express';
import authRoutes from './authRoutes';
import bookRoutes from './bookRoutes';
import loanRoutes from './loanRoutes';
import reservationRoutes from './reservationRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);
router.use('/loans', loanRoutes);
router.use('/reservations', reservationRoutes);

export default router;
