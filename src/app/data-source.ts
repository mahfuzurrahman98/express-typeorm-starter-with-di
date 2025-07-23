import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { User } from '@/app/entities/user.entity';
import { Company } from '@/app/entities/company.entity';
import { Project } from '@/app/entities/project.entity';
import { Invitation } from '@/app/entities/invitation.entity';
import { VerificationToken } from '@/app/entities/verification-token.entity';
import { Chat } from '@/app/entities/chat.entity';
import { CompanyMembership } from '@/app/entities/company-membership.entity';
import { ChatMessage } from '@/app/entities/chat-message.entity';
import { EmployeeInvitation } from '@/app/entities/employee-invitation.entity';
import { Step } from '@/app/entities/step.entity';
import { Stage } from '@/app/entities/stage.entity';
import { ProjectActivityLog } from '@/app/entities/project-activity-log.entity';

config();

export const appDataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: false,
    entities: [
        User,
        Company,
        Project,
        ProjectActivityLog,
        Invitation,
        VerificationToken,
        Chat,
        ChatMessage,
        CompanyMembership,
        EmployeeInvitation,
        Stage,
        Step,
    ],
    migrations: [],
    subscribers: [],
});
