import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Categories } from 'src/v1/entities/categories.entity';
import { KeywordCategories } from 'src/v1/entities/keyword-categories.entity';
import { MentorKeywords } from 'src/v1/entities/mentor-keywords.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';
import { SearchMentorsService } from './search-mentors.service';

describe('SearchMentorService', () => {
  let service: SearchMentorsService;
  let mentoringLogsRepo: Repository<MentoringLogs>;
  let MentorKeywordsRepo: Repository<MentorKeywords>;
  let KeywordCategoriesRepo: Repository<KeywordCategories>;
  let CategoriesRepo: Repository<Categories>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchMentorsService,
        {
          provide: getRepositoryToken(MentoringLogs),
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
        {
          provide: getRepositoryToken(MentorKeywords),
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
        {
          provide: getRepositoryToken(KeywordCategories),
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
        {
          provide: getRepositoryToken(Categories),
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

    service = module.get<SearchMentorsService>(SearchMentorsService);
    mentoringLogsRepo = module.get<Repository<MentoringLogs>>(
      'MentoringLogsRepository',
    );
    MentorKeywordsRepo = module.get<Repository<MentorKeywords>>(
      'MentorKeywordsRepository',
    );
    KeywordCategoriesRepo = module.get<Repository<KeywordCategories>>(
      'KeywordCategoriesRepository',
    );
    CategoriesRepo = module.get<Repository<Categories>>('CategoriesRepository');
  });

  //  describe('getMentorList', () => {
  //    it('', async () => {});
  //  });
  //  describe('getCategoryInfo', () => {
  //    it('', async () => {});
  //  });
  //  describe('getKeywordsIdByCategory', () => {
  //    it('', async () => {});
  //  });
  //  describe('getMentorsInfoByCategory', () => {
  //    it('', async () => {});
  //  });
  //  describe('getRawMentorsInfoByKeywords', () => {
  //    it('', async () => {});
  //  });
  //  describe('getMentorsInfoByKeywords', () => {
  //    it('', async () => {});
  //  });
  //  describe('getMentorListElements', () => {
  //    it('', async () => {});
  //  });
});
