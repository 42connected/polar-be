import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { BatchService } from './batch.service';

@Injectable()
export class MentoringLogScheduler {
  constructor(private readonly batchService: BatchService) {}

  @Cron('0 * * * * *')
  handleCron() {
    this.batchService.manageMentoringLogsEveryMinute();
  }
}
