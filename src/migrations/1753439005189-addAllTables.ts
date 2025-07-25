import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAllTables1753439005189 implements MigrationInterface {
    name = 'AddAllTables1753439005189';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "FK_e80687488c364dfe5002c1c2508"`,
        );
        await queryRunner.query(
            `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "posts" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "content" text NOT NULL, "tags" text, "categoryId" uuid NOT NULL, "userId" uuid NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "REL_e80687488c364dfe5002c1c250"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "companyMembershipId"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "invitedBy"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "designation"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(
            `ALTER TYPE "public"."users_systemrole_enum" RENAME TO "users_systemrole_enum_old"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."users_systemrole_enum" AS ENUM('guest', 'admin', 'user')`,
        );
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "systemRole" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "systemRole" TYPE "public"."users_systemrole_enum" USING "systemRole"::"text"::"public"."users_systemrole_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "systemRole" SET DEFAULT 'user'`);
        await queryRunner.query(`DROP TYPE "public"."users_systemrole_enum_old"`);
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_168bf21b341e2ae340748e2541d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`,
        );
        await queryRunner.query(
            `ALTER TABLE "posts" DROP CONSTRAINT "FK_168bf21b341e2ae340748e2541d"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."users_systemrole_enum_old" AS ENUM('guest', 'admin', 'vendor', 'manager', 'member')`,
        );
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "systemRole" DROP DEFAULT`);
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "systemRole" TYPE "public"."users_systemrole_enum_old" USING "systemRole"::"text"::"public"."users_systemrole_enum_old"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "systemRole" SET DEFAULT 'vendor'`,
        );
        await queryRunner.query(`DROP TYPE "public"."users_systemrole_enum"`);
        await queryRunner.query(
            `ALTER TYPE "public"."users_systemrole_enum_old" RENAME TO "users_systemrole_enum"`,
        );
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD "designation" character varying`);
        await queryRunner.query(`ALTER TABLE "users" ADD "invitedBy" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD "companyMembershipId" uuid`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "REL_e80687488c364dfe5002c1c250" UNIQUE ("companyMembershipId")`,
        );
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "FK_e80687488c364dfe5002c1c2508" FOREIGN KEY ("companyMembershipId") REFERENCES "company_memberships"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
    }
}
