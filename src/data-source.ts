import { DataSource, DataSourceOptions } from 'typeorm';

export const appDataSource = new DataSource({
  type: 'postgres',
  database: 'postgres',
  entities: ['**/*.entity.ts'],
  migrations: [__dirname + '/migrations/*.ts'],
  host: 'localhost',
  port: 55000,
  username: 'postgres',
  password: 'postgrespw',
  synchronize: false,
} as DataSourceOptions);
