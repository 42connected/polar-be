import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mentors } from '../../entities/mentors.entity';
import { MentorsService } from './mentors.service';
import { AvailableTimeDto } from 'src/v1/dto/available-time.dto';
import { UpdateMentorDatailDto } from 'src/v1/dto/mentors/mentor-detail.dto';

//jest
//  .spyOn(service, 'findMentorByIntraId')
//  .mockImplementationOnce(async () => entity);
//jest.spyOn(repo, 'save').mockImplementationOnce(async () => entity);

describe('MentorsService', () => {
  let service: MentorsService;
  let repo: Repository<Mentors>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MentorsService,
        {
          provide: getRepositoryToken(Mentors),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MentorsService>(MentorsService);
    repo = module.get<Repository<Mentors>>('MentorsRepository');
  });
  //describe('Init', () => {
  //  it('should be defined', () => {
  //    expect(service).toBeDefined();
  //  });
  //});

  //describe('getMentorDetails', () => {
  //  it('null 체크', async () => {
  //    await expect(service.getMentorDetails(null)).rejects.toThrowError(
  //      BadRequestException,
  //    );
  //  });

  describe('getMentorDetails', () => {
    it('null', async () => {
      await expect(service.getMentorDetails(null)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('undefined', async () => {
      await expect(service.getMentorDetails(undefined)).rejects.toThrowError(
        NotFoundException,
      );
    });

    it('find', async () => {
      const MockMentor: Mentors = new Mentors();
      MockMentor.intraId = 'm-engeng';
      jest
        .spyOn(repo, 'findOneBy')
        .mockImplementationOnce(async () => MockMentor);

      expect(await service.getMentorDetails('m-engeng')).toBeDefined();
    });
  });

  describe('updateMentorDetails', () => {
    it('availableTime Empty Array', async () => {
      const MockMentor: Mentors = new Mentors();
      MockMentor.intraId = 'm-engeng';
      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => MockMentor);
      expect(
        await service.updateMentorDetails('m-engeng', {
          availableTime: [],
          introduction: '한줄 소개',
          isActive: true,
          markdownContent: '마크다운 컨텐츠',
        }),
      ).toBe('ok');
    });

    it('availableTime Array is A Large', async () => {
      const MockMentor: Mentors = new Mentors();
      MockMentor.intraId = 'm-engeng';
      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => MockMentor);

      const largeAvailableTime: AvailableTimeDto[][] = [
        [
          {
            start_hour: 1,
            start_minute: 0,
            end_hour: 2,
            end_minute: 30,
          },
        ],
      ];
      for (let i = 0; i < 100; ++i) {
        largeAvailableTime.push([
          {
            start_hour: 1,
            start_minute: 0,
            end_hour: 2,
            end_minute: 30,
          },
        ]);
      }

      const updateMentorDto: UpdateMentorDatailDto = {
        availableTime: largeAvailableTime,
        introduction: '한줄 소개',
        isActive: true,
        markdownContent: '마크다운 컨텐츠',
      };

      await expect(
        service.updateMentorDetails('m-engeng', updateMentorDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('Duplicated time', async () => {
      const MockMentor: Mentors = new Mentors();
      MockMentor.intraId = 'm-engeng';
      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => MockMentor);

      const largeElementAvailableTime: AvailableTimeDto[][] = [
        [
          {
            start_hour: 1,
            start_minute: 0,
            end_hour: 2,
            end_minute: 30,
          },
        ],
      ];
      for (let i = 0; i < 100; ++i) {
        largeElementAvailableTime[0].push({
          start_hour: i,
          start_minute: 0,
          end_hour: i,
          end_minute: 0,
        });
      }
      // Make 7days
      for (let i = 0; i < 6; ++i) {
        largeElementAvailableTime.push([]);
      }

      const updateMentorDto: UpdateMentorDatailDto = {
        availableTime: largeElementAvailableTime,
        introduction: '한줄 소개',
        isActive: true,
        markdownContent: '마크다운 컨텐츠',
      };

      await expect(
        service.updateMentorDetails('m-engeng', updateMentorDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('availableTime minute is without 0 or 30', async () => {
      const MockMentor: Mentors = new Mentors();
      MockMentor.intraId = 'm-engeng';
      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => MockMentor);

      const AvailableTime: AvailableTimeDto[][] = [
        [
          {
            start_hour: 1,
            start_minute: 1,
            end_hour: 2,
            end_minute: 59,
          },
        ],
      ];
      // Make 7days
      for (let i = 0; i < 6; ++i) {
        AvailableTime.push([]);
      }

      const updateMentorDto: UpdateMentorDatailDto = {
        availableTime: AvailableTime,
        introduction: '한줄 소개',
        isActive: true,
        markdownContent: '마크다운 컨텐츠',
      };

      await expect(
        service.updateMentorDetails('m-engeng', updateMentorDto),
      ).rejects.toThrowError(BadRequestException);
    });

    it('availableTime is smaller than 1 hours', async () => {
      const MockMentor: Mentors = new Mentors();
      MockMentor.intraId = 'm-engeng';
      jest.spyOn(repo, 'findOneBy').mockImplementation(async () => MockMentor);

      const AvailableTime: AvailableTimeDto[][] = [
        [
          {
            start_hour: 1,
            start_minute: 0,
            end_hour: 1,
            end_minute: 59,
          },
        ],
      ];
      // Make 7days
      for (let i = 0; i < 6; ++i) {
        AvailableTime.push([]);
      }

      const updateMentorDto: UpdateMentorDatailDto = {
        availableTime: AvailableTime,
        introduction: '한줄 소개',
        isActive: true,
        markdownContent: '마크다운 컨텐츠',
      };

      await expect(
        service.updateMentorDetails('m-engeng', updateMentorDto),
      ).rejects.toThrowError(BadRequestException);
    });
  });

  console.log('asd');
});
