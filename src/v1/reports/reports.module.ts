import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { Reports } from '../entities/reports.entity';
import { ReportsController } from './reports.controller';
import { ReportsService } from './service/reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reports, Mentors, Cadets, MentoringLogs]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
