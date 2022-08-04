import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentoringsService } from './service/mentorings.service';
import { MentorsService } from './service/mentors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mentors, MentoringLogs, Cadets])],
  controllers: [MentorsController],
  providers: [MentorsService, MentoringsService, AuthService],
  exports: [MentorsService, MentoringsService],
})
export class MentorsModule {}
