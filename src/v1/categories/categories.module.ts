import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Categories } from '../entities/categories.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './service/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Categories]), AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
