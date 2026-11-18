import type { MigrationInterface, QueryRunner } from 'typeorm';

export class MigrateUserNamesData1700000002000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const users: Array<{ id: string; full_name: string }> =
      await queryRunner.query(
        `SELECT id, full_name FROM users WHERE full_name IS NOT NULL`,
      );

    for (const user of users) {
      const trimmed = user.full_name.trim();
      const spaceIndex = trimmed.indexOf(' ');

      const firstName =
        spaceIndex === -1 ? trimmed : trimmed.slice(0, spaceIndex);
      const lastName =
        spaceIndex === -1 ? '' : trimmed.slice(spaceIndex + 1).trim();

      await queryRunner.query(
        `UPDATE users SET first_name = ?, last_name = ? WHERE id = ?`,
        [firstName, lastName, user.id],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reconstroi o dado original caso precise reverter o Contract -> Data Migration
    await queryRunner.query(`
      UPDATE users
      SET full_name = TRIM(CONCAT(COALESCE(first_name, ''), ' ', COALESCE(last_name, '')))
      WHERE first_name IS NOT NULL
    `);
  }
}
