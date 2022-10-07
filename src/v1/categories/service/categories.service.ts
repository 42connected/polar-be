import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/v1/dto/categories/categories.dto';
import { GetCategoriesDto } from 'src/v1/dto/categories/get-categories.dto';
import { Categories } from 'src/v1/entities/categories.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Categories)
    private categoriesRepository: Repository<Categories>,
  ) {}

  async getCategories(): Promise<GetCategoriesDto[]> {
    try {
      const found: GetCategoriesDto[] = await this.categoriesRepository.find({
        select: { name: true },
        take: 8,
      });
      return found;
    } catch {
      throw new ConflictException();
    }
  }

  async getAllCategories(): Promise<Categories[]> {
    try {
      const categories: Categories[] = await this.categoriesRepository.find({
        relations: {
          keywordCategories: {
            keywords: true,
          },
        },
        select: {
          name: true,
          keywordCategories: true,
        },
      });
      return categories;
    } catch {
      throw new ConflictException();
    }
  }

  formatAllCategories(categories: Categories[]): CategoryDto[] {
    const result = categories.map(category => {
      return {
        name: category.name,
        keywords: category.keywordCategories.map(keywordCategories => {
          return keywordCategories.keywords.name;
        }),
      };
    });
    return result;
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
