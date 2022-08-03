import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mentors } from 'src/entities/mentors.entity';
import { MentorsController } from './mentors.controller';
import { MentorsService } from './service/mentors.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mentors])],
  controllers: [MentorsController],
  providers: [MentorsService],
})
export class MentorsModule {}
