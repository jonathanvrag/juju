import { Router } from 'express';
import { AdminController } from '../controllers/AdminController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const adminController = new AdminController();

/**
 * @swagger
 * /api/admin/expire-reservations:
 *   post:
 *     summary: Manually expire reservations (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reservations expired successfully
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
 *                     expiredCount:
 *                       type: integer
 *                       example: 3
 *                     message:
 *                       type: string
 *                       example: 3 reservation(s) expired
 *       401:
 *         description: Unauthorized
 */
router.post(
  '/expire-reservations',
  authMiddleware,
  adminController.expireReservations.bind(adminController)
);

/**
 * @swagger
 * /api/admin/health:
 *   get:
 *     summary: Extended health check
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: System health status
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
 *                     server:
 *                       type: string
 *                       example: running
 *                     database:
 *                       type: string
 *                       example: connected
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get('/health', adminController.healthCheck.bind(adminController));

export default router;
