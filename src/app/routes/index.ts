import { Router, Request, Response, NextFunction } from 'express';
import authRoutes from '@/app/routes/auth.routes';
import projectRoutes from '@/app/routes/project.routes';
import invitationRoutes from '@/app/routes/invitation.routes';
import testRoutes from '@/app/routes/test.routes';
import onboardingRoutes from '@/app/routes/onboarding.routes';
import companyRoutes from '@/app/routes/company.routes';
import chatRoutes from '@/app/routes/chat.routes';
import employeeRoutes from '@/app/routes/employee.routes';
import userRoutes from '@/app/routes/user.routes';
import stepRoutes from '@/app/routes/step.routes';
import stageRoutes from '@/app/routes/stage.routes';
import { FileAccessController } from '@/app/controllers/file-access.controller';
import { attachUser } from '@/app/middlewares/auth.middleware';
import { container } from 'tsyringe';

const router: Router = Router();

router.use('/onboarding', onboardingRoutes);
router.use('/auth', authRoutes);
router.use('/companies', companyRoutes);
router.use('/invitations', invitationRoutes);
router.use('/projects', projectRoutes);
router.use('/chats', chatRoutes);
router.use('/employees', employeeRoutes);
router.use('/users', userRoutes);
router.use('/steps', stepRoutes);
router.use('/stages', stageRoutes);

const fileAccessController = container.resolve(FileAccessController);

// File access route
router.get(
    '/storage/*splat',
    attachUser,
    (request: Request, response: Response, next: NextFunction) => {
        const splat: string[] = request.params.splat as unknown as string[];
        request.params.storagePath = splat.join('/');
        next();
    },
    fileAccessController.accessFile,
);

// test rotues
router.use('/test', testRoutes);

export default router;
