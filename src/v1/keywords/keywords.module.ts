import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keywords } from '../entities/keywords.entity';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './service/keywords.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keywords])],
  controllers: [KeywordsController],
  providers: [KeywordsService],
})
export class KeywordsModule {}
