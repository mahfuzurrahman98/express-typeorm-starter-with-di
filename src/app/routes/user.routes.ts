import { Router } from 'express';
import { container } from 'tsyringe';
import { requireSystemRole } from '@/app/middlewares/role.middleware';
import { requireActiveUser, requireAuth } from '@/app/middlewares/auth.middleware';
import { UserController } from '@/app/controllers/user.controller';
import { UserRole } from '@/app/enums/user.enum';

const router: Router = Router();

// All user routes require authentication
router.use(requireAuth, requireActiveUser, requireSystemRole([UserRole.ADMIN, UserRole.USER]));

const userController = container.resolve(UserController);

// Get user profile
router.get('/:id/profile', userController.retrieve);

// Update user profile
router.put('/:id/profile', userController.update);

export default router;
