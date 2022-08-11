import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from './batch.service';

describe('BatchService', () => {
  let service: BatchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BatchService],
    }).compile();

    service = module.get<BatchService>(BatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
