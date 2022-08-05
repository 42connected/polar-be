import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Cadets } from '../entities/cadets.entity';
import { Comments } from '../entities/comments.entity';
import { Mentors } from '../entities/mentors.entity';
import { CommentsController } from './comments.controller';
import { CommentsService } from './service/comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comments, Mentors, Cadets]), AuthModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
