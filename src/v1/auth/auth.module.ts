import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BocalsService } from '../bocals/service/bocals.service';
import { CadetsService } from '../cadets/service/cadets.service';
import { Bocals } from '../entities/bocals.entity';
import { Cadets } from '../entities/cadets.entity';
import { Comments } from '../entities/comments.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { Reports } from '../entities/reports.entity';
import { MentorsService } from '../mentors/service/mentors.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Mentors,
      Comments,
      MentoringLogs,
      Cadets,
      Bocals,
      Reports,
    ]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, MentorsService, CadetsService, BocalsService],
  exports: [AuthService],
})
export class AuthModule {}
