import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { AuthModule } from '../auth/auth.module';
import { Keywords } from 'src/v1/entities/keywords.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { Mentors } from '../entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentoringsService } from './service/mentorings.service';
import { MentorsService } from './service/mentors.service';
import { SearchMentorsService } from '../categories/service/search-mentors.service';
import { KeywordCategories } from '../entities/keyword-categories.entity';
import { Categories } from '../entities/categories.entity';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/service/email.service';
import { KeywordsService } from '../categories/service/keywords.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mentors,
      MentorKeywords,
      KeywordCategories,
      Keywords,
      Categories,
      MentoringLogs,
      Cadets,
    ]),
    AuthModule,
    EmailModule,
  ],
  controllers: [MentorsController],
  providers: [
    MentorsService,
    SearchMentorsService,
    MentoringsService,
    EmailService,
    KeywordsService,
  ],
  exports: [MentorsService, MentoringsService],
})
export class MentorsModule {}
