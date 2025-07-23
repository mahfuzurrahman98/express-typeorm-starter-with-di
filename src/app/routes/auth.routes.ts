/**
 * Auth Routes
 * Handles authentication endpoints: signin, refresh-token, signout.
 */
import { Router } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '@/app/controllers/auth.controller';

const router: Router = Router();
const authController = container.resolve(AuthController);

// User sign-in
router.post('/signin', authController.signin);

// Refresh JWT token
router.post('/refresh-token', authController.refreshToken);

// User sign-out
router.post('/signout', authController.signout);

export default router;
