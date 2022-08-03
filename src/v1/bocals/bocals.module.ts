import { Module } from '@nestjs/common';
import { BocalsController } from './bocals.controller';
import { BocalsService } from './service/bocals.service';

@Module({
  controllers: [BocalsController],
  providers: [BocalsService],
})
export class BocalsModule {}
