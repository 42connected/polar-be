import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Reports } from 'src/v1/entities/reports.entity';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { ReportsController } from './reports.controller';
import { ReportsService } from './service/reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reports, Mentors, Cadets, MentoringLogs]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService, AuthService],
})
export class ReportsModule {}
