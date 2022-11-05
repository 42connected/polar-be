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

  /**
   * 카테고리 테이블에 있는 카테고리를 찾아 반환한다.
   * @returns 최대 8개 카테고리 반환
   */
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

  /**
   * @returns 카테고리와 카테고리가 포함하는 키워드 객체를 배열로 반환
   */
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

  /**
   * 인자로 받은 카테고리 배열을 가공하는 함수
   * @returns 카테고리와 카테고리가 포함하는 키워드를 배열로 반환
   */
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

  /**
   * 카테고리 이름과 일치하는 키워드 반환 함수
   * @param name 카테고리 이름
   * @returns 카테고리 이름과 일치하는 키워드 반환
   */
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
