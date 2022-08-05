import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from '../auth/auth.service';
import { Cadets } from '../entities/cadets.entity';
import { CadetsController } from './cadets.controller';
import { CadetsService } from './service/cadets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Cadets])],
  controllers: [CadetsController],
  providers: [CadetsService, AuthService],
  exports: [CadetsService],
})
export class CadetsModule {}
