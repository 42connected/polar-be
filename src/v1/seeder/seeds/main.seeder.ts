import { DataSource } from 'typeorm';
import { runSeeder, Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CadetsSeeder } from './cadets.seeder';
import { CommentsSeeder } from './comments.seeder';
import { KeywordsSeeder } from './keywords.seeder';
import { MentorKeywordsSeeder } from './mentor-keywords.seeder';
import { MentorsSeeder } from './mentors.seeder';

export class MainSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, CadetsSeeder);
    await runSeeder(dataSource, MentorsSeeder);
    await runSeeder(dataSource, CommentsSeeder);
    await runSeeder(dataSource, KeywordsSeeder);
    // await runSeeder(dataSource, MentorKeywordsSeeder);
  }
}
