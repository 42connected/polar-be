import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cadets } from 'src/entities/cadets.entity';
import { MentoringLogs } from 'src/entities/mentoring-logs.entity';
import { Mentors } from 'src/entities/mentors.entity';
import { Reports } from 'src/entities/reports.entity';
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
