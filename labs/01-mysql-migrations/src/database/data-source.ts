import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'lab_user',
  password: process.env.DB_PASS || 'lab_pass',
  database: process.env.DB_NAME || 'migrations_lab',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  migrationsTransactionMode: 'each',
  synchronize: false,
  logging: ['migration', 'error'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
