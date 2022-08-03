import { Test, TestingModule } from '@nestjs/testing';
import { CadetsService } from './cadets.service';

describe('CadetsService', () => {
  let service: CadetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CadetsService],
    }).compile();

    service = module.get<CadetsService>(CadetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
