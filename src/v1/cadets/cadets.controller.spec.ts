import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { CadetsController } from './cadets.controller';
import { CadetsService } from './service/cadets.service';

const moduleMocker = new ModuleMocker(global);

describe('CadetsController', () => {
  let controller: CadetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CadetsController],
    })
      .useMocker(token => {
        console.log(typeof token, token);
        // if (token === CadetsService) {
        //   const result = { asdf: jest.fn().mockResolvedValue('results') };
        //   console.log('qwer', result);
        //   return result;
        // }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          const result = new Mock();
          return result;
        }
      })
      .compile();

    controller = module.get<CadetsController>(CadetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
