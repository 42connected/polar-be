import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { Repository } from 'typeorm';
import { MentoringsService } from './mentorings.service';

describe('MentoringsSerivce', () => {
  let service: MentoringsService;
  let MLrepo: Repository<MentoringLogs>;
  let mentorRepo: Repository<Mentors>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentoringsService,
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
          provide: getRepositoryToken(Mentors),
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

    service = module.get<MentoringsService>(MentoringsService);
    MLrepo = module.get<Repository<MentoringLogs>>('MentoringLogsRepository');
    mentorRepo = module.get<Repository<Mentors>>('MentorsRepository');
  });

  describe('getMentoringsList', () => {
    it('DB에 데이터가 존재하지 않는 경우', async () => {
      const jwtUser: jwtUser = {
        id: 'asdadas',
        intraId: 'myintra',
        role: 'mentor',
      };
      jest.spyOn(mentorRepo, 'findOne').mockImplementation(async () => null);
      expect(service.getMentoringsLists(jwtUser)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('멘토가 멘토링 로그를 가지고 있지 않은 경우', async () => {
      const mentor: Mentors = new Mentors();
      mentor.mentoringLogs = [];
      const jwtUser: jwtUser = {
        id: 'asdadas',
        intraId: 'myintra',
        role: 'mentor',
      };
      jest.spyOn(mentorRepo, 'findOne').mockImplementation(async () => mentor);
      expect(await service.getMentoringsLists(jwtUser)).toBeDefined();
    });

    it('멘토가 멘토링 로그를 가지고 있는 경우', async () => {
      const mentor: Mentors = new Mentors();
      const cadet: Cadets = new Cadets();
      cadet.name = 'kang';
      cadet.intraId = 'kanghyki';
      cadet.isCommon = true;
      const ml: MentoringLogs = new MentoringLogs();
      ml.id = '123';
      ml.createdAt = new Date();
      ml.meetingAt = [new Date(), new Date()];
      ml.cadets = cadet;
      ml.topic = 'topic topic';
      ml.status = '진행중';
      ml.requestTime1 = [];
      ml.content = '컨텐츠';
      mentor.mentoringLogs = [ml];
      const jwtUser: jwtUser = {
        id: 'asdadas',
        intraId: 'myintra',
        role: 'mentor',
      };
      jest.spyOn(mentorRepo, 'findOne').mockImplementation(async () => mentor);

      expect(await service.getMentoringsLists(jwtUser)).toBeDefined();
    });
  });

  describe('seeMeetingAt', () => {
    it('해당 ID의 멘토링 로그가 없는 경우', async () => {
      jest.spyOn(MLrepo, 'findOne').mockImplementationOnce(async () => null);
      await expect(
        service.setMeetingAt({
          id: '123123',
          status: '대기중',
          rejectMessage: undefined,
          meetingAt: [],
        }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('meetingAt 이 비정상적으로 전달된 경우', async () => {
      const mlog: MentoringLogs = new MentoringLogs();
      jest.spyOn(MLrepo, 'findOne').mockImplementationOnce(async () => mlog);
      await expect(
        service.setMeetingAt({
          id: '123123',
          status: '대기중',
          rejectMessage: undefined,
          meetingAt: [
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
            new Date(),
          ],
        }),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  describe('getSimpleLogsPagination', () => {
    it('멘토링 로그가 존재하지 않는 경우', async () => {
      jest
        .spyOn(MLrepo, 'findAndCount')
        .mockImplementationOnce(async () => [[], 0]);
      expect(
        await service.getSimpleLogsPagination('m-engeng', { take: 5, page: 1 }),
      ).toEqual([[], 0]);
    });

    it('멘토링 로그가 존재하는 경우', async () => {
      const ml: MentoringLogs = new MentoringLogs();
      jest
        .spyOn(MLrepo, 'findAndCount')
        .mockImplementationOnce(async () => [[ml], 1]);
      expect(
        await service.getSimpleLogsPagination('m-engeng', { take: 5, page: 1 }),
      ).toBeDefined();
    });
  });
});
