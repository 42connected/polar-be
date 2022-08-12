import { Controller, Get } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Categories } from '../entities/categories.entity';
import { CategoriesService } from './service/categories.service';

@Controller()
@ApiTags('categories API')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({
    summary: 'getcategories API',
    description: '카테고리 가져오기 api',
  })
  @ApiCreatedResponse({
    description: '카테고리 받아오기 성공',
    type: Promise<Categories[]>,
  })
  getCategories(): Promise<Categories[]> {
    return this.categoriesService.getCategories();
  }
}
