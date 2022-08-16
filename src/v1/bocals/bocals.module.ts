import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Bocals } from '../entities/bocals.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { BocalsController } from './bocals.controller';
import { BocalsService } from './service/bocals.service';

@Module({
  imports: [TypeOrmModule.forFeature([Bocals, MentoringLogs]), AuthModule],
  controllers: [BocalsController],
  providers: [BocalsService],
  exports: [BocalsService],
})
export class BocalsModule {}
