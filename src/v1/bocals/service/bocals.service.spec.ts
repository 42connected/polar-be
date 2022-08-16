import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Bocals } from 'src/v1/entities/bocals.entity';
import { Repository } from 'typeorm';
import { BocalsService } from './bocals.service';
describe('BocalsService', () => {
  let service: BocalsService;
  let repo: Repository<Bocals>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BocalsService,
        {
          provide: getRepositoryToken(Bocals),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            findAndCount: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BocalsService>(BocalsService);
    repo = module.get<Repository<Bocals>>('BocalsRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
