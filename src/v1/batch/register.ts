import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { BatchService } from './batch.service';

@Injectable()
export class RegisterBatches implements OnApplicationBootstrap {
  constructor(private readonly batchService: BatchService) {}

  onApplicationBootstrap() {
    this.batchService.registerBatches();
  }
}
