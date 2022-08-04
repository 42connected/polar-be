import { Module } from '@nestjs/common';
import { ApplyController } from './apply.controller';
import { ApplyService } from './apply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { AuthService } from 'src/v1/auth/auth.service';
import { Mentors } from 'src/v1/entities/mentors.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs, Mentors])],
  controllers: [ApplyController],
  providers: [ApplyService, AuthService],
  exports: [ApplyService],
})
export class ApplyModule {}
