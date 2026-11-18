import { Table } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Seed inicial simulando dados já existentes em produção antes da evolução
    await queryRunner.query(`
      INSERT INTO users (id, full_name, email) VALUES
      ('11111111-1111-1111-1111-111111111111', 'Willon Rodrigues Freitas', 'willon@example.com'),
      ('22222222-2222-2222-2222-222222222222', 'Alan Turing', 'alan@example.com'),
      ('33333333-3333-3333-3333-333333333333', 'Ada', 'ada@example.com')
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
