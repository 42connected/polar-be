import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MentoringLogsRepository } from '../mentors/repository/mentoring-logs.repository';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './repository/reports.repository';
import { ReportsService } from './service/reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportsRepository, MentoringLogsRepository]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
