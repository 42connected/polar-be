import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1659511913498 implements MigrationInterface {
    name = 'migration1659511913498'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admins" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(10) NOT NULL, "intraId" character varying(15) NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP NOT NULL, CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "keywords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) NOT NULL, CONSTRAINT "PK_4aa660a7a585ed828da68f3c28e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentor_keywords" ("mentorId" uuid NOT NULL, "keywordId" uuid NOT NULL, CONSTRAINT "PK_94d7a1a33f09abfe923a43b09e4" PRIMARY KEY ("mentorId", "keywordId"))`);
        await queryRunner.query(`CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "topic" character varying(150) NOT NULL, "content" character varying(5000) NOT NULL, "imageUrl" character varying(1000) NOT NULL DEFAULT '[]', "feedbackMessage" character varying(3000) NOT NULL, "feedback1" smallint NOT NULL, "feedback2" smallint NOT NULL, "feedback3" smallint NOT NULL, "mentorsId" uuid, "cadetsId" uuid, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "intraId" character varying(15) NOT NULL, "name" character varying(10) NOT NULL, "profileImage" character varying(1000) NOT NULL, "availabeTime" TIME array NOT NULL DEFAULT '{}', "introduction" character varying(150) NOT NULL, "isActive" boolean NOT NULL, "markdownContent" character varying(10000) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_67a614446eab992e4d0580afebf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mentoring_logs" ("id" SERIAL NOT NULL, "meetingAt" TIMESTAMP NOT NULL, "topic" character varying(100) NOT NULL, "content" character varying(1000) NOT NULL, "status" character varying(10) NOT NULL, "rejectMessage" character varying(500) NOT NULL, "reportStatus" character varying(10) NOT NULL, "requestTime1" TIMESTAMP NOT NULL, "requestTime2" TIMESTAMP NOT NULL, "requestTime3" TIMESTAMP NOT NULL, "mentorsId" uuid, "cadetsId" uuid, "reportsId" uuid, CONSTRAINT "REL_b0100c99389ca4f99bad0b51c7" UNIQUE ("reportsId"), CONSTRAINT "PK_33e90fb8f8903523648041037a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cadets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "intraId" character varying(15) NOT NULL, "name" character varying(10) NOT NULL, "profileImage" character varying(1000) NOT NULL, "isCommon" boolean NOT NULL, "deletedAt" TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4dfe45a6458152583c442e30cf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "isDeleted" boolean NOT NULL, "deletedAt" TIMESTAMP, "updateAt" TIMESTAMP NOT NULL DEFAULT now(), "mentorsId" uuid, "cadetsId" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "mentor_keywords" ADD CONSTRAINT "FK_a329d481efd2951ad15cc73fcef" FOREIGN KEY ("keywordId") REFERENCES "keywords"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentor_keywords" ADD CONSTRAINT "FK_194b6fb66a5ec6cdb4afbd158ac" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_d95c4fb0f5511ba73bc03fafe1c" FOREIGN KEY ("mentorsId") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_896fcb0ac8133f39b19a0ae4d08" FOREIGN KEY ("cadetsId") REFERENCES "cadets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentoring_logs" ADD CONSTRAINT "FK_f0f2a83fd6179b82ce1780d74e2" FOREIGN KEY ("mentorsId") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentoring_logs" ADD CONSTRAINT "FK_c8b0f9a3c0025b11c3d34ee8c7d" FOREIGN KEY ("cadetsId") REFERENCES "cadets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentoring_logs" ADD CONSTRAINT "FK_b0100c99389ca4f99bad0b51c75" FOREIGN KEY ("reportsId") REFERENCES "reports"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_e71af7b6a90d91b732ab35d867c" FOREIGN KEY ("mentorsId") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comments" ADD CONSTRAINT "FK_95dcb3d9d301b383a05b96c979b" FOREIGN KEY ("cadetsId") REFERENCES "cadets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_95dcb3d9d301b383a05b96c979b"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP CONSTRAINT "FK_e71af7b6a90d91b732ab35d867c"`);
        await queryRunner.query(`ALTER TABLE "mentoring_logs" DROP CONSTRAINT "FK_b0100c99389ca4f99bad0b51c75"`);
        await queryRunner.query(`ALTER TABLE "mentoring_logs" DROP CONSTRAINT "FK_c8b0f9a3c0025b11c3d34ee8c7d"`);
        await queryRunner.query(`ALTER TABLE "mentoring_logs" DROP CONSTRAINT "FK_f0f2a83fd6179b82ce1780d74e2"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_896fcb0ac8133f39b19a0ae4d08"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_d95c4fb0f5511ba73bc03fafe1c"`);
        await queryRunner.query(`ALTER TABLE "mentor_keywords" DROP CONSTRAINT "FK_194b6fb66a5ec6cdb4afbd158ac"`);
        await queryRunner.query(`ALTER TABLE "mentor_keywords" DROP CONSTRAINT "FK_a329d481efd2951ad15cc73fcef"`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`DROP TABLE "cadets"`);
        await queryRunner.query(`DROP TABLE "mentoring_logs"`);
        await queryRunner.query(`DROP TABLE "mentors"`);
        await queryRunner.query(`DROP TABLE "reports"`);
        await queryRunner.query(`DROP TABLE "mentor_keywords"`);
        await queryRunner.query(`DROP TABLE "keywords"`);
        await queryRunner.query(`DROP TABLE "admins"`);
    }

}
