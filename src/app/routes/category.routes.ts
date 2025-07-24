import { Router } from 'express';
import { container } from 'tsyringe';
import { requireAuth } from '@/app/middlewares/auth.middleware';
import { CategoryController } from '@/app/controllers/category.controller';

const router: Router = Router();
const categoryController = container.resolve(CategoryController);

router.use(requireAuth);

router.post('/', categoryController.create);
router.get('/', categoryController.list);
router.get('/:id', categoryController.retrieve);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
