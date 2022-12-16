import { MigrationInterface, QueryRunner } from 'typeorm';

export class migration1660638618746 implements MigrationInterface {
  name = 'migration1660638618746';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "bocals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(10), "intra_id" character varying(15) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_fc425bc67545ad0e82ed96e8995" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) NOT NULL, CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "keyword_categories" ("category_id" uuid NOT NULL, "keyword_id" uuid NOT NULL, CONSTRAINT "PK_8cf650c316e6b49de0be32f0419" PRIMARY KEY ("category_id", "keyword_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "keywords" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(15) NOT NULL, CONSTRAINT "UQ_3b06f22a51417a28bacbefac1fd" UNIQUE ("name"), CONSTRAINT "PK_4aa660a7a585ed828da68f3c28e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mentor_keywords" ("mentor_id" uuid NOT NULL, "keyword_id" uuid NOT NULL, CONSTRAINT "PK_0f0253e78d72fc7ab1995e2ad52" PRIMARY KEY ("mentor_id", "keyword_id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "place" character varying(100), "topic" character varying(150), "content" character varying(5000), "image_url" character varying(1000) array DEFAULT '{}', "signature_url" character varying(1000), "feedback_message" character varying(3000), "feedback1" smallint, "feedback2" smallint, "feedback3" smallint, "money" integer, "status" character varying(10) NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "mentors_id" uuid, "cadets_id" uuid, "mentoring_logs_id" uuid, CONSTRAINT "REL_39fc109ddfefdf908d1192bcbc" UNIQUE ("mentoring_logs_id"), CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mentoring_logs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "meeting_at" TIMESTAMP array, "topic" character varying(100) NOT NULL, "content" character varying(1000) NOT NULL, "status" character varying(10) NOT NULL, "reject_message" character varying(500), "request_time1" TIMESTAMP array NOT NULL, "request_time2" TIMESTAMP array, "request_time3" TIMESTAMP array, "mentors_id" uuid, "cadets_id" uuid, CONSTRAINT "PK_33e90fb8f8903523648041037a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "mentors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "intra_id" character varying(15) NOT NULL, "name" character varying(10), "email" character varying(100) NOT NULL, "company" character varying(100), "duty" character varying(100), "profile_image" character varying(1000), "available_time" character varying, "introduction" character varying(150), "tags" character varying(150) array, "is_active" boolean NOT NULL, "markdown_content" character varying(10000), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_67a614446eab992e4d0580afebf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying(300) NOT NULL, "is_deleted" boolean NOT NULL DEFAULT false, "deleted_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "mentors_id" uuid, "cadets_id" uuid, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cadets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "intra_id" character varying(15) NOT NULL, "name" character varying(10), "profile_image" character varying(1000), "resume_url" character varying(1000), "is_common" boolean NOT NULL, "email" character varying(100) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4dfe45a6458152583c442e30cf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "keyword_categories" ADD CONSTRAINT "FK_926e91a61484d97f774fed9240f" FOREIGN KEY ("keyword_id") REFERENCES "keywords"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "keyword_categories" ADD CONSTRAINT "FK_663449aac07cfe60e4dde379bec" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentor_keywords" ADD CONSTRAINT "FK_cf91b16b747c8787e6ef0223063" FOREIGN KEY ("keyword_id") REFERENCES "keywords"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentor_keywords" ADD CONSTRAINT "FK_cfaae84883e9f80107a11560f9e" FOREIGN KEY ("mentor_id") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_fa98355360ed32f5c4a19a8ffe5" FOREIGN KEY ("mentors_id") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_4336574787272d72af863071337" FOREIGN KEY ("cadets_id") REFERENCES "cadets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" ADD CONSTRAINT "FK_39fc109ddfefdf908d1192bcbcc" FOREIGN KEY ("mentoring_logs_id") REFERENCES "mentoring_logs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentoring_logs" ADD CONSTRAINT "FK_61f30d16c93f33363e45e073624" FOREIGN KEY ("mentors_id") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentoring_logs" ADD CONSTRAINT "FK_83baf3fd3d650dd4bab16704524" FOREIGN KEY ("cadets_id") REFERENCES "cadets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_6104a90c1012644172cf281b71b" FOREIGN KEY ("mentors_id") REFERENCES "mentors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_73638d788442fdb448543233911" FOREIGN KEY ("cadets_id") REFERENCES "cadets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_73638d788442fdb448543233911"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_6104a90c1012644172cf281b71b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentoring_logs" DROP CONSTRAINT "FK_83baf3fd3d650dd4bab16704524"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentoring_logs" DROP CONSTRAINT "FK_61f30d16c93f33363e45e073624"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_39fc109ddfefdf908d1192bcbcc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_4336574787272d72af863071337"`,
    );
    await queryRunner.query(
      `ALTER TABLE "reports" DROP CONSTRAINT "FK_fa98355360ed32f5c4a19a8ffe5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentor_keywords" DROP CONSTRAINT "FK_cfaae84883e9f80107a11560f9e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "mentor_keywords" DROP CONSTRAINT "FK_cf91b16b747c8787e6ef0223063"`,
    );
    await queryRunner.query(
      `ALTER TABLE "keyword_categories" DROP CONSTRAINT "FK_663449aac07cfe60e4dde379bec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "keyword_categories" DROP CONSTRAINT "FK_926e91a61484d97f774fed9240f"`,
    );
    await queryRunner.query(`DROP TABLE "cadets"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "mentors"`);
    await queryRunner.query(`DROP TABLE "mentoring_logs"`);
    await queryRunner.query(`DROP TABLE "reports"`);
    await queryRunner.query(`DROP TABLE "mentor_keywords"`);
    await queryRunner.query(`DROP TABLE "keywords"`);
    await queryRunner.query(`DROP TABLE "keyword_categories"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "bocals"`);
  }
}
