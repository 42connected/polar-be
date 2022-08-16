import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailService } from '../email/service/email.service';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { EmailTestController } from './email-test.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs])],
  providers: [EmailService],
  controllers: [EmailTestController],
})
export class EmailTestModule {}
