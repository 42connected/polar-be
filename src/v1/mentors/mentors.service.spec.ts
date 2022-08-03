import { Test, TestingModule } from '@nestjs/testing';
import { MentorsService } from './mentors.service';

describe('MentorsService', () => {
  let service: MentorsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorsService],
    }).compile();

    service = module.get<MentorsService>(MentorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
