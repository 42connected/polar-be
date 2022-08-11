import { Controller, Get } from '@nestjs/common';
import { Categories } from '../entities/categories.entity';
import { CategoriesService } from './service/categories.service';

@Controller()
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  getCategories(): Promise<Categories[]> {
    return this.categoriesService.getCategories();
  }
}
