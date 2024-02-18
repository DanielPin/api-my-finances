import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateTableUser1706330464223 implements MigrationInterface {
    name = 'UpdateTableUser1706330464223'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "User" DROP COLUMN "iv"`);
        await queryRunner.query(`ALTER TYPE "public"."User_role_enum" RENAME TO "User_role_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."User_role_enum" AS ENUM('admin', 'user')`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" TYPE "public"."User_role_enum" USING "role"::"text"::"public"."User_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."User_role_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."User_role_enum_old" AS ENUM('admin', 'user', 'adb')`);
        await queryRunner.query(`ALTER TABLE "User" ALTER COLUMN "role" TYPE "public"."User_role_enum_old" USING "role"::"text"::"public"."User_role_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."User_role_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."User_role_enum_old" RENAME TO "User_role_enum"`);
        await queryRunner.query(`ALTER TABLE "User" ADD "iv" character varying NOT NULL`);
    }

}
