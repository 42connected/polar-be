import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admins } from '../entities/admins.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { BocalsController } from './bocals.controller';
import { BocalsService } from './service/bocals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Admins, MentoringLogs])],
  controllers: [BocalsController],
  providers: [BocalsService],
  exports: [BocalsService],
})
export class BocalsModule {}
