import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb682589986521 implements MigrationInterface {
  name = 'SeedDb1682589986521';

  public async up(queryRunner: QueryRunner): Promise<void> {
    /*  await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee')`,
    );

    await queryRunner.query(
      //password - 123
      `INSERT INTO users (username, email, password) VALUES ('foo', 'foo@gmail.com', '$2b$10$cTtSyG1IMliPWj7IhEZVgeslc1PrxhWX9Itd.sYcpnjTwgYtbnqze')`,
    ); */

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList" , "authorId") VALUES ('first-article-12s', 'First article', 'first article desc', 'first article body', 'coffee', 4)`,
    );
  }

  public async down(): Promise<void> {}
}
