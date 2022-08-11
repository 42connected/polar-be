import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cadets } from '../entities/cadets.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { ApplyService } from './apply/apply.service';
import { CadetsController } from './cadets.controller';
import { CadetsService } from './service/cadets.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Cadets, MentoringLogs, Mentors]),
    AuthModule,
  ],
  controllers: [CadetsController],
  providers: [CadetsService, ApplyService],
  exports: [CadetsService],
})
export class CadetsModule {}
