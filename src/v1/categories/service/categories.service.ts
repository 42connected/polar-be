import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categories } from 'src/v1/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<Categories[]> {
    try {
      const found = await this.categoriesRepository.find({
        select: { name: true },
        take: 8,
      });
      return found;
    } catch {
      throw new ConflictException();
    }
  }

  async getCategoryByName(name: string): Promise<Categories> {
    let category: Categories;
    try {
      category = await this.categoriesRepository.findOneBy({ name });
    } catch (error) {
      throw new ConflictException(error, '데이터 검색 중 문제가 발생했습니다.');
    }
    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
    return category;
  }
}
