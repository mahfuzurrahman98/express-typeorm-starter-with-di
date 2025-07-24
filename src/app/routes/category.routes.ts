import { Router } from 'express';
import { container } from 'tsyringe';
import { requireAuth } from '@/app/middlewares/auth.middleware';
import { CategoryController } from '@/app/controllers/category.controller';
import { requireSystemRole } from '@/app/middlewares/role.middleware';
import { UserRole } from '@/app/enums/user.enum';

const router: Router = Router();
const categoryController = container.resolve(CategoryController);

router.post('/', requireAuth, requireSystemRole(UserRole.ADMIN), categoryController.create);
router.get('/', categoryController.list);
router.get('/:id', categoryController.retrieve);
router.put('/:id', requireAuth, requireSystemRole(UserRole.ADMIN), categoryController.update);
router.delete('/:id', requireAuth, requireSystemRole(UserRole.ADMIN), categoryController.delete);

export default router;
