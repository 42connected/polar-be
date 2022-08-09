import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MentoringLogs])],
  providers: [BatchService],
  exports: [BatchService],
  controllers: [BatchController],
})
export class BatchModule {}
