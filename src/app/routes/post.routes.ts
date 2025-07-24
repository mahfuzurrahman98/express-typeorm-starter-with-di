import { Router } from 'express';
import { container } from 'tsyringe';
import { requireAuth } from '@/app/middlewares/auth.middleware';
import { PostController } from '@/app/controllers/post.controller';
import { requireSystemRole } from '@/app/middlewares/role.middleware';
import { UserRole } from '@/app/enums/user.enum';

const router: Router = Router();
const postController = container.resolve(PostController);

router.post('/', requireAuth, requireSystemRole([UserRole.USER]), postController.create);
router.get('/', postController.list);
router.get('/:id', postController.retrieve);
router.put('/:id', requireSystemRole([UserRole.USER]), postController.update);
router.delete('/:id', requireSystemRole([UserRole.USER]), postController.delete);

export default router;
