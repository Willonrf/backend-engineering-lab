import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../src/database/data-source';

describe('Database & Data Migrations Integrity', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    dataSource = await AppDataSource.initialize();
    await dataSource.dropDatabase();
    await dataSource.synchronize(false);
  });

  afterAll(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy();
    }
  });

  it('should migrate full_name to first_name and last_name without data loss and revert cleanly', async () => {
    // 1. Executa apenas a migration inicial (criação da tabela users)
    await dataSource.runMigrations({ transaction: 'none' });
    // Reverte até deixar apenas a tabela inicial para simular estado de produção legado
    while (
      (await dataSource.query('SELECT COUNT(*) as total FROM migrations'))[0]
        .total > 1
    ) {
      await dataSource.undoLastMigration();
    }

    // 2. Insere registros legados antes da evolução do schema
    await dataSource.query('DELETE FROM users');
    await dataSource.query(`
      INSERT INTO users (id, full_name, email) VALUES
      ('u-1', 'Willon Rodrigues Freitas', 'willon@example.com'),
      ('u-2', 'Ada', 'ada@example.com')
    `);

    // 3. Executa todas as migrations pendentes (Expand -> Data -> Contract)
    const executed = await dataSource.runMigrations();
    expect(executed.length).toBe(3);

    // 4. Valida integridade dos dados transformados
    const usersAfter = await dataSource.query(
      `SELECT id, first_name, last_name, email FROM users ORDER BY id`,
    );
    expect(usersAfter).toEqual([
      {
        id: 'u-1',
        first_name: 'Willon',
        last_name: 'Rodrigues Freitas',
        email: 'willon@example.com',
      },
      { id: 'u-2', first_name: 'Ada', last_name: '', email: 'ada@example.com' },
    ]);

    // 5. Testa reversibilidade (Contract -> Data -> Expand)
    await dataSource.undoLastMigration(); // Desfaz Contract (recria full_name)
    await dataSource.undoLastMigration(); // Desfaz Data Migration (repopula full_name)

    const usersReverted = await dataSource.query(
      `SELECT id, full_name FROM users ORDER BY id`,
    );
    expect(usersReverted).toEqual([
      { id: 'u-1', full_name: 'Willon Rodrigues Freitas' },
      { id: 'u-2', full_name: 'Ada' },
    ]);
  });
});
