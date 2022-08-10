import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../entities/admins.entity';
import { BocalsController } from './bocals.controller';
import { BocalsService } from './service/bocals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admins])],
  controllers: [BocalsController],
  providers: [BocalsService],
  exports: [BocalsService],
})
export class BocalsModule {}
