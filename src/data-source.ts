import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const appDataSource = new DataSource({
  type: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  entities: ['src/v1/entities/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
} as DataSourceOptions);
