import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../email/service/email.service';
import { BatchController } from './batch.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs])],
  providers: [BatchService, EmailService],
  exports: [BatchService],
  controllers: [BatchController],
})
export class BatchModule {}
