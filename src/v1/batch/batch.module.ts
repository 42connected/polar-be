import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../email/service/email.service';
import { Mentors } from '../entities/mentors.entity';
import { Cadets } from '../entities/cadets.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs, Mentors, Cadets])],
  providers: [BatchService, EmailService],
  exports: [BatchService],
})
export class BatchModule {}
