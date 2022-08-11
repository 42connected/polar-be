import { Controller, Get } from '@nestjs/common';
import { BatchService } from './batch.service';

@Controller()
export class BatchController {
  constructor(private batchService: BatchService) {}

  @Get()
  testCancelMail() {
    this.batchService.cancelMeetingAuto(
      '539aef9d-a5ba-4a2e-b2f9-115ed1f74da2',
      10000,
    );
  }
}
