import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlackModule } from '../slack/slack.module';
import { SlackService } from '../slack/service/slack.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs]), SlackModule],
  providers: [BatchService, SlackService],
  exports: [BatchService],
})
export class BatchModule {}
