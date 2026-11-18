import { TableColumn } from 'typeorm';
import type { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractFullNameColumn1700000003000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumns('users', [
      {
        oldColumn: new TableColumn({
          name: 'first_name',
          type: 'varchar',
          length: '100',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'first_name',
          type: 'varchar',
          length: '100',
          isNullable: false,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'last_name',
          type: 'varchar',
          length: '150',
          isNullable: true,
        }),
        newColumn: new TableColumn({
          name: 'last_name',
          type: 'varchar',
          length: '150',
          isNullable: false,
        }),
      },
    ]);

    await queryRunner.dropColumn('users', 'full_name');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'full_name',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );

    await queryRunner.changeColumns('users', [
      {
        oldColumn: new TableColumn({
          name: 'first_name',
          type: 'varchar',
          length: '100',
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'first_name',
          type: 'varchar',
          length: '100',
          isNullable: true,
        }),
      },
      {
        oldColumn: new TableColumn({
          name: 'last_name',
          type: 'varchar',
          length: '150',
          isNullable: false,
        }),
        newColumn: new TableColumn({
          name: 'last_name',
          type: 'varchar',
          length: '150',
          isNullable: true,
        }),
      },
    ]);
  }
}
