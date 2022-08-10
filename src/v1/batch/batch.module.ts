import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../email/service/email.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs])],
  providers: [BatchService, EmailService],
  exports: [BatchService],
})
export class BatchModule {}
