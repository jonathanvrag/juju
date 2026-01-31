import { Router } from 'express';
import { AuthController } from '../../http/controllers/AuthController';
import { validate } from '../../http/middlewares/validationMiddleware';
import { registerSchema, loginSchema } from '../../http/validators/authValidators';

const router = Router();
const authController = new AuthController();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post(
  '/register',
  validate(registerSchema),
  authController.register.bind(authController)
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validate(loginSchema),
  authController.login.bind(authController)
);

export default router;
