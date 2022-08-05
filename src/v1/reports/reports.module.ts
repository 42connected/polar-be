import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
<<<<<<< HEAD
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Reports } from 'src/v1/entities/reports.entity';
=======
import { AuthService } from '../auth/auth.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Reports } from '../entities/reports.entity';
>>>>>>> 8097738fcefee9dc68369633aa3b7f9a85d1cd1a
import { ReportsController } from './reports.controller';
import { ReportsService } from './service/reports.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reports, MentoringLogs])],
  controllers: [ReportsController],
  providers: [ReportsService, AuthService],
})
export class ReportsModule {}
