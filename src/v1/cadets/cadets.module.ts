import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { ApplyService } from './apply/apply.service';
import { CadetsController } from './cadets.controller';
import { CadetsService } from './service/cadets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cadets, MentoringLogs, Mentors])],
  controllers: [CadetsController],
  providers: [CadetsService, AuthService, ApplyService],
  exports: [CadetsService],
})
export class CadetsModule {}
