import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CadetsSeeder } from './cadets.seeder';
import { MentorsSeeder } from './mentors.seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, CadetsSeeder);
    await runSeeder(dataSource, MentorsSeeder);
  }
}
