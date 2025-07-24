import { Router } from 'express';
import authRoutes from '@/app/routes/auth.routes';
import userRoutes from '@/app/routes/user.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
