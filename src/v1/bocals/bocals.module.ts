import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bocals } from '../entities/bocals.entity';
import { BocalsController } from './bocals.controller';
import { BocalsService } from './service/bocals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bocals])],
  controllers: [BocalsController],
  providers: [BocalsService],
  exports: [BocalsService],
})
export class BocalsModule {}
