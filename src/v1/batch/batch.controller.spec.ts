import { Test, TestingModule } from '@nestjs/testing';
import { BatchController } from './batch.controller';

describe('BatchController', () => {
  let controller: BatchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BatchController],
    }).compile();

    controller = module.get<BatchController>(BatchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
