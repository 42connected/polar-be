import { Test, TestingModule } from '@nestjs/testing';
import { BocalsService } from './bocals.service';

describe('BocalsService', () => {
  let service: BocalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BocalsService],
    }).compile();

    service = module.get<BocalsService>(BocalsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
