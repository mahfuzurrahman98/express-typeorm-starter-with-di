import { Router } from 'express';
import { container } from 'tsyringe';
import { requireAuth } from '@/app/middlewares/auth.middleware';
import { PostController } from '@/app/controllers/post.controller';

const router: Router = Router();
const postController = container.resolve(PostController);

router.use(requireAuth);

router.post('/', postController.create);
router.get('/', postController.list);
router.get('/:id', postController.retrieve);
router.put('/:id', postController.update);
router.delete('/:id', postController.delete);

export default router;
