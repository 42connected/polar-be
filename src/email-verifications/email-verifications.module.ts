import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { EmailVerificationController } from './email-verification.controllers';
import { EmailVerificationService } from './email-verifications.service';
import * as redisStore from 'cache-manager-ioredis';
import { EmailModule } from 'src/v1/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mentors, Cadets]),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
    }),
    EmailModule,
  ],
  controllers: [EmailVerificationController],
  providers: [EmailVerificationService],
})
export class EmailVerificationModule {}
