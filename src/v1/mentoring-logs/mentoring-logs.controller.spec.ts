import { Test, TestingModule } from '@nestjs/testing';
import { MentoringLogsController } from './mentoring-logs.controller';

describe('MentoringLogsController', () => {
  let controller: MentoringLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentoringLogsController],
    }).compile();

    controller = module.get<MentoringLogsController>(MentoringLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
