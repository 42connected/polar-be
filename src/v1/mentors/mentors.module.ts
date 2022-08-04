import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keywords } from 'src/entities/keywords.entity';
import { MentorKeywords } from 'src/entities/mentor-keywords.entity';
import { Mentors } from 'src/entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './service/mentors.service';
import { SearchMentorsService } from './service/search-mentors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mentors, MentorKeywords, Keywords])],
  controllers: [MentorsController],
  providers: [MentorsService, SearchMentorsService],
})
export class MentorsModule {}
