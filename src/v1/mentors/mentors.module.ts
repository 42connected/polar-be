import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Keywords } from 'src/v1/entities/keywords.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { Mentors } from '../entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './service/mentors.service';
import { SearchMentorsService } from './service/search-mentors.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentors, MentorKeywords, Keywords]),
    AuthModule,
  ],
  controllers: [MentorsController],
  providers: [MentorsService, SearchMentorsService],
  exports: [MentorsService],
})
export class MentorsModule {}
