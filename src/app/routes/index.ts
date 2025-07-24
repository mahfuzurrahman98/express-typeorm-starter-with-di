import { Router } from 'express';
import authRoutes from '@/app/routes/auth.routes';
import userRoutes from '@/app/routes/user.routes';
import categoryRoutes from '@/app/routes/category.routes';
import postRoutes from '@/app/routes/post.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/categories', categoryRoutes);
router.use('/posts', postRoutes);

export default router;
