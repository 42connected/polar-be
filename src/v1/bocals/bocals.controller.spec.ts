import { Test, TestingModule } from '@nestjs/testing';
import { BocalsController } from './bocals.controller';

describe('AdminsController', () => {
  let controller: BocalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BocalsController],
    }).compile();

    controller = module.get<BocalsController>(BocalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
