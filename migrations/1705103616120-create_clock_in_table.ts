import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateClockInTable1705103616120 implements MigrationInterface {
  public async up(qRun: QueryRunner): Promise<void> {
    await qRun.query(`CREATE TABLE \`clock_in\` (
      \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
      \`momento\` DATETIME NOT NULL,
      \`user_id\` INT UNSIGNED NOT NULL,
    PRIMARY KEY (\`id\`))`);
  }

  public async down(qR: QueryRunner): Promise<void> {
    await qR.query('DROP TABLE `clock_in`');
  }
}
