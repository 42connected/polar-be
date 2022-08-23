import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Bocals } from '../entities/bocals.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Reports } from '../entities/reports.entity';
import { BocalsController } from './bocals.controller';
import { BocalsService } from './service/bocals.service';
import { DataRoomService } from './service/data-room.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bocals, MentoringLogs, Reports, Reports]),
    AuthModule,
  ],
  controllers: [BocalsController],
  providers: [BocalsService, DataRoomService],
  exports: [BocalsService],
})
export class BocalsModule {}
