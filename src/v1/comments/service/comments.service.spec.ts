import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Comments } from 'src/v1/entities/comments.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';
import { CommentsService } from './comments.service';

describe('CommentsService', () => {
  let service: CommentsService;
  let repo: Repository<Comments>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getRepositoryToken(Comments),
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
            create: jest.fn(),
            delete: jest.fn(),
            findAndCount: jest.fn(),
          },
        },
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
        {
          provide: getRepositoryToken(Cadets),
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

    service = module.get<CommentsService>(CommentsService);
    repo = module.get<Repository<Comments>>('CommentsRepository');

    const MockMentor: Mentors = new Mentors();
    MockMentor.intraId = 'm-engeng';
    jest
      .spyOn(service, 'findMentorByIntraId')
      .mockImplementation(async () => MockMentor);

    const MockCadet: Cadets = new Cadets();
    MockCadet.intraId = 'kanghyki';
    jest
      .spyOn(service, 'findCadetByIntraId')
      .mockImplementation(async () => MockCadet);

    const MockComment: Comments = new Comments();
    MockComment.cadets = MockCadet;
    MockComment.mentors = MockMentor;
    MockComment.content = 'commmmmmmmmmmment';
    jest
      .spyOn(repo, 'findAndCount')
      .mockImplementation(async () => [[MockComment], 1]);

    jest
      .spyOn(service, 'findCommentById')
      .mockImplementation(async () => MockComment);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('createComment', async () => {
    expect(
      await service.createComment('kanghyki', 'm-engeng', {
        content: 'helo',
      }),
    ).toBe('ok');
  });

  it('getCommentPagination', async () => {
    expect(
      await service.getCommentPagination('m-engeng', { take: 5, page: 1 }),
    ).toEqual([
      [
        {
          cadets: {
            intraId: 'kanghyki',
          },
          content: 'commmmmmmmmmmment',
          mentors: {
            intraId: 'm-engeng',
          },
        },
      ],
      1,
    ]);
  });

  it('updateCommnet', async () => {
    expect(
      await service.updateComment('kanghyki', 'as9i9-2139asdk0123-sad', {
        content: 'update',
      }),
    ).toEqual('ok');
  });

  it('deleteComment', async () => {
    expect(
      await service.deleteComment('kanghyki', 'as9i9-2139asdk0123-sad'),
    ).toEqual('ok');
  });
});
