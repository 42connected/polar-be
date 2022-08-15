import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { EmailService } from '../email/service/email.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { MentoringLogsController } from './mentoring-logs.controller';
import { MentoringLogsService } from './service/mentoring-logs.service';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs]), AuthModule],
  controllers: [MentoringLogsController],
  providers: [MentoringLogsService, EmailService],
})
export class MentoringLogsModule {}
