import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Categories } from '../entities/categories.entity';
import { KeywordCategories } from '../entities/keyword-categories.entity';
import { Keywords } from '../entities/keywords.entity';
import { MentorKeywords } from '../entities/mentor-keywords.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './service/categories.service';
import { KeywordsService } from './service/keywords.service';
import { SearchMentorsService } from './service/search-mentors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Categories,
      Mentors,
      MentorKeywords,
      MentoringLogs,
      KeywordCategories,
      Keywords,
    ]),
    AuthModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, SearchMentorsService, KeywordsService],
})
export class CategoriesModule {}
