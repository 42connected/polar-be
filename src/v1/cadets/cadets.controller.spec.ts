import { Test, TestingModule } from '@nestjs/testing';
import { CadetsController } from './cadets.controller';

describe('CadetsController', () => {
  let controller: CadetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CadetsController],
    }).compile();

    controller = module.get<CadetsController>(CadetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
