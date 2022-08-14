import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { EmailService } from './service/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs, Mentors, Cadets])],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
