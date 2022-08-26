import { Test, TestingModule } from '@nestjs/testing';
import { MentoringLogsService } from './mentoring-logs.service';

describe('MentoringLogsService', () => {
  let service: MentoringLogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentoringLogsService],
    }).compile();

    service = module.get<MentoringLogsService>(MentoringLogsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
