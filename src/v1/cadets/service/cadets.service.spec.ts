import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Repository } from 'typeorm';
import { CadetsService } from './cadets.service';

describe('CadetsService', () => {
  let service: CadetsService;
  let repo: Repository<Cadets>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CadetsService,
        {
          provide: getRepositoryToken(Cadets),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CadetsService>(CadetsService);
    repo = module.get<Repository<Cadets>>('CadetsRepository');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
