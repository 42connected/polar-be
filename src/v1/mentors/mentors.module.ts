import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentors } from '../entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './service/mentors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mentors])],
  controllers: [MentorsController],
  providers: [MentorsService],
  exports: [MentorsService],
})
export class MentorsModule {}
