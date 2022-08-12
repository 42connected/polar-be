import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './service/calendar.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cadets, MentoringLogs, Mentors]),
    AuthModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService],
})
export class CalendarModule {}
