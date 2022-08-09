import { Controller, Get, Post, Query, Req } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { query } from 'express';
import { BatchService } from './batch.service';

@Controller()
export class BatchController {
  constructor(private batchService: BatchService) {}

  @Get('/start')
  start() {
    //const fortyEightHours = 172800000;
    const testFiveMin = 300000;
    this.batchService.addTimeout(
      '539aef9d-a5ba-4a2e-b2f9-115ed1f74da2',
      testFiveMin,
    );
  }

  @Get('/check')
  check() {
    this.batchService.getTimeoutlists();
  }

  @Get('/stop')
  stop() {}
}
