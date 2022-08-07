import { Test, TestingModule } from '@nestjs/testing';
import { MentorsController } from './mentors.controller';

describe('MentorsController', () => {
  let controller: MentorsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorsController],
    }).compile();

    controller = module.get<MentorsController>(MentorsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
