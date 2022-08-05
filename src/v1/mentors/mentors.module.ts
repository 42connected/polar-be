import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { AuthModule } from '../auth/auth.module';
import { Keywords } from 'src/v1/entities/keywords.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { Mentors } from '../entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentoringsService } from './service/mentorings.service';
import { MentorsService } from './service/mentors.service';
import { SearchMentorsService } from './service/search-mentors.service';

@Module({
imports: [
    TypeOrmModule.forFeature([Mentors, MentorKeywords, Keywords, MentoringLogs, Cadets]),
    AuthModule,
  ],
  controllers: [MentorsController],
  providers: [MentorsService, SearchMentorsService, MentoringsService, AuthService],
  exports: [MentorsService, MentoringsService],
})

export class MentorsModule {}
