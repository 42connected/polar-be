import { Module } from '@nestjs/common';
import { CadetsController } from './cadets.controller';
import { CadetsService } from './service/cadets.service';

@Module({
  controllers: [CadetsController],
  providers: [CadetsService],
})
export class CadetsModule {}
