import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { ReportsController } from './reports.controller';
import { ReportsRepository } from './repository/reports.repository';
import { ReportsService } from './service/reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportsRepository, MentoringLogs]),
    AuthModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
