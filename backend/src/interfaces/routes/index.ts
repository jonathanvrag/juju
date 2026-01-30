import { Router } from 'express';
import authRoutes from './authRoutes';
import bookRoutes from './bookRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/books', bookRoutes);

export default router;
